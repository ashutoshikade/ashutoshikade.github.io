import { useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import siteConfig from "../../site.config.js";

// Web3Forms receives the message and emails it to you. GitHub Pages can only
// serve files; it can't run code that sends email, which is why the old PHP
// mailer (mail/contact_me.php) never worked there.
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export default function Contact() {
  useDocumentTitle("Contact");
  // One of: "idle" | "sending" | "sent" | "error". The page shows a different
  // button label and message for each one.
  const [status, setStatus] = useState("idle");
  const accessKey = siteConfig.contactForm.web3formsAccessKey;

  async function handleSubmit(event) {
    // Stop the browser's default behaviour of loading a new page on submit.
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New message from ${siteConfig.url}`,
          // FormData reads every field in the form by its `name`.
          ...Object.fromEntries(new FormData(form)),
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <SectionHeader as="h1">📫 Get In Touch With Me!</SectionHeader>

      {!accessKey ? (
        <p className="notice">
          The contact form is coming soon. Meanwhile, please reach out on{" "}
          <a href={`https://www.linkedin.com/in/${siteConfig.social.linkedin}`} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          .
          {/* import.meta.env.DEV is true only while running `npm run dev`. */}
          {import.meta.env.DEV && " (Developer note: add contactForm.web3formsAccessKey in site.config.js.)"}
        </p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your name" aria-label="Your name" required />
          <input type="email" name="email" placeholder="Your email id" aria-label="Your email" required />
          <textarea name="message" placeholder="Your message" aria-label="Your message" rows="6" required />
          {/* Spam trap: hidden from people, but bots fill in every field. Web3Forms
              discards any message where this box is ticked. */}
          <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} autoComplete="off" />

          <button type="submit" className="button button--submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>

          {status === "sent" && <p className="notice notice--success">Thanks! Your message is on its way.</p>}
          {status === "error" && (
            <p className="notice notice--error">Something went wrong. Please try again in a moment.</p>
          )}
        </form>
      )}
    </>
  );
}
