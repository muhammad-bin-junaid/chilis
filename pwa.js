/* Shared PWA glue: standalone detection, install prompt, service worker registration. */
(function () {
  'use strict';

  var root = document.documentElement;

  function isStandalone() {
    var mq = window.matchMedia && window.matchMedia('(display-mode: standalone)');
    return !!(mq && mq.matches) || navigator.standalone === true;
  }

  function markDisplayMode() {
    root.classList.toggle('is-standalone', isStandalone());
  }

  markDisplayMode();
  if (window.matchMedia) {
    var mq = window.matchMedia('(display-mode: standalone)');
    if (mq.addEventListener) mq.addEventListener('change', markDisplayMode);
    else if (mq.addListener) mq.addListener(markDisplayMode);
  }

  // native install prompt: [data-install] buttons use it, otherwise they open the guide
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    root.classList.add('can-install');
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    root.classList.remove('can-install');
  });
  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest && event.target.closest('[data-install]');
    if (!button) return;
    if (deferredPrompt) {
      event.preventDefault();
      deferredPrompt.prompt();
      deferredPrompt = null;
    }
  });

  // service worker only exists over http(s) — opening the file locally still works, just without install
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
