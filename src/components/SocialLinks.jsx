import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import siteConfig from "../../site.config.js";

const platforms = [
  { key: "facebook", label: "Facebook", Icon: FaFacebook, profileUrl: (handle) => `https://www.facebook.com/${handle}` },
  { key: "instagram", label: "Instagram", Icon: FaInstagram, profileUrl: (handle) => `https://www.instagram.com/${handle}` },
  { key: "x", label: "X (Twitter)", Icon: FaXTwitter, profileUrl: (handle) => `https://x.com/${handle}` },
  { key: "github", label: "GitHub", Icon: FaGithub, profileUrl: (handle) => `https://github.com/${handle}` },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin, profileUrl: (handle) => `https://www.linkedin.com/in/${handle}` },
];

// Icons for every platform that has a handle in site.config.js.
export default function SocialLinks() {
  const visible = platforms.filter((platform) => siteConfig.social[platform.key]);

  return (
    <ul className="social">
      {visible.map(({ key, label, Icon, profileUrl }) => (
        <li key={key}>
          <a href={profileUrl(siteConfig.social[key])} target="_blank" rel="noreferrer" aria-label={label}>
            <Icon aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
