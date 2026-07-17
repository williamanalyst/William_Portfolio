# William — Data Science Portfolio

## Run locally

Install Node.js 18.17+ and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit content

All editable text, project entries, social links, email placeholder, and SEO fields are in `content/site.ts`. Update `siteUrl` before deploying. Add or replace images in `public/images/`; image dimension guidance is in `public/images/README.md`.

## Deploy on GitHub Pages

This repository is configured for GitHub Pages. Commit and push it to the `main` branch of a GitHub repository, then open **Settings → Pages** in that repository and set **Source** to **GitHub Actions**. The included workflow builds the static site and deploys it automatically after each push to `main`.

For a normal project repository called `portfolio`, the public URL will be `https://YOUR-GITHUB-USERNAME.github.io/portfolio/`. For a repository named `YOUR-GITHUB-USERNAME.github.io`, it will publish directly at `https://YOUR-GITHUB-USERNAME.github.io/`.

Before the first deployment, update `siteUrl` in `content/site.ts` to that final public URL. This keeps canonical URLs, sitemap, and robots metadata correct.

## Privacy

The palette generator runs entirely in the browser and no analytics or form collection are included. If either is added, update the privacy/disclaimer text in `app/page.tsx`.

## Future monetisation

The primary intent is career and consulting enquiries. A donation link, clearly labelled affiliate resources, or optional paid export tools can be added later without changing the core tool.
