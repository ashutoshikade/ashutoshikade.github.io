import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects.jsx";
import ExploringBinanceApi from "./pages/posts/ExploringBinanceApi.jsx";

// URLs from earlier versions of the site (the CSS site and the Streamlit app),
// redirected to their new homes so old links on LinkedIn etc. keep working.
const oldUrls = {
  "index.html": "/",
  "about.html": "/",
  "post.html": "/blog",
  "btc.html": "/blog/exploring-binance-api",
  btc: "/blog/exploring-binance-api",
  "contact.html": "/contact",
  resume: "/", // the Resume page is switched off for now
};

// Maps each URL to a page. When you add a page, also add its URL to
// scripts/copy-spa-routes.js so it works when opened directly.
export default function App() {
  return (
    <Routes>
      {/* Every page renders inside <Layout>, which draws the sidebar around it. */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/exploring-binance-api" element={<ExploringBinanceApi />} />
        <Route path="contact" element={<Contact />} />

        {Object.entries(oldUrls).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}

        {/* "*" matches anything not matched above. */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
