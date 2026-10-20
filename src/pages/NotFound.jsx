import { Link } from "react-router";
import SectionHeader from "../components/SectionHeader.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <>
      <SectionHeader as="h1">Page not found</SectionHeader>
      <p>
        This page doesn&apos;t exist. Head back <Link to="/">home</Link>.
      </p>
    </>
  );
}
