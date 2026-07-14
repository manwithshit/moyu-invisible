// 核心注入逻辑：视频识别、皮肤挂载、全屏滤镜模式、老板键、一键还原
// 原则：不碰视频流、不 reparent 视频元素，只用 CSS 控制其尺寸/位置
//
// 关键机制（v0.2，针对小红书等真实站点实测问题）：
// 1. 播放器容器常带 transform/filter → 视频的 position:fixed 失效且 z-index 被困在
//    祖先层叠上下文里（被假界面盖住）。解法：中和祖先链上所有制造层叠上下文的属性，
//    抬高祖先链 z-index，并把祖先链之外的兄弟节点 visibility:hidden
// 2. 站点播放器脚本会持续改写 video 的 style → 600ms 看门狗持续复位
if (!window.__MOYU_INJECTED__) {
  window.__MOYU_INJECTED__ = true;

  const Z_OVERLAY = 2147483600;
  const Z_VIDEO = 2147483601;
  const log = (...a) => console.log('[Moyu Invisible]', ...a);

  const S = {
    mode: null, // 'skin' | 'fullscreen' | null
    skin: null,
    filter: null,
    video: null,
    overlay: null,
    styleEl: null,
    origStyle: null, // 视频元素原始 style 属性
    origMuted: null,
    bossHidden: false,
    cleanups: [],
    onResize: null,
    touched: [], // 被改过 style 的页面元素：{ el, style } 用于还原
    touchedSet: new WeakSet(),
    watchdog: null,
  };
  window.__MOYU_STATE__ = S;

  const BASE_CSS =
    'html,body{overflow:hidden !important;}' +
    '#__moyu_overlay{position:fixed;inset:0;z-index:' + Z_OVERLAY + ';' +
    'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;' +
    'font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;visibility:visible !important;}' +
    ':where(#__moyu_overlay,#__moyu_overlay *){box-sizing:border-box;margin:0;padding:0;cursor:default;user-select:none;}' +
    '#__moyu_overlay ul{list-style:none;}' +
    // 视频祖先链被抬到假界面之上后，祖先自身不能画出任何东西（背景/边框/文字/伪元素），
    // 否则会把假界面盖住（小红书的黑色模态蒙层就在祖先链上）
    '[data-moyu-chain]{background:transparent !important;border:none !important;' +
    'box-shadow:none !important;outline:none !important;color:transparent !important;' +
    'text-shadow:none !important;pointer-events:none !important;}' +
    '[data-moyu-chain]::before,[data-moyu-chain]::after{display:none !important;content:none !important;}';

  // ---------- 视频元素识别 ----------
  function area(el) {
    const r = el.getBoundingClientRect();
    return r.width * r.height;
  }

  function findVideoTarget() {
    // 优先级 1：面积最大的可见 <video>
    const vids = [...document.querySelectorAll('video')].filter((v) => area(v) > 10000);
    if (vids.length) return vids.sort((a, b) => area(b) - area(a))[0];
    // 优先级 2：面积最大且 src 含播放器特征的 iframe
    const frames = [...document.querySelectorAll('iframe')]
      .filter((f) => area(f) > 40000)
      .sort((a, b) => area(b) - area(a));
    if (!frames.length) return null;
    const kw = /(play|player|live|video|stream|embed|tv|cdn)/i;
    return frames.find((f) => kw.test(f.src || '')) || frames[0];
  }

  // ---------- 祖先链提权（解决 transform 困住 fixed / 层叠上下文压住视频） ----------
  function markStyle(el) {
    if (S.touchedSet.has(el)) return;
    S.touchedSet.add(el);
    S.touched.push({ el, style: el.getAttribute('style') });
  }

  function elevateVideoChain(video) {
    let count = 0;
    let el = video;
    while (el && el !== document.documentElement && el.parentElement) {
      const parent = el.parentElement;
      // 1) 隐藏祖先链之外的兄弟节点（假界面/样式表除外）
      for (const sib of parent.children) {
        if (sib === el) continue;
        if (sib.id === '__moyu_overlay' || sib.id === '__moyu_style' || sib.id === '__moyu_ctrl') continue;
        if (sib.tagName === 'STYLE' || sib.tagName === 'SCRIPT' || sib.tagName === 'LINK') continue;
        if (sib.contains(video)) continue;
        markStyle(sib);
        sib.style.setProperty('visibility', 'hidden', 'important');
      }
      // 2) 中和祖先自身制造层叠上下文/困住 fixed 的属性，抬高 z-index，
      //    并让祖先完全透明（背景等由 [data-moyu-chain] 样式规则 + 内联双保险清除）
      if (el !== video) {
        markStyle(el);
        el.setAttribute('data-moyu-chain', '');
        const st = el.style;
        st.setProperty('transform', 'none', 'important');
        st.setProperty('filter', 'none', 'important');
        st.setProperty('backdrop-filter', 'none', 'important');
        st.setProperty('perspective', 'none', 'important');
        st.setProperty('clip-path', 'none', 'important');
        st.setProperty('mask', 'none', 'important');
        st.setProperty('contain', 'none', 'important');
        st.setProperty('will-change', 'auto', 'important');
        st.setProperty('opacity', '1', 'important');
        st.setProperty('z-index', String(Z_VIDEO), 'important');
        st.setProperty('visibility', 'visible', 'important');
        st.setProperty('background', 'transparent', 'important');
        st.setProperty('border', 'none', 'important');
        st.setProperty('box-shadow', 'none', 'important');
        count++;
      }
      el = parent;
    }
    log('祖先链提权完成，处理祖先', count, '个，隐藏兄弟节点', S.touched.length - count, '个');
  }

  // ---------- 视频定位（position:fixed 覆盖到皮肤插槽上方） ----------
  function setVideoRect(rect) {
    const v = S.video;
    if (!v) return;
    const st = v.style;
    const imp = (k, val) => st.setProperty(k, val, 'important');
    imp('position', 'fixed');
    imp('left', rect.left + 'px');
    imp('top', rect.top + 'px');
    imp('width', rect.width + 'px');
    imp('height', rect.height + 'px');
    imp('max-width', 'none');
    imp('max-height', 'none');
    imp('min-width', '0');
    imp('min-height', '0');
    imp('margin', '0');
    imp('padding', '0');
    imp('transform', 'none');
    imp('border', 'none');
    imp('border-radius', '0');
    imp('z-index', String(Z_VIDEO));
    imp('background', '#000');
    // 皮肤插槽用 cover 裁满（竖屏 3:4 视频裁中间，伪装效果好）；
    // 全屏/小窗模式用 contain 加黑边（竖屏视频完整可看，黑底本来就是黑的）
    imp('object-fit', S.mode === 'fullscreen' ? 'contain' : 'cover');
    imp('visibility', S.bossHidden ? 'hidden' : 'visible');
    imp('display', 'block');
    imp('opacity', '1');
    imp('pointer-events', 'auto'); // 祖先链 pointer-events:none，视频自身要重新开启
  }

  function positionVideo() {
    if (!S.overlay || !S.video) return;
    if (S.mode === 'fullscreen') {
      setVideoRect({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight });
      return;
    }
    const skin = window.__MOYU_SKINS__[S.skin];
    const slot = S.overlay.querySelector(skin.videoSlot);
    if (slot) setVideoRect(slot.getBoundingClientRect());
  }

  // ---------- 视频接管 / 释放（信息流站点切换视频时复用） ----------
  function adoptVideo(v) {
    S.video = v;
    S.origStyle = v.getAttribute('style') || '';
    S.origMuted = v.tagName === 'VIDEO' ? v.muted : null;
    if (S.bossHidden && v.tagName === 'VIDEO') v.muted = true;
    if (S.mode !== 'filter') {
      elevateVideoChain(v);
      positionVideo();
    }
    window.__moyuFilter.apply(v, S.filter);
  }

  function releaseVideo() {
    const v = S.video;
    if (!v || !document.contains(v)) return;
    if (S.origStyle) v.setAttribute('style', S.origStyle);
    else v.removeAttribute('style');
    if (S.mode !== 'filter') {
      // 旧视频的祖先链已被提权透明化，回到原布局位置会从假界面上方漏出来——必须藏住，
      // 并记入 touched 以便一键还原时恢复
      if (!S.touchedSet.has(v)) {
        S.touchedSet.add(v);
        S.touched.push({ el: v, style: S.origStyle });
      }
      v.style.setProperty('visibility', 'hidden', 'important');
    }
  }

  // ---------- 看门狗：对抗站点脚本改写 video 样式 / 销毁重建 / 信息流切换 ----------
  function startWatchdog() {
    stopWatchdog();
    S.watchdog = setInterval(() => {
      if (!S.mode) return;
      if (!S.video || !document.contains(S.video)) {
        // video 被站点销毁重建：重新识别并接管
        const v = findVideoTarget();
        if (v) {
          log('video 元素被站点重建，重新接管', v);
          adoptVideo(v);
        }
        return;
      }
      // 信息流站点（抖音/B站等）键盘或滚动切换视频：
      // 当前视频停了且页面里有别的视频在播 → 跟随接管新视频
      if (S.video.tagName === 'VIDEO' && (S.video.paused || S.video.ended)) {
        const playing = [...document.querySelectorAll('video')].filter(
          (x) => x !== S.video && !x.paused && !x.ended && x.readyState >= 2
        );
        if (playing.length) {
          const next = playing.sort((a, b) => area(b) - area(a))[0];
          log('检测到视频切换（信息流翻页），跟随接管新视频');
          releaseVideo();
          adoptVideo(next);
          return;
        }
      }
      // 持续复位位置与滤镜（站点播放器会改写 style；写入相同值无副作用）
      // 独立滤镜模式不接管位置，只维持滤镜
      if (S.mode !== 'filter') positionVideo();
      window.__moyuFilter.apply(S.video, S.filter);
    }, 600);
  }

  function stopWatchdog() {
    if (S.watchdog) { clearInterval(S.watchdog); S.watchdog = null; }
  }

  // ---------- 挂载 / 卸载 ----------
  function teardownOverlay() {
    S.cleanups.forEach((fn) => { try { fn(); } catch (e) {} });
    S.cleanups = [];
    if (S.onResize) { window.removeEventListener('resize', S.onResize); S.onResize = null; }
    if (S.overlay) { S.overlay.remove(); S.overlay = null; }
    if (S.styleEl) { S.styleEl.remove(); S.styleEl = null; }
  }

  function mountOverlay(css, html) {
    S.styleEl = document.createElement('style');
    S.styleEl.id = '__moyu_style';
    S.styleEl.textContent = BASE_CSS + css;
    document.documentElement.appendChild(S.styleEl);
    S.overlay = document.createElement('div');
    S.overlay.id = '__moyu_overlay';
    S.overlay.innerHTML = html;
    (document.body || document.documentElement).appendChild(S.overlay);
    S.onResize = () => positionVideo();
    window.addEventListener('resize', S.onResize);
  }

  function grabVideo() {
    let video = S.video && document.contains(S.video) ? S.video : findVideoTarget();
    if (!video) return null;
    if (video !== S.video) {
      S.origStyle = video.getAttribute('style') || '';
      S.origMuted = video.tagName === 'VIDEO' ? video.muted : null;
      S.video = video;
    }
    return video;
  }

  // ---------- 动作 ----------
  // 原生全屏（Fullscreen API）的 top layer 会盖住任何 z-index 的假界面，
  // 启用伪装前必须先退出（如小红书播放器的全屏按钮）
  function exitNativeFullscreen() {
    if (document.fullscreenElement) {
      try { document.exitFullscreen(); } catch (e) {}
    }
  }

  function applySkin(skinId, filter) {
    const skin = (window.__MOYU_SKINS__ || {})[skinId];
    if (!skin) return { ok: false, error: '未知皮肤：' + skinId };
    exitNativeFullscreen();
    if (!grabVideo()) return { ok: false, error: '未识别到视频元素，请先在页面里开始播放直播，再重新启用' };
    log('应用皮肤', skinId, '目标视频：', S.video.tagName, Math.round(area(S.video)) + 'px²');
    teardownOverlay();
    mountOverlay(skin.css, skin.html);
    S.mode = 'skin';
    S.skin = skinId;
    S.filter = filter || { ...skin.defaultFilter };
    elevateVideoChain(S.video);
    positionVideo();
    window.__moyuFilter.apply(S.video, S.filter);
    window.__moyuDisguise.enable(skin.title, skin.favicon);
    if (typeof skin.onMount === 'function') {
      const cleanup = skin.onMount(S.overlay);
      if (typeof cleanup === 'function') S.cleanups.push(cleanup);
    }
    startWatchdog();
    // 皮肤布局渲染后再校准一次插槽位置（字体/滚动条就绪后 rect 可能微移）
    setTimeout(positionVideo, 100);
    const slot = S.overlay.querySelector(skin.videoSlot);
    log('插槽位置', slot && JSON.stringify(slot.getBoundingClientRect()));
    return { ok: true, mode: S.mode, skin: skinId, filter: S.filter };
  }

  // 全屏/小窗模式下的页内悬浮调节条：小窗（popup 类型窗口）没有工具栏，
  // 打不开插件面板，滤镜只能靠这个页内控件调。平时隐藏，鼠标移到窗口底部浮现
  const CTRL_CSS =
    '#__moyu_ctrl{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);' +
    'z-index:2147483602;background:rgba(18,18,22,.92);border-radius:10px;padding:8px 14px;' +
    'display:flex;align-items:center;gap:12px;font-size:11px;color:#c9cdd4;' +
    'opacity:0;pointer-events:none;transition:opacity .2s;white-space:nowrap;' +
    'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;}' +
    '#__moyu_ctrl.show{opacity:1;pointer-events:auto;}' +
    '#__moyu_ctrl label{display:flex;align-items:center;gap:5px;}' +
    '#__moyu_ctrl input{width:80px;accent-color:#00c8c8;pointer-events:auto;margin:0;}' +
    '#__moyu_ctrl button{background:#2a2a2e;color:#c9cdd4;border:none;border-radius:5px;' +
    'padding:3px 10px;font-size:11px;pointer-events:auto;cursor:pointer;}' +
    '#__moyu_ctrl .hint{color:#6f757e;}';

  function mountFullscreenCtrl() {
    const ctrl = document.createElement('div');
    ctrl.id = '__moyu_ctrl';
    ctrl.innerHTML =
      '<label>饱和<input type="range" id="__moyu_sat" min="0" max="100"></label>' +
      '<label>亮度<input type="range" id="__moyu_bri" min="70" max="100"></label>' +
      '<button id="__moyu_gray">全灰</button>' +
      '<button id="__moyu_back">⤢ 还原大窗</button>' +
      '<span class="hint">⌃M 隐藏/恢复</span>';
    document.body.appendChild(ctrl);
    const sat = ctrl.querySelector('#__moyu_sat');
    const bri = ctrl.querySelector('#__moyu_bri');
    sat.value = Math.round((S.filter.saturate != null ? S.filter.saturate : 0.3) * 100);
    bri.value = Math.round((S.filter.brightness != null ? S.filter.brightness : 0.9) * 100);
    const save = () => { try { chrome.storage.local.set({ filter: S.filter }); } catch (e) {} };
    const push = () => {
      S.filter = { saturate: Number(sat.value) / 100, brightness: Number(bri.value) / 100 };
      window.__moyuFilter.apply(S.video, S.filter);
      save();
    };
    sat.addEventListener('input', push);
    bri.addEventListener('input', push);
    ctrl.querySelector('#__moyu_gray').addEventListener('click', () => {
      S.filter = { preset: 'gray' };
      window.__moyuFilter.apply(S.video, S.filter);
      save();
    });
    // 小窗（popup 窗口）没有工具栏打不开插件面板，这个按钮是切回大窗的唯一入口
    ctrl.querySelector('#__moyu_back').addEventListener('click', () => {
      try { chrome.runtime.sendMessage({ action: 'toggleWindow' }); } catch (e) {}
    });
    const onMove = (e) => ctrl.classList.toggle('show', e.clientY > window.innerHeight - 80);
    window.addEventListener('mousemove', onMove);
    S.cleanups.push(() => { window.removeEventListener('mousemove', onMove); ctrl.remove(); });
  }

  function applyFullscreen(filter) {
    exitNativeFullscreen();
    if (!grabVideo()) return { ok: false, error: '未识别到视频元素，请先在页面里开始播放直播，再重新启用' };
    log('启用全屏滤镜模式，目标视频：', S.video.tagName);
    teardownOverlay();
    // 全屏模式：overlay 只是纯黑底（防止视频加载时露出站点 UI），视频铺满视口
    mountOverlay('#__moyu_overlay{background:#000;}' + CTRL_CSS, '');
    S.mode = 'fullscreen';
    S.skin = null;
    S.filter = filter || { saturate: 0.3, brightness: 0.9 }; // 强制启用滤镜
    elevateVideoChain(S.video);
    positionVideo();
    window.__moyuFilter.apply(S.video, S.filter);
    window.__moyuDisguise.enable('文档1 - 已保存', { text: '文', color: '#2b579a' });
    mountFullscreenCtrl();
    startWatchdog();
    return { ok: true, mode: S.mode, filter: S.filter };
  }

  function setFilter(filter) {
    // 未启用换皮/全屏时，滤镜直接作用于原网页的视频（独立滤镜模式）
    if (!S.mode) {
      if (!grabVideo()) return { ok: false, error: '未识别到视频元素，请先开始播放' };
      S.mode = 'filter';
      startWatchdog();
      log('独立滤镜模式：直接作用于原网页视频');
    }
    if (!S.video) return { ok: false, error: '未识别到视频元素' };
    S.filter = filter;
    window.__moyuFilter.apply(S.video, S.filter);
    log('滤镜更新', JSON.stringify(filter), '→', window.__moyuFilter.build(filter));
    return { ok: true, mode: S.mode, filter: S.filter };
  }

  function toggleBoss() {
    if (!S.video || !S.mode) return { ok: false, error: '当前未启用伪装' };
    S.bossHidden = !S.bossHidden;
    S.video.style.setProperty('visibility', S.bossHidden ? 'hidden' : 'visible', 'important');
    if (S.video.tagName === 'VIDEO') {
      S.video.muted = S.bossHidden ? true : !!S.origMuted;
    }
    return { ok: true, hidden: S.bossHidden };
  }

  function restore() {
    stopWatchdog();
    teardownOverlay();
    window.__moyuDisguise.disable();
    // 还原所有被改过的页面元素（祖先链 + 被隐藏的兄弟节点）
    for (const t of S.touched) {
      if (!document.contains(t.el)) continue;
      if (t.style === null) t.el.removeAttribute('style');
      else t.el.setAttribute('style', t.style);
    }
    S.touched = [];
    S.touchedSet = new WeakSet();
    document.querySelectorAll('[data-moyu-chain]').forEach((el) => el.removeAttribute('data-moyu-chain'));
    if (S.video && document.contains(S.video)) {
      if (S.origStyle) S.video.setAttribute('style', S.origStyle);
      else S.video.removeAttribute('style');
      if (S.video.tagName === 'VIDEO' && S.origMuted !== null) S.video.muted = S.origMuted;
    }
    S.mode = null;
    S.skin = null;
    S.bossHidden = false;
    S.video = null;
    S.origStyle = null;
    S.origMuted = null;
    log('已还原页面');
    return { ok: true };
  }

  // ---------- 消息路由 ----------
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    let res;
    switch (msg && msg.action) {
      case 'applySkin':   res = applySkin(msg.skin, msg.filter); break;
      case 'fullscreen':  res = applyFullscreen(msg.filter); break;
      case 'setFilter':   res = setFilter(msg.filter); break;
      case 'bossKey':     res = toggleBoss(); break;
      case 'restore':     res = restore(); break;
      case 'getState':    res = { ok: true, mode: S.mode, skin: S.skin, filter: S.filter, hidden: S.bossHidden }; break;
      default:            res = { ok: false, error: 'unknown action' };
    }
    sendResponse(res);
    return false;
  });

  log('content script 已注入');
}
