// title / favicon 伪装 + MutationObserver 守护（直播站脚本会周期性改回标题）
if (!window.__moyuDisguise) {
  window.__moyuDisguise = (() => {
    let observer = null;
    let fakeTitle = null;
    let fakeLink = null;
    let origTitle = null;
    let origLinks = [];

    function makeFavicon(text, color) {
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
        '<rect width="32" height="32" rx="6" fill="' + color + '"/>' +
        '<text x="16" y="22" font-size="17" text-anchor="middle" fill="#fff" ' +
        'font-family="PingFang SC, Microsoft YaHei, sans-serif">' + text + '</text></svg>';
      return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    function mountFakeLink(href) {
      document.querySelectorAll('link[rel*="icon"]').forEach((l) => {
        if (l !== fakeLink) l.remove();
      });
      if (!fakeLink || !document.head.contains(fakeLink)) {
        fakeLink = document.createElement('link');
        fakeLink.rel = 'icon';
        fakeLink.href = href;
        (document.head || document.documentElement).appendChild(fakeLink);
      }
    }

    return {
      enable(title, fav) {
        if (origTitle === null) {
          origTitle = document.title;
          origLinks = [...document.querySelectorAll('link[rel*="icon"]')];
        }
        fakeTitle = title;
        document.title = fakeTitle;
        const href = makeFavicon(fav.text, fav.color);
        mountFakeLink(href);
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
          if (fakeTitle && document.title !== fakeTitle) document.title = fakeTitle;
          mountFakeLink(href);
        });
        observer.observe(document.head || document.documentElement, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      },
      disable() {
        if (observer) observer.disconnect();
        observer = null;
        fakeTitle = null;
        if (fakeLink) fakeLink.remove();
        fakeLink = null;
        if (origTitle !== null) {
          document.title = origTitle;
          origLinks.forEach((l) => (document.head || document.documentElement).appendChild(l));
          origTitle = null;
          origLinks = [];
        }
      },
    };
  })();
}
