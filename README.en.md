# ⚽ MoyuCup — Watch the Game, Look Busy

English | [中文](README.md)

A Chrome extension (Manifest V3) that disguises any web page playing a video as a "hard at work" page — with one click. Pure CSS/DOM camouflage: **no proxying, no embedding, no caching of any media stream. The video stream is never touched.**

Born for the 2026 World Cup (daytime matches vs. office hours), but it's content-agnostic: XiaoHongShu live streams, Bilibili, Tencent Video, Douyin web — if the page has a playing `<video>`, it can be disguised.

![Extension popup](docs/screenshots/01-popup.jpg)

## Three disguise skins

**① Online Course** (student persona) — the page becomes a calculus lecture note; the live stream shrinks into the first "recommended video" card at the bottom (red arrow), next to fake blackboard-formula covers:

![Course skin, the red arrow marks the real live stream](docs/screenshots/02-skin-course.jpg)

**② Video Meeting** (office-worker persona) — a shared PPT takes the main stage; the live stream masquerades as one participant's tiny camera tile in the right rail (red arrow), with a meeting timer ticking in real time:

![Meeting skin, the red arrow marks the real live stream](docs/screenshots/03-skin-meeting.jpg)

**③ Video Editor** (content-creator persona) — a CapCut-style dark UI; the live stream is a material thumbnail in the top-left library (red arrow), while a playhead slowly crawls along the timeline:

![Editor skin, the red arrow marks the real live stream](docs/screenshots/04-skin-editor.jpg)

## Mini window

One click moves the current tab into a corner mini window: no tab strip, no toolbar, and it **shrinks far below Chrome's normal minimum window size (~500px wide)**. The video auto-fills the window with the filter applied — park it in a corner and keep "working":

![Mini window mode — top-left corner, smaller than Chrome's minimum size](docs/screenshots/05-miniwindow.jpg)

## Install

1. Download this repo (`git clone` or Code → Download ZIP and unzip)
2. Open `chrome://extensions`, enable **Developer mode** (top right)
3. Click **Load unpacked** and select this folder

> Lazy mode: paste the repo URL to your AI (Claude Code / Codex / etc.) and say "clone it and tell me how to load it in Chrome."

## Usage

1. Start playing the video first, then click the extension icon
2. **Skin mode** (pick one): Online Course / Video Meeting / Video Editor. Filter sliders and presets (grayscale / low saturation / off) live in the same card; they also work standalone on the original page without any skin
3. **Mini window**: one click to move into a corner popup window, auto-filled with filter. Inside the mini window, move the mouse to the bottom edge for a floating bar: adjust filters / **⤢ restore to normal window**
4. **Boss key `Ctrl+M`** (`⌃Control+M` on Mac): instantly hide the video + mute the tab; press again to restore. Works in skin mode and mini window alike. It's the only shortcut; `suggested_key` applies on first install only — existing installs can bind it at `chrome://extensions/shortcuts`
5. **Title disguise**: the tab title and favicon are swapped together; if the site's script rewrites them back, a MutationObserver keeps re-applying the fake ones
6. **Feed sites** (Bilibili, Douyin web, etc.): when you switch videos, a watchdog adopts the new video within 0.6s; vertical 3:4 videos are center-cropped inside skin slots and letterboxed in the mini window
7. **Restore page** puts everything back without interrupting playback

## Local testing

```bash
python3 -m http.server 8791
```

- `test/fake-live.html` — fake live page (canvas-generated match + periodic title rewriting)
- `test/skin-preview.html?skin=course|meeting|editor` — skin visual preview (no extension needed)
- `test/e2e-sim.html` — end-to-end simulation replicating XiaoHongShu's page structure (fullscreen backdrop + transformed modal), driving the real injector via a chrome API shim

## Layout

```
moyucup/
├── manifest.json          # MV3; permissions: activeTab / scripting / storage + commands
├── background.js          # boss key + tab mute + mini-window toggle
├── popup/                 # extension panel
├── content/
│   ├── injector.js        # core: video detection, skin mounting, ancestor-chain elevation, watchdog, restore
│   ├── filter.js          # CSS filter layer
│   ├── disguise.js        # title/favicon disguise guard
│   └── skins/             # skins (config-driven; new skin = new config file)
└── test/                  # local test pages
```

## How it works

- **Video placement**: each skin's HTML reserves a slot element; after mounting, the real video element is pinned over the slot with `position:fixed !important` (z-index one above the fake UI) and repositioned on resize
- **Ancestor-chain elevation + transparency**: player containers often carry `transform`/`filter` (e.g. XiaoHongShu), which breaks `fixed` positioning and traps the video inside a low stacking context. On activation, these properties are neutralized along the ancestor chain, z-index is raised, the ancestors themselves are made paint-transparent (background/border/pseudo-elements cleared), and all off-chain siblings get `visibility:hidden` — fully reverted on restore
- **Watchdog**: a 600ms loop re-asserts video position and filters (against site scripts rewriting styles), and re-adopts the video when the site destroys/recreates it or the feed switches to another one
- **Mini window**: Chrome's normal windows have a hard minimum size; popup-type windows have no toolbar and shrink much smaller — the tab is moved via `chrome.windows.create({type:'popup'})`

## Known limitations

- The site player's own controls sit below the repositioned video; set volume/quality before enabling the disguise
- If video detection fails you only get a hint; manual region picking is not implemented (P1)

## Disclaimer

This extension is a front-end UI demo tool. It does not fetch, proxy, or cache any media content. Slack off at your own performance-review risk.
