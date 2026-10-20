// A heading with a coloured line under it, like Streamlit's
// st.header("...", divider="red").
//
//   <SectionHeader as="h1">Projects</SectionHeader>
//   <SectionHeader divider="rainbow">Skills</SectionHeader>
//
// `as` picks the heading level (h2 unless you say otherwise); `children` is
// whatever you put between the opening and closing tags.
export default function SectionHeader({ as: Heading = "h2", divider = "red", children }) {
  return <Heading className={`section-header section-header--${divider}`}>{children}</Heading>;
}
