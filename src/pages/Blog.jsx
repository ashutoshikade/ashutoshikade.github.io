import { Link } from "react-router";
import SectionHeader from "../components/SectionHeader.jsx";
import { earlierPosts } from "../content.js";
import feedPosts from "../generated/blog-posts.json";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import siteConfig from "../../site.config.js";

// feedPosts comes from your blog's RSS feed (see scripts/fetch-blog-posts.js),
// newest first. earlierPosts are the ones from before the feed (content.js).
const posts = [...feedPosts, ...earlierPosts];

const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function Blog() {
  useDocumentTitle("Blog");
  const { subscribeUrl } = siteConfig.blog;

  return (
    <>
      <SectionHeader as="h1">Blog</SectionHeader>

      {subscribeUrl && (
        <div className="button-row">
          <a className="button" href={subscribeUrl} target="_blank" rel="noreferrer">
            Subscribe
          </a>
        </div>
      )}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.url} className="post-list__item">
            <div>
              <h2 className="post-list__title">
                <PostLink url={post.url}>{post.title}</PostLink>
              </h2>
              {post.date && <p className="post-list__date">{dateFormat.format(new Date(post.date))}</p>}
              <p className="post-list__subtitle">{post.subtitle}</p>
            </div>
            {post.image && <img className="post-list__image" src={post.image} alt="" loading="lazy" />}
          </li>
        ))}
      </ul>
    </>
  );
}

// Posts on this site use <Link>, which switches pages without reloading.
// Posts elsewhere (Substack, Medium) are ordinary links opening a new tab.
function PostLink({ url, children }) {
  if (url.startsWith("/")) return <Link to={url}>{children}</Link>;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
