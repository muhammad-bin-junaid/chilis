# Chili's Concept App (PWA & Android TWA)

A mobile-focused web application inspired by the Chili's Grill & Bar digital ordering interface. I built this project independently as a portfolio piece to showcase my skills in frontend development, Progressive Web Apps (PWAs), and packaging web apps into native Android APKs via Trusted Web Activity (TWA).

---

## ⚠️ Disclaimer & Intellectual Property

* **Demo Purpose Only:** This is a non-commercial, student portfolio demonstration. No permission or affiliation was granted by Chili's or Brinker International, Inc.
* **Logos & Trademarks:** The app's own logo, favicon, and install icon are a hand-drawn chili mark created for this project — no official logo files ship as the app identity. The home hero displays the real "Chili's Triple Dipper" wordmark to reference the brand in this non-commercial demo; "Chili's" and the Triple Dipper name remain trademarks of Brinker International, Inc.
* **Photography:** All food imagery is free-licensed stock photography (Pexels), not menu photography from the real chain.
* **Prices, items, locations, rewards, and orders are simulated** — nothing is real, nothing is for sale, no data leaves your device.

---

## 🛠️ What I Built

* Mobile-first responsive frontend replicating key restaurant app flows (Menu, Rewards, Cart, Orders, Locations, Account) in plain HTML/CSS/JS — no framework, no build step.
* PWA setup (`manifest.webmanifest` + service worker `sw.js`): install prompts, offline app shell, app shortcuts, share target, maskable icons, store screenshots.
* Landing page at the domain root with a **platform switcher — Android · iOS · Desktop** — that adapts to the visitor: Android offers the Chrome install steps *and* a direct **Download the Android APK** button, iOS shows the Safari share-sheet steps, and Desktop links into the `app.html` mobile-shell simulation. The Desktop option hides itself on phone-sized viewports and the tab auto-selects for your platform.
* Android TWA packaging with [PWABuilder](https://www.pwabuilder.com) — the signed `.apk` ships in this repository (`Chili's.apk`) and is served with proper Android package headers.
* Full-screen domain verification using Digital Asset Links (`.well-known/assetlinks.json`), served with a pinned `Content-Type`.
* Security headers via `vercel.json`, plus `robots.txt` and `sitemap.xml` for `https://chilis-rust.vercel.app`.

---

## 📲 How the PWA & the APK Work

* **PWA (`app.html`):** the manifest declares icons (192/512/maskable), two 1080×1920 screenshots, four long-press **app shortcuts** (Menu, Cart, Rewards, Locations), and a GET **share target** — sharing text from any app opens the menu with the search prefilled. The service worker precaches the shell and falls back to `app.html` for offline navigation (APK downloads bypass it so a binary never enters the cache). On a real phone or installed app the layout is frameless; on a wide desktop window it renders inside a showcase phone frame.
* **Android APK (TWA):** PWABuilder wraps the live URL in a Trusted Web Activity — a Chromeless fullscreen window. `/.well-known/assetlinks.json` vouches for the package name and signing fingerprint, so Android hides all browser chrome. Same code, same site, one codebase everywhere — whether you open the URL, install the PWA, or sideload `Chili's.apk`.

---

## 📲 How to Try & Install the App

### Option 1: Mobile Web / PWA Install (Chrome & Safari)
1. Open the live site on your phone: `https://chilis-rust.vercel.app`
2. **Android (Chrome):** Tap the **⋮** menu → select **"Install app"** or **"Add to Home screen"**.
3. **iOS (Safari):** Tap the **Share** button → select **"Add to Home Screen"**.

### Option 2: Desktop Browser (Platform Switcher + Mobile Shell)
1. Open `https://chilis-rust.vercel.app` on any desktop browser (Chrome, Edge, Brave).
2. The landing page opens with the **Android · iOS · Desktop** switcher (Desktop preselected, since phones get Android/iOS only).
3. Pick **Desktop** → **Open the simulation** to jump into `app.html`, which renders inside the interactive mobile showcase shell.

### Option 3: Android APK (.apk) — ships in this repository
1. Download **`Chili's.apk`** from this repo, or use the **Download the Android APK** button on the live guide.
2. Send the file to your phone (cloud drive, cable, or email to yourself).
3. Tap it to install. If prompted, toggle on **"Allow installation from unknown sources"** for your file manager or browser.
4. Done — the TWA opens full screen, verified against the live site by Digital Asset Links.

---

## ✅ How to Test It

* **Structural suite (jsdom):** boots `app.js` headlessly and asserts manifest wiring, shortcuts, share target, precache list, deep links, assetlinks, the platform switcher, the APK file, and the guide page — 32 checks.
* **Browser suite (headless Chrome):** drives the real UI — welcome, menu search, cart, checkout, confirmation, rewards, cold-start deep link `#rewards`, `?text=` share flow, the switcher's panel swaps and phone-hides-desktop rule, standalone display-mode rules, zero console errors — 32 checks.
* **Display-mode suites:** verify the installed (standalone) state: no phone frame, hidden fake status bar, no page scroll, viewport fill.
* **Width-fit suite:** renders every page at 320/360/390/500/1280px and asserts no sideways scrolling.
* **Quick manual checks:** [PWABuilder](https://www.pwabuilder.com) scan → 0 manifest errors; Lighthouse → PWA category; open `/.well-known/assetlinks.json` → JSON for the TWA package; download `Chili's.apk` from the guide → Android package headers; DevTools → Network → **Offline** → reload still works.

---

## 📂 Project Structure

```text
├── .well-known/
│   └── assetlinks.json      # Digital Asset Links — enables full-screen TWA
├── icons/                   # 192/512/maskable icons, apple-touch icon, shortcut glyphs
├── images/                  # Free-licensed (Pexels) food photography
├── screenshots/             # 1080×1920 store shots referenced by the manifest
├── app.html                 # The app itself (PWA entry point)
├── app.js                   # Views, cart, rewards, routing, deep links, share target
├── index.html               # Root landing / guide with Android·iOS·Desktop switcher
├── landing.css              # Landing page styles
├── landing.js               # Switcher logic (platform defaults, desktop-hides-on-phone)
├── manifest.webmanifest     # Web app manifest (icons, screenshots, shortcuts, share target)
├── pwa.js                   # Shared glue: install prompt, standalone detection, SW registration
├── sw.js                    # Service worker: precache + offline navigation (APK bypasses)
├── styles.css               # App styles (mobile-first + desktop showcase frame)
├── Chili's.apk              # Signed Android TWA package — sideload or use the guide button
├── chili.svg                # Hand-drawn chili mark (logo / favicon / install icon)
├── triple-dipper-logo.webp  # Home hero wordmark (see Disclaimer)
├── lucide.min.js            # Icon set used by the app UI
├── vercel.json              # Security headers + content-type pins (manifest, sw, assetlinks, apk)
├── robots.txt               # Crawl rules for https://chilis-rust.vercel.app
├── sitemap.xml              # Sitemap for https://chilis-rust.vercel.app
├── pwabuilder.txt           # PWABuilder package scan report
└── README.md
```

---

## 👤 Author

Built by **Muhammad Bin Junaid Hashmani** to demonstrate PWA architecture, TWA integration, and modern frontend development.
