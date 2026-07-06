// popup 逻辑：注入 content scripts + 发送指令 + 滤镜状态持久化
const $ = (s) => document.querySelector(s);

const CONTENT_FILES = [
  'content/skins/skin-course.js',
  'content/skins/skin-meeting.js',
  'content/skins/skin-editor.js',
  'content/disguise.js',
  'content/filter.js',
  'content/injector.js',
];

let tabId = null;
let currentFilter = { saturate: 0.3, brightness: 0.9 };
let active = false; // 当前 tab 是否已启用伪装
let injectedOnce = false; // 本次 popup 会话是否已注入过

function hint(msg) { $('#hint').textContent = msg || ''; }

function setStatus(mode, skin) {
  const el = $('#status');
  document.querySelectorAll('.skin').forEach((b) => b.classList.remove('active'));
  if (mode === 'skin') {
    el.textContent = '换皮中 · ' + ({ course: '在线课程', meeting: '视频会议', editor: '视频剪辑' }[skin] || skin);
    el.classList.add('on');
    const btn = document.querySelector('.skin[data-skin="' + skin + '"]');
    if (btn) btn.classList.add('active');
    active = true;
  } else if (mode === 'fullscreen') {
    el.textContent = '全屏滤镜中';
    el.classList.add('on');
    active = true;
  } else if (mode === 'filter') {
    el.textContent = '滤镜生效中（未换皮）';
    el.classList.add('on');
    active = true;
  } else {
    el.textContent = '未启用';
    el.classList.remove('on');
    active = false;
  }
}

function syncSliders(f) {
  if (!f) return;
  currentFilter = f;
  if (typeof f.saturate === 'number') {
    $('#sat').value = Math.round(f.saturate * 100);
    $('#satVal').textContent = f.saturate.toFixed(2);
  }
  if (typeof f.brightness === 'number') {
    $('#bri').value = Math.round(f.brightness * 100);
    $('#briVal').textContent = f.brightness.toFixed(2);
  }
}

async function ensureInjected() {
  if (injectedOnce) return;
  await chrome.scripting.executeScript({ target: { tabId }, files: CONTENT_FILES });
  injectedOnce = true;
}

async function send(msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch (e) {
    return null;
  }
}

async function run(msg) {
  hint('');
  try {
    await ensureInjected();
  } catch (e) {
    hint('此页面无法注入（chrome:// 或商店页等受限页面）');
    return null;
  }
  const res = await send(msg);
  if (!res) { hint('注入失败，请刷新页面后重试'); return null; }
  if (!res.ok) { hint(res.error || '操作失败'); return res; }
  setStatus(res.mode, res.skin);
  if (res.filter) {
    syncSliders(res.filter);
    chrome.storage.local.set({ filter: res.filter });
  }
  return res;
}

// ---------- 事件绑定 ----------
document.querySelectorAll('.skin').forEach((btn) => {
  btn.addEventListener('click', () => run({ action: 'applySkin', skin: btn.dataset.skin }));
});

$('#restore').addEventListener('click', async () => {
  const res = await send({ action: 'restore' });
  if (res && res.ok) { setStatus(null); hint(''); }
});

// 滤镜不依赖换皮：未启用任何模式时也直接作用于原网页视频（独立滤镜模式）
let filterTimer = null;
function pushFilter() {
  currentFilter = {
    saturate: Number($('#sat').value) / 100,
    brightness: Number($('#bri').value) / 100,
  };
  $('#satVal').textContent = currentFilter.saturate.toFixed(2);
  $('#briVal').textContent = currentFilter.brightness.toFixed(2);
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => run({ action: 'setFilter', filter: currentFilter }), 80);
}
$('#sat').addEventListener('input', pushFilter);
$('#bri').addEventListener('input', pushFilter);

document.querySelectorAll('.presets button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const p = btn.dataset.preset;
    if (p === 'gray') currentFilter = { preset: 'gray' };
    else if (p === 'off') currentFilter = { preset: 'off' };
    else currentFilter = { saturate: 0.3, brightness: 0.9 };
    syncSliders(currentFilter);
    run({ action: 'setFilter', filter: currentFilter });
  });
});

// 小窗看球：background 统一处理（搬窗 + 自动铺满 + 滤镜），popup 只发指令
$('#popwin').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'toggleWindow' });
  window.close();
});

// ---------- 初始化 ----------
(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  tabId = tab.id;
  const saved = await chrome.storage.local.get('filter');
  if (saved.filter) syncSliders(saved.filter);
  // 不主动注入，只探测已有状态（未注入时 sendMessage 会抛错 → 保持"未启用"）
  const st = await send({ action: 'getState' });
  if (st && st.ok && st.mode) {
    setStatus(st.mode, st.skin);
    if (st.filter) syncSliders(st.filter);
  }
})();
