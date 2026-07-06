# 摸鱼看球 MoyuCup

在上班环境下隐蔽观看直播的 Chrome 插件（Manifest V3）。纯 CSS/DOM 层伪装：不代理、不嵌入、不缓存任何流媒体，不碰视频流，不 reparent 视频元素。

## 安装（开发者模式）

1. Chrome 打开 `chrome://extensions`
2. 右上角开启「开发者模式」
3. 点「加载已解压的扩展程序」，选择本目录（`moyucup/`）

## 使用

1. 在直播页**开始播放**后，点击插件图标
2. **换皮模式**（三选一）：在线课程（高等数学讲义页，直播流 = 文末推荐视频第一格，学生党人设）/ 视频会议（飞书风，直播流 = 参会人摄像头小窗）/ 视频剪辑（剪映风，直播流 = 左上角素材缩略图）。滤镜滑块和预设（全灰 / 低饱和 / 关闭）在换皮卡片里，不换皮直接调也会就地作用于原网页视频
3. **小窗看球**（popup 面板按钮）：一键组合动作——把当前标签页搬进 popup 类型窗口（无标签栏/工具栏，能缩得比普通 Chrome 窗口的 ~500px 最小宽度小得多）+ 视频自动铺满 + 强制滤镜。小窗内鼠标移到窗口底部浮现悬浮条：调滤镜 / **⤢ 还原大窗**（小窗里没有插件图标，这是切回大窗的入口）
4. **老板键 `Ctrl+M`**（Mac 为 `⌃Control+M`）：一键隐藏视频 + 静音（tab 级静音，跨域 iframe 也有效），再按恢复；换皮和小窗下都有效。这是唯一的快捷键，manifest 的 `suggested_key` 只在首次安装时生效，已装用户需在 `chrome://extensions/shortcuts` 手动绑定或重装
5. **信息流站点支持**（B站/抖音网页版等）：换皮/小窗状态下切换视频时，看门狗检测到"当前视频停了、别的视频在播"会在 0.6s 内自动跟随接管新视频；竖屏 3:4 视频在皮肤插槽里居中裁切（cover），在小窗里完整显示加黑边（contain）
6. 「一键还原页面」恢复原始状态，播放不中断

## 本地测试

```bash
cd moyucup && python3 -m http.server 8791
```

- `http://localhost:8791/test/fake-live.html` — 假直播页（canvas 生成球赛画面 + 每 5 秒篡改 title，模拟真实直播站），用来测插件全流程
- `http://localhost:8791/test/skin-preview.html?skin=course|meeting|editor` — 皮肤视觉预览（不依赖插件，改皮肤样式时用）

## 目录结构

```
moyucup/
├── manifest.json          # MV3，权限仅 activeTab / scripting / storage + commands
├── background.js          # 老板键监听 + tab 级静音
├── popup/                 # 模式切换 + 皮肤选择 + 滤镜滑块
├── content/
│   ├── injector.js        # 核心：视频识别、皮肤挂载、全屏模式、老板键、还原
│   ├── filter.js          # CSS filter 滤镜层
│   ├── disguise.js        # title/favicon 伪装 + MutationObserver 守护
│   └── skins/             # 三款皮肤（HTML/CSS 配置驱动，新皮肤 = 新配置文件）
└── test/                  # 本地测试页
```

## 实现要点

- **视频定位**：皮肤 HTML 里留一个插槽元素（`videoSlot`），挂载后读插槽 `getBoundingClientRect()`，把真实视频元素 `position:fixed !important` 精确压在插槽上方（z-index 比假界面高 1），窗口 resize 自动重排
- **祖先链提权**：播放器容器常带 `transform`/`filter`（如小红书），会让 fixed 失效且把视频困在低层级的层叠上下文里。启用时就地中和祖先链上这些属性、抬高其 z-index，并把祖先链之外的兄弟节点 `visibility:hidden`；还原时全部恢复
- **看门狗**：600ms 轮询复位视频位置与滤镜（对抗站点脚本改写 style），video 被站点销毁重建时自动重新识别接管
- **视频识别**：面积最大的可见 `<video>` → 兜底面积最大且 src 含播放器特征的 iframe

## 排查问题 / 反馈日志

出问题时：在直播页按 `F12`（或右键 → 检查）打开开发者工具 → Console 面板 → 顶部过滤框输入 `MoyuCup`，把带 `[MoyuCup]` 前缀的日志截图即可。日志包含：识别到的视频元素、插槽坐标、祖先链处理数量、滤镜值。
- **新皮肤**：在 `content/skins/` 加一个文件，往 `window.__MOYU_SKINS__` 注册 `{ id, title, favicon, defaultFilter, videoSlot, css, html, onMount? }`，并在 `popup.js` 的 `CONTENT_FILES` 与 popup 界面加入口

## 已知限制（P1 待办）

- 视频元素的祖先若有 `transform/filter`，`position:fixed` 会失效（定位跟着祖先跑）→ 需要实测主流直播站
- 播放器自带控件被视频自身覆盖，暂停/音量靠进入伪装前调好，或用键盘快捷键
- 直播站若销毁重建 video 节点，需重新点一次皮肤（未做 MutationObserver 自动重新识别）
- 识别失败只报提示，未做手动框选
