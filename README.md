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
| Bio, skills, projects, earlier blog posts       | `src/content.js`                         |
| Photo, images, video                            | `public/` (served as-is at the site root) |
| Colours, fonts, spacing                         | the variables at the top of `src/index.css` |

Pushing to `main` publishes the site in about a minute. Watch it on the repo's **Actions** tab.

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
index.html                the one HTML page; React fills in <div id="root">
vite.config.js            build config + adds link-preview <meta> tags
public/                   static files: images, video, favicon
scripts/
  fetch-blog-posts.js     reads the RSS feed before each dev/build run
  copy-spa-routes.js      makes /projects etc. work when opened directly
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
- Give each project an optional `year` and show it under the title.
- Make the Expander open by default with a new `defaultOpen` prop.
- Add an "Experience" page: a file in `src/pages/`, a route in `App.jsx`, a link in `Sidebar.jsx`, and its URL in `scripts/copy-spa-routes.js`.

### Good next reads

- [react.dev/learn](https://react.dev/learn): the official tutorial. "Thinking in React" is the best single page.
- [React Router docs](https://reactrouter.com): routing, links and redirects.
- [MDN CSS guides](https://developer.mozilla.org/en-US/docs/Learn/CSS): for the styling side.
