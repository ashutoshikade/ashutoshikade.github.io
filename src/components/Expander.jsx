import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

// A box that opens and closes when clicked, like Streamlit's st.expander.
export default function Expander({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="expander">
      <button
        type="button"
        className="expander__toggle"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {label}
        <FaChevronDown className="expander__chevron" aria-hidden="true" />
      </button>
      {/* The contents are only rendered once opened, so something heavy like a
          YouTube player isn't downloaded unless the visitor asks for it. */}
      {open && <div className="expander__body">{children}</div>}
    </div>
  );
}
