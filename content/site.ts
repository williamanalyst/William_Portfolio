export const site = {
  name: "William",
  siteUrl: "https://example.com",
  linkedin: "https://www.linkedin.com/in/williamzmx/",
  seo: {
    title: "William | Data Analytics, Data Science & Automation",
    description: "William is a Sydney-based data professional turning complex data into profitable decisions, automation, and measurable business value."
  },
  hero: {
    eyebrow: "Data Analytics · Data Science · Automation",
    description: "I combine analytics, machine learning, data engineering, and commercial judgement to improve profit, sharpen customer decisions, and make teams more efficient."
  },
  metrics: [
    { value: "3%+", label: "profit uplift on a $500M+ portfolio" },
    { value: "50%+", label: "workload saved through automation" },
    { value: "550+", label: "marketing campaigns managed" },
    { value: "6 yrs", label: "of achieving every KPI" }
  ],
  projects: [
    { category: "Pricing & profitability", title: "Turning pricing data into portfolio profit", description: "Led a cross-functional price-change program using elasticity and competitive-pricing models, customer feedback, and structured testing across category, finance, and operations.", impact: "+3% profit", tags: ["Price elasticity", "Machine learning", "Stakeholder leadership"] },
    { category: "Automation & data engineering", title: "Building an automation engine for better work", description: "Designed cloud data workflows and automated recurring processes across Azure Databricks, Data Factory, DevOps, Blob Storage, Python, PySpark, SQL, and REST/SOAP APIs.", impact: "50%+ effort saved", tags: ["Azure", "Python / PySpark", "ETL & APIs"] },
    { category: "Marketing & customer insight", title: "Making every customer interaction more relevant", description: "Combined campaign operations with NLP, computer vision, A/B testing, segmentation, and behaviour analysis to improve content, timing, design, and targeting.", impact: "2× benchmark", tags: ["NLP & CV", "Customer analytics", "Marketing automation"] },
    { category: "Machine learning products", title: "Models designed for decisions—not demos", description: "Built forecasting, product-clustering, recommender, CNN, LSTM, and sentiment-analysis solutions for cashflow, commodity pricing, design preference, cross-sell, and product selection.", impact: "Production-minded ML", tags: ["TensorFlow", "Forecasting", "Recommender systems"] }
  ],
  capabilities: [
    { title: "Data engineering", description: "Design and manage reliable pipelines, databases, migrations, web scraping, APIs, and recurring ETL across SQL Server, PostgreSQL, Azure, and Spark." },
    { title: "Analytics & modelling", description: "Translate ambiguous questions into forecasting, pricing, segmentation, optimisation, and machine-learning models that support real decisions." },
    { title: "Visualisation & reporting", description: "Make complex evidence easy to act on through Power BI, Tableau, geospatial analysis, executive reporting, and thoughtful data storytelling." },
    { title: "Commercial activation", description: "Connect insight to pricing, product, sales, marketing, UX, and operations—working across functions to get improvements adopted and delivered." }
  ],
  tools: ["Python", "PySpark", "T-SQL", "PostgreSQL", "R", "TensorFlow", "scikit-learn", "Azure Databricks", "Data Factory", "Azure ML", "Power BI", "Tableau", "REST / SOAP APIs", "SSIS", "Git / Azure DevOps"],
  about: [
    "William is an experienced data analyst and data scientist who works comfortably across the full data lifecycle—from extraction and modelling to visualisation, reporting, and implementation.",
    "He is known for combining technical depth with commercial focus. His work has improved profitability, customer engagement, decision quality, and team efficiency, while his collaborative approach has helped more than 20 cross-functional projects move from idea to outcome.",
    "Alongside hands-on delivery, William brings stakeholder management, mentoring, training, problem-solving, and a consistent record of reliability: every KPI achieved over six years and agreed work delivered."
  ]
} as const;
