// 皮肤 C：视频剪辑（剪映桌面版风格，深色主题）
// v2：直播流放在左上角素材面板的第一格缩略图里（"素材在预览"人设，画面极小），
// 中上预览窗显示静态假定格画面，右侧草稿参数，底部多轨时间线 + 缓慢移动的播放头
window.__MOYU_SKINS__ = window.__MOYU_SKINS__ || {};
window.__MOYU_SKINS__.editor = {
  id: 'editor',
  name: '视频剪辑',
  title: '剪辑项目 - 未命名草稿',
  favicon: { text: '剪', color: '#0d0d0d' },
  defaultFilter: { saturate: 0.8, brightness: 0.95 },
  videoSlot: '#me-live-thumb',
  css: `
#__moyu_overlay{background:#101012;color:#c5c6c9;display:flex;flex-direction:column;font-size:12px;}
.me-top{height:40px;flex-shrink:0;display:flex;align-items:center;padding:0 12px;gap:10px;background:#161618;}
.me-title{position:absolute;left:50%;transform:translateX(-50%);font-size:13px;color:#e3e4e6;}
.me-top-r{margin-left:auto;display:flex;gap:8px;}
.me-btn{height:26px;border-radius:6px;padding:0 12px;display:flex;align-items:center;gap:4px;background:#2a2a2e;font-size:12px;}
.me-btn.cta{background:#00c8c8;color:#04262a;font-weight:600;}
.me-mid{flex:1;display:flex;min-height:0;}
.me-rail{width:56px;flex-shrink:0;background:#161618;display:flex;flex-direction:column;align-items:center;padding-top:8px;gap:2px;}
.me-rail div{width:48px;padding:7px 0;border-radius:6px;text-align:center;font-size:10px;color:#8b8d92;}
.me-rail div i{display:block;font-size:15px;font-style:normal;margin-bottom:2px;}
.me-rail div.on{color:#00c8c8;background:#202024;}
.me-lib{width:300px;flex-shrink:0;background:#141416;border-right:1px solid #232326;padding:10px;display:flex;flex-direction:column;gap:10px;}
.me-lib-head{display:flex;align-items:center;gap:8px;}
.me-import{height:26px;border-radius:6px;background:#00c8c8;color:#04262a;font-weight:600;display:flex;align-items:center;padding:0 10px;}
.me-search{flex:1;height:26px;border-radius:6px;background:#202024;color:#6f7176;display:flex;align-items:center;padding:0 8px;font-size:11px;}
.me-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.me-thumb{border-radius:6px;overflow:hidden;position:relative;}
.me-thumb .pic{aspect-ratio:16/9;}
.me-thumb .nm{font-size:10px;color:#8b8d92;padding:4px 2px;}
.me-thumb .added{position:absolute;top:4px;left:4px;font-size:9px;background:rgba(0,0,0,.65);color:#e3e4e6;border-radius:3px;padding:1px 5px;}
.me-thumb .dur{position:absolute;right:4px;bottom:22px;font-size:9px;background:rgba(0,0,0,.65);border-radius:3px;padding:0 4px;color:#e3e4e6;}
.me-center{flex:1;min-width:0;display:flex;flex-direction:column;background:#0c0c0e;}
.me-player-head{height:32px;display:flex;align-items:center;padding:0 14px;color:#8b8d92;font-size:12px;flex-shrink:0;}
.me-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 20px;}
#me-screen{background:#000;aspect-ratio:16/9;max-width:100%;max-height:100%;width:100%;position:relative;overflow:hidden;}
.me-still{position:absolute;inset:0;background:linear-gradient(180deg,#5a6a7d 0%,#8a94a2 34%,#3c4250 35%,#2b3038 62%,#43413a 63%,#37352f 100%);filter:saturate(.55) brightness(.85);}
.me-still::before{content:'';position:absolute;left:12%;top:35%;width:16%;height:28%;background:#23272e;box-shadow:150px 10px 0 #1d2126,320px -6px 0 #262b33;}
.me-still-sub{position:absolute;left:50%;transform:translateX(-50%);bottom:12%;background:rgba(0,0,0,.55);color:#fff;font-size:clamp(11px,1.1vw,16px);padding:4px 14px;border-radius:4px;white-space:nowrap;}
.me-still-pause{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;font-size:20px;display:flex;align-items:center;justify-content:center;}
.me-player-ctrl{height:40px;flex-shrink:0;display:flex;align-items:center;padding:0 14px;gap:14px;font-size:12px;}
.me-tc{color:#00c8c8;font-variant-numeric:tabular-nums;}
.me-tc-total{color:#6f7176;}
.me-player-ctrl .mid{position:absolute;left:50%;transform:translateX(-50%);font-size:15px;}
.me-player-ctrl .r{margin-left:auto;display:flex;gap:8px;color:#8b8d92;}
.me-player-ctrl .r span{background:#202024;border-radius:4px;padding:2px 8px;font-size:11px;}
.me-props{width:264px;flex-shrink:0;background:#141416;border-left:1px solid #232326;padding:14px;display:flex;flex-direction:column;}
.me-props h3{font-size:13px;color:#e3e4e6;margin-bottom:14px;font-weight:600;}
.me-prop{display:flex;margin-bottom:12px;font-size:11px;}
.me-prop .k{width:76px;color:#6f7176;flex-shrink:0;}
.me-prop .v{color:#c5c6c9;word-break:break-all;}
.me-modify{margin-top:auto;align-self:flex-end;height:26px;border-radius:6px;background:#2a2a2e;padding:0 16px;display:flex;align-items:center;}
.me-tl{height:236px;flex-shrink:0;background:#141416;border-top:1px solid #232326;display:flex;flex-direction:column;position:relative;}
.me-tl-bar{height:36px;display:flex;align-items:center;padding:0 12px;gap:14px;color:#8b8d92;font-size:13px;flex-shrink:0;}
.me-tl-bar .r{margin-left:auto;display:flex;align-items:center;gap:10px;}
.me-zoom{width:120px;height:3px;border-radius:2px;background:#2a2a2e;position:relative;}
.me-zoom i{position:absolute;left:55%;top:-4px;width:11px;height:11px;border-radius:50%;background:#c5c6c9;}
.me-ruler{height:20px;flex-shrink:0;display:flex;color:#5c5e64;font-size:9px;position:relative;margin-left:88px;background:repeating-linear-gradient(90deg,#2c2c30 0 1px,transparent 1px 30px);}
.me-ruler span{width:240px;flex-shrink:0;padding:3px 0 0 4px;}
.me-tracks{flex:1;overflow:hidden;position:relative;padding-left:88px;}
.me-track{height:100%;position:relative;}
.me-trhead{position:absolute;left:0;width:80px;display:flex;align-items:center;gap:6px;color:#5c5e64;font-size:10px;padding-left:12px;}
.me-row-text{position:absolute;top:8px;left:88px;right:0;height:30px;}
.me-row-video{position:absolute;top:48px;left:88px;right:0;height:64px;}
.me-row-audio{position:absolute;top:120px;left:88px;right:0;height:36px;}
.me-th-text{top:8px;height:30px;}
.me-th-video{top:48px;height:64px;}
.me-th-audio{top:120px;height:36px;}
.me-clip-t{position:absolute;top:0;height:100%;border-radius:4px;background:#b5563e;color:#ffe3da;font-size:10px;display:flex;align-items:center;padding:0 8px;overflow:hidden;white-space:nowrap;}
.me-clip-v{position:absolute;top:0;height:100%;border-radius:4px;overflow:hidden;background:repeating-linear-gradient(90deg,#1d5c5c 0 26px,#227070 26px 52px);border:1px solid #2e8585;}
.me-clip-v .spd{position:absolute;top:3px;left:4px;font-size:9px;background:rgba(0,0,0,.55);border-radius:3px;padding:0 4px;color:#9adede;}
.me-clip-a{position:absolute;top:0;height:100%;border-radius:4px;background:#1c3f5e repeating-linear-gradient(90deg,rgba(94,169,255,.55) 0 2px,transparent 2px 5px);opacity:.9;}
.me-playhead{position:absolute;top:0;bottom:0;width:1px;background:#fff;z-index:5;left:230px;animation:me-ph 1800s linear forwards;}
.me-playhead::before{content:'';position:absolute;top:0;left:-4px;border:5px solid transparent;border-top:6px solid #fff;}
@keyframes me-ph{to{left:92%;}}
`,
  html: `
<div class="me-top">
  <span style="color:#6f7176">≡ 菜单</span>
  <span class="me-title">未命名草稿 (1)</span>
  <div class="me-top-r"><span class="me-btn">分享</span><span class="me-btn cta">⬆ 导出</span></div>
</div>
<div class="me-mid">
  <div class="me-rail">
    <div class="on"><i>▶</i>素材</div><div><i>♪</i>音频</div><div><i>T</i>文本</div><div><i>☺</i>贴纸</div>
    <div><i>✦</i>特效</div><div><i>⇄</i>转场</div><div><i>▤</i>字幕</div><div><i>◈</i>滤镜</div>
  </div>
  <div class="me-lib">
    <div class="me-lib-head"><span class="me-import">＋ 导入</span><span class="me-search">搜索素材…</span></div>
    <div style="color:#8b8d92">全部</div>
    <div class="me-grid">
      <div class="me-thumb"><div class="pic" id="me-live-thumb" style="background:#0c0c0e"></div><span class="added">已添加</span><span class="dur">02:18</span><div class="nm">01.mp4</div></div>
      <div class="me-thumb"><div class="pic" style="background:linear-gradient(135deg,#4a5a72,#2a3444)"></div><span class="added">已添加</span><span class="dur">00:59</span><div class="nm">02.mp4</div></div>
      <div class="me-thumb"><div class="pic" style="background:linear-gradient(135deg,#6e5a3a,#3f3422)"></div><span class="dur">01:44</span><div class="nm">街拍素材.mp4</div></div>
      <div class="me-thumb"><div class="pic" style="background:linear-gradient(135deg,#5a3a56,#33222f)"></div><span class="dur">03:07</span><div class="nm">采访.mov</div></div>
    </div>
  </div>
  <div class="me-center">
    <div class="me-player-head">播放器 – 时间线01<span style="margin-left:auto">≡</span></div>
    <div class="me-stage"><div id="me-screen"><div class="me-still"></div><span class="me-still-pause">❚❚</span><span class="me-still-sub">今天带大家逛一逛周末的市集</span></div></div>
    <div class="me-player-ctrl" style="position:relative">
      <span><span class="me-tc" id="me-tc">00:00:12:00</span> <span class="me-tc-total">/ 00:03:39:13</span></span>
      <span class="mid">▶</span>
      <div class="r"><span>原画</span><span>比例</span><span>⛶</span></div>
    </div>
  </div>
  <div class="me-props">
    <h3>草稿参数</h3>
    <div class="me-prop"><span class="k">草稿名称</span><span class="v">未命名草稿 (1)</span></div>
    <div class="me-prop"><span class="k">保存位置</span><span class="v">/Users/me/Movies/Projects/draft_0706</span></div>
    <div class="me-prop"><span class="k">色彩空间</span><span class="v">Rec.709 SDR</span></div>
    <div class="me-prop"><span class="k">导入方式</span><span class="v">保留在原有位置</span></div>
    <div class="me-prop"><span class="k">自由层级</span><span class="v">已开启</span></div>
    <div class="me-prop"><span class="k">代理模式</span><span class="v">未开启</span></div>
    <div class="me-prop"><span class="k">比例</span><span class="v">适应</span></div>
    <div class="me-prop"><span class="k">分辨率</span><span class="v">适应</span></div>
    <div class="me-prop"><span class="k">草稿帧率</span><span class="v">30.00帧/秒</span></div>
    <span class="me-modify">修改</span>
  </div>
</div>
<div class="me-tl">
  <div class="me-tl-bar">
    <span>＋</span><span>↶</span><span>↷</span><span>✂</span><span>▣</span><span>◫</span>
    <div class="r"><span>🎙</span><span>−</span><div class="me-zoom"><i></i></div><span>＋</span></div>
  </div>
  <div class="me-ruler"><span>00:00</span><span>00:30</span><span>01:00</span><span>01:30</span><span>02:00</span><span>02:30</span><span>03:00</span><span>03:30</span></div>
  <div class="me-tracks">
    <div class="me-trhead me-th-text">T 文本</div>
    <div class="me-trhead me-th-video">▶ 视频</div>
    <div class="me-trhead me-th-audio">♪ 音频</div>
    <div class="me-row-text">
      <div class="me-clip-t" style="left:2%;width:16%">片头 · 开场白</div>
      <div class="me-clip-t" style="left:20%;width:22%">Part1 · 街景空镜</div>
      <div class="me-clip-t" style="left:44%;width:24%">Part2 · 人物采访</div>
      <div class="me-clip-t" style="left:70%;width:18%">结尾 · 总结</div>
    </div>
    <div class="me-row-video">
      <div class="me-clip-v" style="left:2%;width:34%"><span class="spd">变速 1.1x</span></div>
      <div class="me-clip-v" style="left:36.5%;width:31%"></div>
      <div class="me-clip-v" style="left:68%;width:22%"></div>
    </div>
    <div class="me-row-audio">
      <div class="me-clip-a" style="left:2%;width:88%"></div>
    </div>
    <div class="me-playhead"></div>
  </div>
</div>
`,
  // 时间码真实走帧（30fps）
  onMount(root) {
    const el = root.querySelector('#me-tc');
    if (!el) return null;
    const start = Date.now();
    const base = 12 * 30; // 从 00:00:12:00 开始（帧数）
    const pad = (n) => String(n).padStart(2, '0');
    const t = setInterval(() => {
      const f = base + Math.floor((Date.now() - start) / 1000) * 30;
      const sec = Math.floor(f / 30);
      el.textContent =
        pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor((sec % 3600) / 60)) + ':' + pad(sec % 60) + ':' + pad(f % 30);
    }, 1000);
    return () => clearInterval(t);
  },
};
