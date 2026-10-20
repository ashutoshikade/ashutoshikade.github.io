// =============================================================================
// site.config.js: every setting for the website lives in this one file.
//
// Change your social handles, blog feed or contact form key here.
// Page text (bio, skills, projects) lives in src/content.js instead.
//
// Nothing in this file is secret, and nothing should be: a static website
// sends all of its code to every visitor's browser, so anything written here
// is public. That's fine for everything below (see the notes on each value).
// =============================================================================

const siteConfig = {
  name: "Ashutosh Ekade",
  url: "https://ashutoshikade.github.io",
  // Shown in Google results and in link previews on LinkedIn, X, Slack, etc.
  description:
    "Ashutosh Ekade: Machine Learning Engineer and Financial Engineer (UCLA MFE, IIT Kharagpur).",

  // Usernames only, not full URLs. Leave a value as "" to hide that icon.
  social: {
    facebook: "ashutoshikade",
    instagram: "ashutoshikade",
    x: "", // TODO: your new X/Twitter handle, without the @
    github: "ashutoshikade",
    linkedin: "ashutoshikade",
  },

  blog: {
    // The RSS feed the Blog page lists posts from.
    //   Substack: "https://<your-publication>.substack.com/feed"
    //   Medium:   "https://medium.com/feed/@<your-username>"
    // The GitHub Action re-reads this feed every few hours and republishes
    // the site, so new posts appear here without you pushing anything.
    feedUrl: "",
    // Where the "Subscribe" button on the Blog page points ("" hides it).
    // Usually your Substack home page, e.g. "https://<your-publication>.substack.com".
    subscribeUrl: "",
    // How many of the latest feed posts to show.
    maxPosts: 20,
  },

  contactForm: {
    // Free access key from https://web3forms.com: enter your email and they
    // email you a key. Paste it here. It's public by design: all it can do
    // is deliver form messages to your inbox, so it's safe in this file.
    web3formsAccessKey: "",
  },
};

export default siteConfig;
