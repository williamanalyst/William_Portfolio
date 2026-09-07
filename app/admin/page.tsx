import type { Metadata } from "next";
import { editorAccess } from "../chatgpt-auth";
import ContentEditor from "./content-editor";
import "./editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content editor", robots: { index: false, follow: false } };

export default async function Admin() {
  const access = await editorAccess();
  if (access !== "editor") return <main className="cms cms-gate">
    <p className="cms-eyebrow">WILLIAM XIE / CONTENT STUDIO</p><h1>Edit your portfolio.</h1>
    <p>{access === "anonymous" ? "Sign in with your ChatGPT account to manage your website." : access === "unconfigured" ? "The editor account needs to be configured before content can be changed." : "This account does not have permission to edit the portfolio. Sign in with the owner's account."}</p>
    <a className="cms-button" href={access === "anonymous" ? "/signin-with-chatgpt?return_to=%2Fadmin" : "/signout-with-chatgpt?return_to=%2Fadmin"} target="_top">{access === "anonymous" ? "Sign in with ChatGPT →" : "Sign out"}</a>
    <a href="/">View portfolio ↗</a>
  </main>;
  return <ContentEditor />;
}
