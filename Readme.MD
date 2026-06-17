# GS WorkShope — Client-Facing Business Site

Gurjot Singh's own site for GS WorkShope — built to show real project work to potential clients and give them a direct way to get in touch and hire him. It's a React frontend with a fully editable content layer: every section (hero, services, projects, about, contact, footer) pulls its copy and images from a settings object that's managed through a built-in `/admin` dashboard, rather than being hardcoded in the components — so it can double as a template for client sites built the same way.

## Tech stack

**Frontend:** React + Vite, Framer Motion for scroll reveals and page-load animation, Lucide React for icons.
**Content/media:** Cloudinary for image uploads from the admin panel (with a manual URL-paste fallback if Cloudinary isn't configured).
**Backend:** a REST API (MERN-style — Node/Express + MongoDB) that the frontend calls through `src/services/api.js`. The backend code itself isn't part of this repo snapshot; this README documents the frontend's expectations of it.
**Auth:** JWT-based admin login, token kept in `localStorage`.

> Note: routing is handled manually (`window.history.pushState` + a `popstate` listener in `Admin.jsx`) rather than with `react-router-dom`. If you add real client-side routing later, that's the piece to replace.

## Project structure

```
src/
├── main.jsx                  # app entry — CSS import order matters, see below
├── pages/
│   ├── Home.jsx               # public site, assembles all sections
│   └── Admin.jsx               # login gate + admin route switch
├── layouts/
│   └── MainLayout.jsx          # wraps public pages with Navbar/Footer/CustomCursor
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── common/
│   │   ├── CustomCursor.jsx    # custom dot+ring cursor, public site only by default
│   │   └── WaveDivider.jsx
│   └── admin/
│       ├── AdminLayout.jsx     # sidebar shell for all /admin/* pages
│       ├── Dashboard.jsx       # quick-edit overview
│       ├── Projects.jsx        # full CRUD for project cards
│       ├── Settings.jsx        # full settings form, all sections
│       ├── AdminHelpers.jsx    # shared form primitives (input, textarea, list editors)
│       └── ImageUploadField.jsx
├── sections/                  # one component per public-site section
│   ├── Hero.jsx
│   ├── Marquee.jsx
│   ├── Stats.jsx
│   ├── Features.jsx
│   ├── Projects.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── data/
│   └── siteData.js             # default content + mergeSiteSettings()
├── utils/
│   ├── motion.js               # shared Framer Motion variants (reveal, stagger, etc.)
│   └── premiumMotion.js         # useTilt, useScrollReveal hooks
├── services/
│   └── api.js                  # all fetch calls to the backend
└── styles/
    ├── global.css
    ├── premium-royal.css       # gold/serif visual layer on top of global.css
    ├── admin-extra.css
    ├── zz-final-fixes.css      # cursor/contrast/mobile-nav bugfixes — import last
    └── navbar-royal.css         # royal navbar styling — import after zz-final-fixes
```

CSS import order in `main.jsx` matters because later files override earlier ones:

```js
import "./styles/global.css";
import "./styles/premium-royal.css";
import "./styles/admin-extra.css";
import "./styles/zz-final-fixes.css";
import "./styles/navbar-royal.css";
```

## Getting started

```bash
npm install
npm run dev      # starts Vite, defaults to http://localhost:5173
npm run build     # production build to /dist
```

### Environment variables

Create a `.env` in the project root:

```
VITE_API_URL=http://localhost:5000/api          # wherever your backend runs
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

Cloudinary is optional — without it, the admin image fields still work via manual URL paste, they just won't support direct file upload.

## Admin panel

Visit `/admin` and log in with whatever credentials your backend issues. Once authenticated:

- **Overview** (`/admin`) — quick-edit homepage stats and hero headline/CTAs.
- **Projects** (`/admin/projects`) — create, edit, delete, and feature/publish project cards.
- **Settings** (`/admin/settings`) — full control over every section's copy, images, and lists (nav links, tech stack chips, services, about cards, footer links).

Changes save through `updateSettings()`/`createProject()` etc. in `services/api.js` and take effect on the public site on next load (the homepage re-fetches settings via `getPublicSettings()` on mount).

## Known design notes

- The custom cursor (`CustomCursor.jsx`) is mounted in `MainLayout` for the public site and explicitly in `Admin.jsx` for the dashboard, so it should be visible everywhere. If you add new top-level pages later, remember to mount it there too — it isn't global by default.
- The mobile nav menu (`.gs-mobile-menu`) is intentionally `position: absolute`, anchored to `.navbar`. Don't change it to `fixed` — `.navbar` has `backdrop-filter`, which makes it the containing block for fixed descendants too, and collapses the menu's height to ~0.
- `.about-p2` and `.gs-mobile-menu a` have explicit color overrides in `zz-final-fixes.css` — both were previously inheriting near-invisible colors from a dark-panel design that doesn't actually apply to this layout. Keep those overrides if you touch that CSS again.

## License

Personal business site — add a license here if you intend to open-source any part of it (MIT is the common default for this kind of code).