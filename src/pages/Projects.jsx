import Expander from "../components/Expander.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { projects } from "../content.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function Projects() {
  useDocumentTitle("Projects");

  return (
    <>
      <SectionHeader as="h1">Projects</SectionHeader>

      {projects.map((project) => (
        <section key={project.title} className="project">
          <SectionHeader>{project.title}</SectionHeader>
          <p>{project.description}</p>

          <div className="button-row">
            {project.links.map((link) => (
              <a key={link.url} className="button" href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>

          {/* `condition && <Element />` renders the element only if the condition is true. */}
          {project.video && (
            // preload="metadata" fetches just enough to show the player; the full
            // video only downloads when someone presses play.
            <video className="media" src={project.video} controls preload="metadata" playsInline />
          )}

          {project.youtube && (
            <Expander label={project.youtube.label}>
              <iframe
                className="media media--embed"
                src={`https://www.youtube-nocookie.com/embed/${project.youtube.id}`}
                title={project.youtube.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Expander>
          )}
        </section>
      ))}
    </>
  );
}
