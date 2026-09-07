# William Xie — Data Analytics & AI Portfolio

A portfolio of commercial analytics, applied AI, automation, and data engineering work, with an online content editor.

[View the portfolio](https://william-data-portfolio.william-cheers.chatgpt.site) · [Open the content editor](https://william-data-portfolio.william-cheers.chatgpt.site/admin) · [LinkedIn](https://www.linkedin.com/in/williamzmx/)

## Edit the website

Once this version is deployed to Sites:

1. Open `/admin` on the portfolio website and choose **Sign in with ChatGPT**. Use the owner's account configured in `CMS_ADMIN_EMAIL`.
2. Expand a section and edit its text or links. You can add, remove, and reorder case studies, metrics, capabilities, tools, and about paragraphs.
3. Choose **Preview** to review the current draft. **Save draft** stores it without changing the public website.
4. Choose **Publish content** and confirm to make the changes visible immediately. No GitHub commit or redeployment is needed for content edits.

Only the configured owner may read drafts or save changes. Visitors can continue reading the portfolio without signing in. A conflicting save from another session is rejected rather than overwriting newer work; copy your unsaved edits before reloading if that happens.

Image and résumé fields accept existing paths (such as `/images/project_agentic_analytics.png`) or full HTTPS URLs. Upload new assets through your existing file hosting, or add them to `public/` and deploy the code. File uploads are not included in this editor.

Published content and drafts live in the Sites D1 database, not in GitHub. `content/site.ts` supplies the initial content only; editing that file does not overwrite content already saved in the database. Keep the D1 database when deploying updates. The archived prototype, `standalone.html`, is independent of the editor.

## Personal GitHub introduction

[`GITHUB_PROFILE.md`](GITHUB_PROFILE.md) is a ready-to-copy personal introduction based on this portfolio. To display it on your GitHub profile, copy its contents into `README.md` in the public repository `williamanalyst/williamanalyst`. Publishing that profile repository is separate from this website project.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
```

Copy `.env.example` to `.env`, then run:

```sh
npm run db:migrate:local
npm run dev
```

Open `http://localhost:3000`. The public portfolio uses the local D1 database. ChatGPT sign-in is provided by Sites on the hosted domain; it is not a local login service. Local integration tests simulate the trusted dispatcher headers. Do not expose the local development server to the internet or deploy this Worker outside the trusted Sites dispatcher without replacing its authentication boundary.

```sh
npm test
npm run typecheck
npm run test:integration
npm run build
```

Run `test:integration` while the local server is running. It exercises access control, input validation, draft isolation, save conflicts, publication, metadata, and script escaping, then restores the local draft and published content. It never targets the live website.

The app uses React, Vinext, and Cloudflare Workers. Schema changes are defined in `db/schema.ts`; `npm run db:generate` creates versioned Drizzle migrations. Sites applies migrations during deployment. The tests use Node's built-in test runner.

## Hosting

This version requires Sites hosting with the `DB` D1 binding and a `CMS_ADMIN_EMAIL` environment variable. It cannot run as a static GitHub Pages site. The GitHub workflow verifies the code; it does not publish the website. The `.openai/hosting.json` file retains the existing Sites project, and runtime settings are managed through Sites.

Deploy the validated Worker output and the `drizzle/` migrations together. Do not include `.env` or generated `.dev.vars` files in deployment archives. Keep the site public for portfolio visitors while restricting the content editor through its server-side owner check.
