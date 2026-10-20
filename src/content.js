// =============================================================================
// content.js: the words on the site. This is the React version of
// constant.py from the Streamlit app: edit the text here and every page
// that uses it updates. Settings (social handles, keys, ...) live in
// site.config.js at the root of the repo.
//
// Your bio and photo live in profile/ instead (bio.txt and photos/), so you
// can change them from your phone without touching any code.
// =============================================================================

export const profile = {
  location: "Los Angeles, California",
  interests: "Quantitative Research, Machine Learning, Data Science",
  skills: [
    "Python", "C", "HTML", "R", "SQL",
    "PyTorch", "TensorFlow", "NumPy", "Pandas", "scikit-learn",
    "Elastic", "Hugging Face", "LlamaIndex", "OpenAI API", "Git",
    "DVC", "Flask", "Docker", "Kubernetes", "Kubeflow",
    "Kafka", "Jenkins", "ArgoCD", "AWS", "GCP",
  ],
};

// Each project gets a heading, a description, link buttons and optional media.
//   video:   a file in public/ that plays on the page
//   youtube: a YouTube video shown inside a "See more" expander
export const projects = [
  {
    title: "Merlin Invoice Reader | Zycus",
    description:
      "Invoice Reader (aka Table Insights) combines custom trained Entity Extraction using Transformers, object detection and OCR modules",
    links: [
      { label: "Visit Company Page", url: "https://www.zycus.com/solution/procure-to-pay/invoice-extraction" },
    ],
    video: "/media/invoice-reader.mp4",
    youtube: { label: "See more on Merlin AI", id: "iEIYW-20u8I" },
  },
  {
    title: "Merlin Risk Radar | Zycus",
    description:
      "Scans millions of sources of publicly available information to assess different types of risks for a given supplier of orders.",
    links: [
      { label: "Visit Company Page", url: "https://www.zycus.com/videos/product/gain-a-360-supplier-risk-profile-with-zycus-irisk" },
      { label: "Explore Merlin AI", url: "https://www.zycus.com/merlin-experience-center" },
    ],
  },
  {
    title: "AI Tutor for Personalized Learning | Quantiphi",
    description: "Guide students in reading comprehension and essay writing tasks.",
    links: [
      { label: "Visit Company Page", url: "https://quantiphi.com/case-studies/ai-tutor-for-enhanced-learning/" },
    ],
  },
  {
    title: "Question-Answering on Pharmaceutical Knowledge Base | Quantiphi",
    description:
      "Non-generative QnA system for answering drug discovery and chemical process questions trained on client's internal data.",
    links: [
      { label: "Visit Company Page", url: "https://quantiphi.com/case-studies/extracting-insights-through-knowledge-graphs/" },
    ],
  },
];

// Posts written before the blog moved to a feed (Substack). They're listed on
// the Blog page after the posts fetched from the feed. A url starting with "/"
// is a page on this site; anything else opens in a new tab.
export const earlierPosts = [
  {
    title: "Exploring Binance API",
    subtitle: "Implementing Moving Average crossover on BTCUSDT using Binance API",
    url: "/blog/exploring-binance-api",
  },
  {
    title: "Data Pipelines 2.0",
    subtitle: "Moving towards modern data pipelines",
    url: "https://medium.com/@pluto7/your-organization-needs-a-fresh-start-data-warehousing-2-0-d8fe92b32ef1",
  },
];
