import SectionHeader from "../components/SectionHeader.jsx";
import { profile } from "../content.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import siteConfig from "../../site.config.js";

export default function Home() {
  useDocumentTitle();

  // JSX must return a single element; <>...</> (a "fragment") groups several
  // elements without adding an extra <div> to the page.
  return (
    <>
      <SectionHeader as="h1">Hello!</SectionHeader>

      <div className="intro">
        <div>
          {profile.brief.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="intro__fact">📍 {profile.location}</p>
          <p className="intro__fact">🎲 {profile.interests}</p>
        </div>
        <img className="intro__photo" src="/images/profile.jpg" alt={siteConfig.name} width="360" height="240" />
      </div>

      <SectionHeader>
        <span className="text-blue">Skills</span> ⚒️
      </SectionHeader>
      <ul className="skills">
        {profile.skills.map((skill) => (
          <li key={skill} className="chip">
            {skill}
          </li>
        ))}
      </ul>
    </>
  );
}
