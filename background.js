// service worker：快捷键监听（老板键 + 小窗切换）+ tab 级静音（覆盖跨域 iframe 无法静音的场景）
async function bossKey(tab) {
  let res = null;
  try {
    res = await chrome.tabs.sendMessage(tab.id, { action: 'bossKey' });
  } catch (e) {
    return; // content script 未注入（插件未在此页启用），不做任何事
  }
  if (!res || !res.ok) return;
  // 视频隐藏时静音整个 tab，恢复时取消静音（对跨域 iframe 也生效）
  try {
    await chrome.tabs.update(tab.id, { muted: !!res.hidden });
  } catch (e) {
    // 静音失败不影响隐藏效果
  }
}

// 小窗模式（一键组合动作）：搬进 popup 类型窗口（无标签栏/工具栏，能缩得比普通
// 窗口小得多）+ 自动启用全屏滤镜（视频铺满小窗）；切回普通窗口时自动还原页面。
// 小窗里没有插件图标，切回全靠快捷键；滤镜靠页面底部的悬浮调节条。
const CONTENT_FILES = [
  'content/skins/skin-course.js',
  'content/skins/skin-meeting.js',
  'content/skins/skin-editor.js',
  'content/disguise.js',
  'content/filter.js',
  'content/injector.js',
];

async function toggleWindow(tab) {
  const win = await chrome.windows.get(tab.windowId);
  if (win.type === 'popup') {
    try { await chrome.tabs.sendMessage(tab.id, { action: 'restore' }); } catch (e) {}
    await chrome.windows.create({ tabId: tab.id, focused: true }); // 搬回普通窗口
  } else {
    // 先铺满再搬窗，避免小窗里闪现原站布局（受限页面注入失败则只搬窗）
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: CONTENT_FILES });
      const saved = await chrome.storage.local.get('filter');
      await chrome.tabs.sendMessage(tab.id, { action: 'fullscreen', filter: saved.filter || null });
    } catch (e) {}
    const w = 480, h = 300;
    await chrome.windows.create({
      tabId: tab.id, type: 'popup', focused: true, width: w, height: h,
      left: Math.max(0, (win.left || 0) + (win.width || 1280) - w - 16),
      top: Math.max(0, (win.top || 0) + (win.height || 800) - h - 16),
    });
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;
  if (command === 'boss-key') return bossKey(tab);
  if (command === 'toggle-window') return toggleWindow(tab);
});

// popup 面板点「小窗看球」也走同一套逻辑
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === 'toggleWindow') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
      if (tab && tab.id) toggleWindow(tab);
    });
    sendResponse({ ok: true });
  }
  return false;
});
