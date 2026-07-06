// 皮肤 A：在线课程（慕课学堂风格，默认皮肤）—— 面向学生党，高等数学主题
// v3 布局：主界面是高数讲义页（讲义正文 + 左侧章节目录），
// 直播流藏在文末"视频讲解推荐"一排 5 个小卡片的第一格里（尺寸极小），
// 其余 4 个是内联 SVG 画的黑板公式假封面；正文有缓慢循环的阅读焦点动画
window.__MOYU_SKINS__ = window.__MOYU_SKINS__ || {};

(function () {
  // 生成黑板风假封面：深色底 + 白色公式
  function board(bg1, bg2, formula) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + bg1 + '"/><stop offset="1" stop-color="' + bg2 + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="160" height="90" fill="url(%23g)"/>' +
      '<rect x="10" y="8" width="140" height="74" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5" rx="3"/>' +
      '<text x="80" y="52" font-size="20" text-anchor="middle" fill="rgba(255,255,255,.92)" ' +
      'font-family="Georgia, serif" font-style="italic">' + formula + '</text>' +
      '</svg>';
    return "url('data:image/svg+xml," + encodeURIComponent(svg).replace(/'/g, '%27') + "')";
  }

  const covers = [
    board('#2f4858', '#1d2f3b', '∇f = λ∇φ'),
    board('#3a4a3a', '#22301f', '∬_D f dσ'),
    board('#463a55', '#2a2337', 'lim(x,y)→(0,0)'),
    board('#54432f', '#33281a', 'Σ aₙxⁿ'),
  ];

  window.__MOYU_SKINS__.course = {
    id: 'course',
    name: '在线课程',
    title: '慕课学堂 - 高等数学(下) 第5讲',
    favicon: { text: '数', color: '#1e6fff' },
    defaultFilter: { saturate: 0.35, brightness: 0.95 },
    videoSlot: '#mc-rec-live',
    css: `
#__moyu_overlay{background:#f4f6f9;color:#1f2329;}
.mc-top{height:56px;display:flex;align-items:center;padding:0 24px;background:#fff;border-bottom:1px solid #e8eaee;gap:24px;}
.mc-brand{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:600;white-space:nowrap;}
.mc-brand-ico{width:26px;height:26px;border-radius:6px;background:#1e6fff;color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;}
.mc-crumb{flex:1;font-size:13px;color:#8a919f;overflow:hidden;white-space:nowrap;}
.mc-top-right{display:flex;align-items:center;gap:16px;}
.mc-search{width:180px;height:30px;border-radius:15px;background:#f2f3f5;color:#a8adb8;font-size:12px;display:flex;align-items:center;padding:0 12px;}
.mc-avatar{width:30px;height:30px;border-radius:50%;background:#ff7d3e;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;}
.mc-body{display:flex;height:calc(100vh - 56px);}
.mc-side{width:280px;flex-shrink:0;background:#fff;border-right:1px solid #e8eaee;display:flex;flex-direction:column;overflow:hidden;}
.mc-side-head{padding:14px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #e8eaee;display:flex;justify-content:space-between;align-items:center;}
.mc-side-head span{font-size:12px;font-weight:400;color:#8a919f;}
.mc-chapters{flex:1;overflow:hidden;padding:6px 0;}
.mc-ch{padding:11px 16px;font-size:13px;color:#4e5666;display:flex;align-items:center;gap:10px;}
.mc-ch .mc-no{width:20px;color:#a8adb8;font-size:12px;flex-shrink:0;}
.mc-ch .mc-nm{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.mc-ch .mc-st{font-size:11px;flex-shrink:0;}
.mc-ch.done .mc-st{color:#00b578;}
.mc-ch.lock{color:#a8adb8;}
.mc-ch.cur{background:#e8f1ff;color:#1e6fff;font-weight:500;border-right:3px solid #1e6fff;}
.mc-ch.cur .mc-st{color:#1e6fff;}
.mc-main{flex:1;min-width:0;overflow:hidden;padding:24px 48px;position:relative;}
.mc-article{max-width:860px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #e8eaee;padding:30px 44px 24px;height:100%;overflow:hidden;position:relative;display:flex;flex-direction:column;}
.mc-ctitle{font-size:19px;font-weight:700;display:flex;align-items:center;gap:10px;}
.mc-tag{font-size:11px;font-weight:400;color:#e6432d;background:#ffece8;border-radius:3px;padding:2px 6px;}
.mc-tag2{color:#1e6fff;background:#e8f1ff;}
.mc-meta{font-size:12px;color:#8a919f;margin:8px 0 14px;padding-bottom:12px;border-bottom:1px solid #f0f1f3;display:flex;gap:18px;align-items:center;}
.mc-live-dot{display:flex;align-items:center;gap:5px;color:#00b578;}
.mc-live-dot i{width:7px;height:7px;border-radius:50%;background:#00b578;animation:mc-pulse 2.4s ease-in-out infinite;}
@keyframes mc-pulse{50%{opacity:.25;}}
.mc-content{flex:1;min-height:0;overflow:hidden;}
.mc-article h3{font-size:14.5px;margin:12px 0 6px;color:#1f2329;}
.mc-article p{font-size:13px;line-height:1.95;color:#4e5666;margin-bottom:4px;}
.mc-formula{text-align:center;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14.5px;color:#2b3648;margin:8px 0;letter-spacing:.5px;}
.mc-callout{margin:10px 0;padding:10px 16px;background:#f0f7ff;border-left:3px solid #1e6fff;border-radius:0 6px 6px 0;font-size:12.5px;color:#35507a;line-height:1.85;}
.mc-focus{position:absolute;left:24px;right:24px;height:52px;border-radius:8px;background:rgba(30,111,255,.055);pointer-events:none;animation:mc-focus 46s ease-in-out infinite alternate;}
@keyframes mc-focus{from{top:120px;}to{top:calc(100% - 220px);}}
.mc-rec{margin-top:auto;padding-top:12px;border-top:1px solid #f0f1f3;}
.mc-rec-head{font-size:13px;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.mc-rec-head span{font-size:11px;font-weight:400;color:#8a919f;}
.mc-rec-row{display:flex;gap:10px;}
.mc-rec-card{flex:1;min-width:0;}
.mc-rec-thumb{aspect-ratio:16/9;border-radius:6px;background:#14161a center/cover no-repeat;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:11px;}
.mc-rec-dur{position:absolute;right:5px;bottom:5px;font-size:10px;background:rgba(0,0,0,.65);color:#fff;border-radius:3px;padding:0 5px;line-height:16px;}
.mc-rec-name{font-size:11.5px;color:#4e5666;margin-top:5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.mc-rec-card.playing .mc-rec-name{color:#1e6fff;}
`,
    html: `
<div class="mc-top">
  <div class="mc-brand"><span class="mc-brand-ico">慕</span>慕课学堂</div>
  <div class="mc-crumb">我的课程 / 高等数学(下) / 第 5 讲讲义</div>
  <div class="mc-top-right"><span class="mc-search">搜索课程 / 知识点</span><span class="mc-avatar">我</span></div>
</div>
<div class="mc-body">
  <div class="mc-side">
    <div class="mc-side-head">章节目录<span>12 讲 · 已完成 4</span></div>
    <div class="mc-chapters">
      <div class="mc-ch done"><span class="mc-no">01</span><span class="mc-nm">空间解析几何与向量代数</span><span class="mc-st">✓ 已完成</span></div>
      <div class="mc-ch done"><span class="mc-no">02</span><span class="mc-nm">多元函数的极限与连续</span><span class="mc-st">✓ 已完成</span></div>
      <div class="mc-ch done"><span class="mc-no">03</span><span class="mc-nm">偏导数与全微分</span><span class="mc-st">✓ 已完成</span></div>
      <div class="mc-ch done"><span class="mc-no">04</span><span class="mc-nm">多元复合函数求导法则</span><span class="mc-st">✓ 已完成</span></div>
      <div class="mc-ch cur"><span class="mc-no">05</span><span class="mc-nm">多元函数的极值与拉格朗日乘数法</span><span class="mc-st">学习中</span></div>
      <div class="mc-ch"><span class="mc-no">06</span><span class="mc-nm">二重积分的概念与计算</span><span class="mc-st">52:40</span></div>
      <div class="mc-ch"><span class="mc-no">07</span><span class="mc-nm">三重积分及其应用</span><span class="mc-st">48:15</span></div>
      <div class="mc-ch lock"><span class="mc-no">08</span><span class="mc-nm">曲线积分与格林公式</span><span class="mc-st">🔒</span></div>
      <div class="mc-ch lock"><span class="mc-no">09</span><span class="mc-nm">曲面积分与高斯公式</span><span class="mc-st">🔒</span></div>
      <div class="mc-ch lock"><span class="mc-no">10</span><span class="mc-nm">无穷级数的敛散性判别</span><span class="mc-st">🔒</span></div>
      <div class="mc-ch lock"><span class="mc-no">11</span><span class="mc-nm">幂级数与泰勒展开</span><span class="mc-st">🔒</span></div>
      <div class="mc-ch lock"><span class="mc-no">12</span><span class="mc-nm">期末总复习与真题串讲</span><span class="mc-st">🔒</span></div>
    </div>
  </div>
  <div class="mc-main">
    <div class="mc-article">
      <div class="mc-focus"></div>
      <div class="mc-ctitle">第 5 讲 · 多元函数的极值与拉格朗日乘数法<span class="mc-tag">期末必考</span><span class="mc-tag mc-tag2">学分 4.0</span></div>
      <div class="mc-meta"><span>主讲：李文斌 教授</span><span>时长 52:18</span><span>更新于 2026-06-30</span><span class="mc-live-dot"><i></i>正在同步学习进度</span></div>
      <div class="mc-content">
        <h3>一、无条件极值的判别</h3>
        <p>设 z = f(x, y) 在点 P₀(x₀, y₀) 的某邻域内有连续的二阶偏导数，且 P₀ 为驻点（fₓ = f_y = 0）。记：</p>
        <p class="mc-formula">A = fₓₓ(x₀, y₀)，B = fₓᵧ(x₀, y₀)，C = fᵧᵧ(x₀, y₀)，Δ = AC − B²</p>
        <p>当 Δ &gt; 0 且 A &lt; 0 时取极大值；Δ &gt; 0 且 A &gt; 0 时取极小值；Δ &lt; 0 时不是极值；Δ = 0 时需另行判别。</p>
        <div class="mc-callout">💡 重点：判别式 Δ = AC − B² 是期末大题的固定考点，注意"驻点"与"极值点"的区别——驻点不一定是极值点，极值点也可能出现在偏导不存在的点。</div>
        <h3>二、条件极值与拉格朗日乘数法</h3>
        <p>求 f(x, y) 在约束条件 φ(x, y) = 0 下的极值：构造拉格朗日函数</p>
        <p class="mc-formula">L(x, y, λ) = f(x, y) + λ·φ(x, y)</p>
        <p>对 x、y、λ 分别求偏导并令其为零，解方程组得驻点，再结合问题的实际背景判定极值类型。多个约束时引入多个乘数 λ、μ 即可。</p>
        <h3>三、典型例题</h3>
        <p>例：求表面积为 a² 而体积最大的长方体。设棱长 x, y, z，即求 V = xyz 在约束 2(xy + yz + zx) = a² 下的最大值。由对称性解得 x = y = z = a/√6 时体积最大。</p>
      </div>
      <div class="mc-rec">
        <div class="mc-rec-head">视频讲解 · 本讲推荐<span>共 5 个视频 · 已看 1</span></div>
        <div class="mc-rec-row">
          <div class="mc-rec-card playing">
            <div class="mc-rec-thumb" id="mc-rec-live">加载中…<span class="mc-rec-dur">12:35</span></div>
            <div class="mc-rec-name">▶ 05-1 极值判别法精讲</div>
          </div>
          <div class="mc-rec-card">
            <div class="mc-rec-thumb" style="background-image:${covers[0]}"><span class="mc-rec-dur">18:22</span></div>
            <div class="mc-rec-name">05-2 拉格朗日乘数法</div>
          </div>
          <div class="mc-rec-card">
            <div class="mc-rec-thumb" style="background-image:${covers[1]}"><span class="mc-rec-dur">15:07</span></div>
            <div class="mc-rec-name">05-3 典型例题精讲</div>
          </div>
          <div class="mc-rec-card">
            <div class="mc-rec-thumb" style="background-image:${covers[2]}"><span class="mc-rec-dur">09:48</span></div>
            <div class="mc-rec-name">06-0 二重积分预习</div>
          </div>
          <div class="mc-rec-card">
            <div class="mc-rec-thumb" style="background-image:${covers[3]}"><span class="mc-rec-dur">45:30</span></div>
            <div class="mc-rec-name">期末串讲 · 级数篇</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  };
})();
