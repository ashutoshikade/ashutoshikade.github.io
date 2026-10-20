import SectionHeader from "../components/SectionHeader.jsx";
import { profile } from "../content.js";
import photo from "../generated/profile-photo.json";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import siteConfig from "../../site.config.js";
// "?raw" is a Vite feature: it imports the file's text as a plain string.
import bioText from "../../profile/bio.txt?raw";

// A blank line in bio.txt starts a new paragraph.
const bio = bioText.trim().split(/\n\s*\n/);

export default function Home() {
  useDocumentTitle();

  // JSX must return a single element; <>...</> (a "fragment") groups several
  // elements without adding an extra <div> to the page.
  return (
    <>
      <SectionHeader as="h1">Hello!</SectionHeader>

      <div className="intro">
        <div>
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="intro__fact">📍 {profile.location}</p>
          <p className="intro__fact">🎲 {profile.interests}</p>
        </div>
        <img className="intro__photo" src={photo.src} alt={siteConfig.name} width={photo.width} height={photo.height} />
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
