/* Landing page — Android · iOS · Desktop platform switcher.
   The Desktop option only makes sense where the mobile shell exists,
   so it hides itself on phone-sized viewports. */
(function () {
  'use strict';
  var tabs = [].slice.call(document.querySelectorAll('.switch [role="tab"]'));
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  var desktopTab = document.getElementById('tab-desktop');
  if (!tabs.length || !desktopTab) return;

  // same breakpoints the app uses to decide frameless vs showcase shell
  var shellMq = matchMedia('(max-width:700px),(max-height:500px)');

  function byId(id) { return document.getElementById(id); }

  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) {
      p.hidden = p.getAttribute('aria-labelledby') !== tab.id;
    });
  }

  function visibleTabs() {
    return tabs.filter(function (t) { return !t.hidden; });
  }

  function defaultTab() {
    var ua = navigator.userAgent;
    var isIOS = /(iPhone|iPad|iPod)/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) return byId('tab-ios');
    if (/Android/.test(ua)) return byId('tab-android');
    return desktopTab.hidden ? byId('tab-android') : desktopTab;
  }

  function applyShellBreakpoint() {
    if (shellMq.matches) {
      if (!desktopTab.hidden) {
        desktopTab.hidden = true;
        if (desktopTab.getAttribute('aria-selected') === 'true') select(defaultTab());
      }
    } else {
      desktopTab.hidden = false;
    }
  }

  tabs.forEach(function (tab) {
    var pos = visibleTabs().indexOf(tab);
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var list = visibleTabs();
      pos = list.indexOf(tab);
      var j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (pos + 1) % list.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (pos - 1 + list.length) % list.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = list.length - 1;
      if (j === null) return;
      e.preventDefault();
      list[j].focus();
      select(list[j]);
    });
  });

  applyShellBreakpoint();
  if (shellMq.addEventListener) shellMq.addEventListener('change', applyShellBreakpoint);
  else if (shellMq.addListener) shellMq.addListener(applyShellBreakpoint);
  select(defaultTab());
})();
