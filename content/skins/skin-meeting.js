// 皮肤 B：视频会议（飞书风格）
// 关键设计：直播流不放主屏，伪装成右侧参会人列表中的一个摄像头小窗（tile ≤ 200×120）
// 主屏放静态假共享 PPT，底部会议控制条，会议时长真实走秒
window.__MOYU_SKINS__ = window.__MOYU_SKINS__ || {};
window.__MOYU_SKINS__.meeting = {
  id: 'meeting',
  name: '视频会议',
  title: '视频会议 - Q3 项目周会',
  favicon: { text: '会', color: '#3370ff' },
  defaultFilter: { saturate: 0.4, brightness: 0.9 },
  videoSlot: '#mm-cam',
  css: `
#__moyu_overlay{background:#17181a;color:#e8e9ea;display:flex;flex-direction:column;}
.mm-top{height:44px;display:flex;align-items:center;padding:0 16px;gap:12px;font-size:13px;flex-shrink:0;}
.mm-topic{font-weight:600;font-size:14px;}
.mm-timer{color:#a2a6ad;font-variant-numeric:tabular-nums;}
.mm-net{color:#34c724;font-size:12px;}
.mm-rec{margin-left:auto;color:#a2a6ad;font-size:12px;display:flex;align-items:center;gap:6px;}
.mm-rec i{width:8px;height:8px;border-radius:50%;background:#f54a45;display:inline-block;animation:mm-blink 2s infinite;}
@keyframes mm-blink{50%{opacity:.25;}}
.mm-body{flex:1;display:flex;min-height:0;padding:0 12px 8px;gap:10px;}
.mm-share{flex:1;min-width:0;background:#0d0e10;border-radius:8px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.mm-share-chip{position:absolute;top:10px;left:12px;background:rgba(52,199,36,.16);color:#34c724;font-size:12px;border-radius:4px;padding:3px 10px;}
.mm-slide{width:min(86%, calc((100vh - 220px) * 16 / 9));aspect-ratio:16/9;background:#fff;border-radius:4px;color:#1f2329;padding:4% 5%;display:flex;flex-direction:column;}
.mm-slide h1{font-size:clamp(16px,2.2vw,30px);font-weight:700;}
.mm-slide h2{font-size:clamp(10px,1.1vw,15px);color:#8a919f;font-weight:400;margin-top:6px;padding-bottom:3%;border-bottom:2px solid #1e6fff;}
.mm-slide-cols{flex:1;display:flex;gap:6%;margin-top:4%;min-height:0;}
.mm-slide ul{list-style:none;flex:1;}
.mm-slide li{font-size:clamp(10px,1.2vw,17px);color:#374151;margin-bottom:9%;padding-left:1.2em;position:relative;}
.mm-slide li::before{content:'';position:absolute;left:0;top:.45em;width:.45em;height:.45em;border-radius:2px;background:#1e6fff;}
.mm-chart{flex:1;display:flex;align-items:flex-end;gap:9%;padding:0 4%;border-left:1px solid #e8eaee;}
.mm-chart i{flex:1;background:#1e6fff;border-radius:3px 3px 0 0;opacity:.85;}
.mm-chart i:nth-child(2){height:58%!important;background:#5b9dff;}
.mm-chart i:nth-child(4){background:#5b9dff;}
.mm-rail{width:198px;flex-shrink:0;display:flex;flex-direction:column;gap:8px;overflow:hidden;}
.mm-tile{background:#26282c;border-radius:6px;overflow:hidden;flex-shrink:0;}
.mm-cam{width:100%;aspect-ratio:16/9;background:#1d1f22;display:flex;align-items:center;justify-content:center;position:relative;}
.mm-cam .mm-off{color:#6f757e;font-size:11px;text-align:center;}
.mm-cam .mm-ava{width:40px;height:40px;border-radius:50%;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;}
.mm-name{height:24px;display:flex;align-items:center;gap:6px;padding:0 8px;font-size:11px;color:#c9cdd4;}
.mm-name .mic{margin-left:auto;font-size:10px;color:#6f757e;}
.mm-name .mic.on{color:#34c724;}
.mm-badge{font-size:10px;color:#ffb200;background:rgba(255,178,0,.12);border-radius:3px;padding:0 4px;}
.mm-bottom{height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 16px;position:relative;}
.mm-btn{width:76px;height:46px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:11px;color:#c9cdd4;background:transparent;}
.mm-btn:hover{background:#26282c;}
.mm-btn i{font-size:16px;font-style:normal;}
.mm-btn.off i{color:#f54a45;}
.mm-leave{position:absolute;right:16px;height:38px;border-radius:8px;background:#f54a45;color:#fff;font-size:13px;display:flex;align-items:center;padding:0 20px;}
`,
  html: `
<div class="mm-top">
  <span class="mm-topic">Q3 项目周会</span>
  <span class="mm-timer" id="mm-timer">00:14:37</span>
  <span class="mm-net">▲ 网络良好</span>
  <span class="mm-rec"><i></i>录制中</span>
</div>
<div class="mm-body">
  <div class="mm-share">
    <span class="mm-share-chip">张伟 正在共享屏幕</span>
    <div class="mm-slide">
      <h1>Q3 复盘与下半年规划</h1>
      <h2>项目组 · 内部资料，请勿外传</h2>
      <div class="mm-slide-cols">
        <ul>
          <li>核心指标达成情况：整体完成率 87%</li>
          <li>重点项目进展同步与风险项</li>
          <li>资源缺口与跨组协调需求</li>
          <li>下半年 Roadmap 与里程碑</li>
        </ul>
        <div class="mm-chart"><i style="height:42%"></i><i style="height:58%"></i><i style="height:74%"></i><i style="height:87%"></i></div>
      </div>
    </div>
  </div>
  <div class="mm-rail">
    <div class="mm-tile">
      <div class="mm-cam"><span class="mm-ava" style="background:#3370ff">张</span></div>
      <div class="mm-name">张伟 <span class="mm-badge">主持人</span><span class="mic on">🎙</span></div>
    </div>
    <div class="mm-tile">
      <div class="mm-cam" id="mm-cam"><span class="mm-off">摄像头画面加载中…</span></div>
      <div class="mm-name">李阳<span class="mic">🔇</span></div>
    </div>
    <div class="mm-tile">
      <div class="mm-cam"><span class="mm-ava" style="background:#ff7d3e">王</span></div>
      <div class="mm-name">王芳<span class="mic">🔇</span></div>
    </div>
    <div class="mm-tile">
      <div class="mm-cam"><span class="mm-ava" style="background:#00b578">陈</span></div>
      <div class="mm-name">陈晨<span class="mic">🔇</span></div>
    </div>
    <div class="mm-tile">
      <div class="mm-cam"><span class="mm-ava" style="background:#8f5bff">刘</span></div>
      <div class="mm-name">刘倩<span class="mic">🔇</span></div>
    </div>
  </div>
</div>
<div class="mm-bottom">
  <div class="mm-btn off"><i>🎤</i>解除静音</div>
  <div class="mm-btn off"><i>📷</i>开启摄像头</div>
  <div class="mm-btn"><i>🖥</i>共享屏幕</div>
  <div class="mm-btn"><i>👥</i>参会人 (6)</div>
  <div class="mm-btn"><i>💬</i>聊天</div>
  <div class="mm-btn"><i>⋯</i>更多</div>
  <div class="mm-leave">离开会议</div>
</div>
`,
  // 会议时长真实走秒
  onMount(root) {
    const el = root.querySelector('#mm-timer');
    if (!el) return null;
    const start = Date.now() - (14 * 60 + 37) * 1000; // 从 14:37 开始，看起来在会中
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      el.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t); // cleanup
  },
};
