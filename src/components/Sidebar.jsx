import { NavLink } from "react-router";
import siteConfig from "../../site.config.js";
import SocialLinks from "./SocialLinks.jsx";

const navItems = [
  // `end` makes Home active only on "/" itself, not on every page under it.
  { to: "/", label: "Home", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Props (`open`, `onNavigate`) are the inputs a parent passes to a component,
// like arguments to a function. Layout decides whether the menu is open.
export default function Sidebar({ open, onNavigate }) {
  return (
    <aside id="sidebar" className={open ? "sidebar sidebar--open" : "sidebar"}>
      <p className="sidebar__name">{siteConfig.name}</p>
      <nav aria-label="Main">
        <ul className="nav">
          {navItems.map((item) => (
            // React needs a unique `key` on each item of a list it renders.
            <li key={item.to}>
              {/* NavLink adds class="active" when its page is open. */}
              <NavLink to={item.to} end={item.end} className="nav__link" onClick={onNavigate}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <SocialLinks />
    </aside>
  );
}
