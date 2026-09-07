export const site = {
  name: "William Xie",
  siteUrl: "https://william-data-portfolio.william-cheers.chatgpt.site",
  linkedin: "https://www.linkedin.com/in/williamzmx/",
  resume: "/William_Xie_Data_Analytics_AI_Resume.pdf",
  seo: {
    title: "William Xie | Data Analytics & AI Leader",
    description:
      "Portfolio of William Xie, a Sydney-based data analytics and AI leader delivering pricing, automation, machine learning and decision products with measurable commercial impact."
  },
  hero: {
    title: "Data that moves",
    titleEmphasis: "business forward.",
    resumeLabel: "Download résumé ↓",
    eyebrow: "Data Analytics & AI Leader · Sydney",
    description:
      "I turn ambiguous commercial questions into decision-ready analytics, scalable automation and applied AI—combining hands-on technical delivery with the stakeholder leadership to make solutions stick."
  },
  profile: {
    label: "PROFILE / 2026",
    headline: "Highly technical.",
    headlineSecondLine: "Commercially focused.",
    location: "Sydney, Australia",
    focus: "Analytics & AI leadership"
  },
  statement: {
    eyebrow: "What I bring",
    start: "I turn complex evidence into",
    emphasis: "clear commercial value",
    end: "—then build the systems that make it repeatable."
  },
  work: {
    eyebrow: "Selected analytics & AI portfolio",
    title: "From problem",
    titleSecondLine: "to practical value.",
    description: "Four concrete case studies grounded in the July 30 résumé: the business question, the delivery approach, and the value created."
  },
  expertise: {
    eyebrow: "End-to-end capability",
    title: "From raw signal",
    titleSecondLine: "to confident action.",
    description: "Hands-on across the full data lifecycle, with the commercial judgement and stakeholder skill to connect technical work to what matters."
  },
  aboutHeading: {
    eyebrow: "About William",
    title: "Analytical rigour.",
    titleEmphasis: "Human clarity.",
    quote: "“Clarify the decision. Build the evidence. Make the value usable.”"
  },
  contact: {
    eyebrow: "Let’s build something useful",
    title: "Looking for a data leader who can connect models, systems and commercial outcomes?",
    linkLabel: "Connect on LinkedIn ↗"
  },
  footer: "Data Analytics · AI · Automation",
  metrics: [
    { value: "3%+", label: "profit uplift delivered" },
    { value: "$500M+", label: "annual portfolio influenced" },
    { value: "50%+", label: "effort saved in selected workflows" },
    { value: "40+", label: "cross-functional projects delivered" }
  ],
  projects: [
    {
      category: "Commercial analytics · Delivered",
      title: "Pricing intelligence that moved portfolio profit",
      summary:
        "Turned fragmented pricing signals into a reusable decision system for category, finance and operations teams.",
      challenge:
        "Identify under- and over-priced products at portfolio scale while giving stakeholders evidence they could test and act on.",
      approach:
        "Combined elasticity modelling, product clustering, web-scraped competitive intelligence, customer feedback and structured price-change testing.",
      outcome: "+3% profit across a $500M+ annual portfolio",
      image: "/images/project_agentic_analytics.png",
      alt: "Analyst reviewing an interconnected pricing analytics workflow",
      tags: ["Price elasticity", "Machine learning", "Web intelligence", "Cross-functional delivery"]
    },
    {
      category: "Multimodal AI · Delivered model portfolio",
      title: "Customer signals translated into better product decisions",
      summary:
        "Connected visual, language and behavioural signals to help teams understand what customers prefer and why.",
      challenge:
        "Design and marketing decisions depended on high-volume, disconnected image, text and campaign signals.",
      approach:
        "Built CNN-based design-preference models and NLP/sentiment analysis, then paired the findings with segmentation, A/B testing and content analysis.",
      outcome: "Applied to design relevance, marketing content and customer understanding",
      image: "/images/project_multimodal_documents.png",
      alt: "Analyst connecting insights across many documents and dashboards",
      tags: ["Computer vision", "NLP & sentiment", "TensorFlow", "Experimentation"]
    },
    {
      category: "Recommendation AI · Solution design",
      title: "Real-time recommendations for the next best product",
      summary:
        "Shaped a production-minded recommender concept for cross-sell and up-sell decisions—not a disconnected model demo.",
      challenge:
        "Commercial teams needed a way to turn customer and product behaviour into relevant recommendations at the point of decision.",
      approach:
        "Defined an Azure ML-based real-time recommender path, connecting model scoring to product selection, operational hand-offs and measurable use cases.",
      outcome: "Decision-ready design for real-time cross-sell and up-sell",
      image: "/images/project_realtime_recommendations.png",
      alt: "Product team reviewing a real-time recommendation network",
      tags: ["Recommender systems", "Azure ML", "Real-time scoring", "Commercial activation"]
    },
    {
      category: "Responsible AI operations · Operational foundation",
      title: "Controls that make analytics reliable in production",
      summary:
        "Built the operational discipline around data and AI products so teams could trust, maintain and adopt them.",
      challenge:
        "Recurring data products needed dependable processing, clear controls and practical support beyond initial delivery.",
      approach:
        "Managed SQL Server Agent jobs and BAU data controls; improved synchronisation; and embedded testing, documentation, knowledge sharing and stakeholder feedback.",
      outcome: "Lower manual effort, error risk and delivery time",
      image: "/images/project_responsible_ai_monitoring.png",
      alt: "Data leader monitoring model workflows, quality signals and controls",
      tags: ["Data quality", "BAU controls", "Monitoring", "Adoption & governance"]
    }
  ],
  capabilities: [
    {
      title: "Data engineering",
      description:
        "Design reliable pipelines, databases, migrations, scraping, APIs and recurring ETL across Azure, SQL and Spark."
    },
    {
      title: "Analytics & modelling",
      description:
        "Translate ambiguous questions into pricing, forecasting, segmentation, optimisation and machine-learning solutions."
    },
    {
      title: "Decision products",
      description:
        "Turn complex evidence into clear action through Power BI, Tableau, geospatial analysis and executive storytelling."
    },
    {
      title: "Delivery leadership",
      description:
        "Connect insight to finance, category, sales, marketing, IT and operations—and move recommendations into delivery."
    }
  ],
  tools: [
    "Python",
    "PySpark",
    "T-SQL",
    "PostgreSQL",
    "R",
    "TensorFlow",
    "scikit-learn",
    "Azure Databricks",
    "Data Factory",
    "Azure ML",
    "Power BI",
    "Tableau",
    "REST / SOAP APIs",
    "SSIS",
    "Git / Azure DevOps"
  ],
  about: [
    "William is a commercially focused analytics and AI leader with 6+ years of consistently achieving performance objectives. He works across the full data lifecycle—from extraction and modelling to reporting, automation and implementation.",
    "He combines hands-on SQL, Python, Power BI, Tableau and Azure delivery with stakeholder confidence across Finance, Category, Marketing, Sales, IT and Operations.",
    "His approach is consultative and outcome-led: clarify the decision, build the right evidence, communicate it in human terms and create the operational path for adoption."
  ]
} as const;
