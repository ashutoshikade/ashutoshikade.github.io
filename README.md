# ashutoshikade.github.io

My personal website, built with [React](https://react.dev) and [Vite](https://vite.dev) and hosted on GitHub Pages. Live at **https://ashutoshikade.github.io**.

## Run it on your computer

You need Node.js 22.22 or newer (this repo uses 24, see `.nvmrc`). With [nvm](https://github.com/nvm-sh/nvm): `nvm install && nvm use`.

```bash
npm install      # once, downloads the dependencies into node_modules/
npm run dev      # starts the site at http://localhost:5173 and reloads as you edit
npm run build    # builds the production site into dist/
npm run preview  # serves dist/ locally, to check a build before pushing
npm run lint     # checks the code for common mistakes
```

## Where to change things

| To change…                                      | Edit                                     |
| ----------------------------------------------- | ---------------------------------------- |
| Social handles, blog feed, contact form key     | `site.config.js` (all settings live here) |
| Your bio (the Home page intro)                  | `profile/bio.txt` (blank line = new paragraph) |
| Your photo                                      | upload a new one into `profile/photos/` (the newest wins) |
| Skills, projects, location, earlier blog posts  | `src/content.js`                         |
| Other images, video                             | `public/` (served as-is at the site root) |
| Colours, fonts, spacing                         | the variables at the top of `src/index.css` |

Pushing to `main` publishes the site in about a minute. Watch it on the repo's **Actions** tab.

## Updating from your iPhone

Use Safari on github.com. If a button below is missing, tap **aA → Request Desktop Website**.

**New photo:** open `github.com/ashutoshikade/ashutoshikade.github.io/tree/main/profile/photos` → **Add file → Upload files** → pick the photo (full size is fine, HEIC included) → **Commit changes**. The site uses the most recently uploaded photo and resizes it. The link-preview image updates too.

First remove the photo's location: in the Photos app, open it, swipe up, tap **Adjust** under the map → **No Location**. iPhones save where each photo was taken inside the file. The site's copies drop it, but the file you upload is public on GitHub as-is.

**New bio:** open `profile/bio.txt` → tap the pencil (**Edit**) → paste your text (for example, your LinkedIn About) → **Commit changes**.

Either way the site updates in about two minutes. LinkedIn caches link previews for a few days; to refresh it sooner, paste the site URL into [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

## How the blog works

Write and publish posts on Substack. The site picks them up on its own:

1. `scripts/fetch-blog-posts.js` reads the RSS feed set in `site.config.js` (`blog.feedUrl`) and saves the latest posts to `src/generated/blog-posts.json`.
2. The Blog page lists those posts, then the earlier ones from `src/content.js`.
3. The deploy workflow (`.github/workflows/deploy.yml`) re-runs every 3 hours, so new posts show up within a few hours without a push. To show one right away: **Actions → Deploy site → Run workflow**.

Why not fetch the feed from the visitor's browser? Substack and Medium don't let other websites read their feeds from a browser (they send no [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers). Reading the feed at build time avoids that. Any RSS feed works, so moving to another platform later means changing one URL.

If the feed can't be read during a deploy, the build stops on purpose and the live site keeps its previous version. If that happens on a push, re-run the workflow later.

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which emails each message to you. GitHub Pages only serves files and can't run code that sends email, which is why the old PHP mailer never worked. Put your access key in `site.config.js` (`contactForm.web3formsAccessKey`). Until then, the Contact page points visitors to LinkedIn.

## Project map

```
site.config.js            all settings (handles, feed, form key)
profile/
  bio.txt                 the Home page intro
  photos/                 your photos; the newest is used on the site
index.html                the one HTML page; React fills in <div id="root">
vite.config.js            build config + adds link-preview <meta> tags
public/                   static files: images, video, favicon
scripts/                  run before each dev/build (`npm run generate`)
  fetch-blog-posts.js     reads the RSS feed
  prepare-profile-photo.js  makes the web-sized photo + link-preview image
  copy-spa-routes.js      after the build: makes /projects etc. work when opened directly
src/
  main.jsx                entry point: starts React and the router
  App.jsx                 which URL shows which page
  content.js              the site's text
  index.css               all styles
  components/             pieces used by several pages
    Layout.jsx            sidebar + page frame, mobile menu
    Sidebar.jsx           navigation links
    SocialLinks.jsx       social icons (from site.config.js)
    SectionHeader.jsx     heading with a coloured divider
    Expander.jsx          click-to-open box
  hooks/
    useDocumentTitle.js   sets the browser tab title
  pages/                  one file per page
    posts/                blog posts written before Substack
```

## Learning React with this code

### Streamlit → React

| Streamlit app                        | Here                                                               |
| ------------------------------------ | ------------------------------------------------------------------ |
| `constant.py`                        | `src/content.js` (data) and `site.config.js` (settings)            |
| `pages/1_Projects.py` etc.           | `src/pages/Projects.jsx` etc.                                      |
| Page order from file names           | The `navItems` list in `Sidebar.jsx` and the routes in `App.jsx`   |
| `delete_page()` / `add_page()` hacks | Not needed: a route can exist without being in the sidebar (the Binance post) |
| `st.header(..., divider="red")`      | `<SectionHeader>` component                                        |
| `st.columns([1.3, 0.2, 1])`          | CSS grid: `.intro` in `index.css`                                  |
| `st.expander`                        | `<Expander>`, which uses `useState`                                |
| `st.sidebar`                         | `<Sidebar>` inside `<Layout>`                                      |
| The whole script re-runs on every click | Only the components whose state changed re-render              |

### Suggested reading order

1. **`src/main.jsx` → `src/App.jsx`.** How the app starts and how a URL picks a page (React Router).
2. **`src/pages/Home.jsx`.** JSX basics: HTML-like syntax, `{expressions}`, rendering a list with `.map()` and `key`.
3. **`src/components/SectionHeader.jsx`.** Props: passing inputs to a component, default values, `children`.
4. **`src/components/Expander.jsx`.** State with `useState`, and conditional rendering with `&&`.
5. **`src/components/Layout.jsx`.** State shared between components ("lifting state up"), `useEffect`, `<Outlet>`.
6. **`src/hooks/useDocumentTitle.js`.** Writing your own hook.
7. **`src/pages/Contact.jsx`.** Forms, events, `async`/`await` with `fetch`, and showing a different UI per state.

### Small exercises

- Add a skill in `src/content.js` and watch the page update while `npm run dev` is running.
- Read how `src/pages/Home.jsx` turns `profile/bio.txt` into paragraphs (the `?raw` import).
- Give each project an optional `year` and show it under the title.
- Make the Expander open by default with a new `defaultOpen` prop.
- Add an "Experience" page: a file in `src/pages/`, a route in `App.jsx`, a link in `Sidebar.jsx`, and its URL in `scripts/copy-spa-routes.js`.

### Good next reads

- [react.dev/learn](https://react.dev/learn): the official tutorial. "Thinking in React" is the best single page.
- [React Router docs](https://reactrouter.com): routing, links and redirects.
- [MDN CSS guides](https://developer.mozilla.org/en-US/docs/Learn/CSS): for the styling side.
