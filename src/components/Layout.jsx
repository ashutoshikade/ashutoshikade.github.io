import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Outlet, useLocation } from "react-router";
import siteConfig from "../../site.config.js";
import Sidebar from "./Sidebar.jsx";

// The frame around every page: the sidebar on the left (a slide-out menu on
// phones) and the current page on the right.
export default function Layout() {
  // State: a value React remembers between renders. Calling setMenuOpen
  // re-renders this component with the new value.
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Effect: code that runs after rendering, here every time the URL changes.
  // Without this, opening a new page would keep the old page's scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      {/* Only visible on small screens (see .topbar in index.css). */}
      <header className="topbar">
        <span className="topbar__name">{siteConfig.name}</span>
        <button
          type="button"
          className="icon-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </header>

      <Sidebar open={menuOpen} onNavigate={closeMenu} />
      {menuOpen && <div className="backdrop" onClick={closeMenu} />}

      <main className="content">
        <div className="content__inner">
          {/* <Outlet> is where the page matching the current URL is drawn. */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
