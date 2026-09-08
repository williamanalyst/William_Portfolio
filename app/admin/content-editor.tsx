"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentState } from "../../content/store";
import { site } from "../../content/site";
import { validateContent, type SiteContent } from "../../content/validation";
import Portfolio from "../portfolio";

const label = (key: string) => ({ seo: "Search & sharing", hero: "Hero", metrics: "Impact metrics", projects: "Case studies", aboutHeading: "About heading", work: "Case study heading", expertise: "Expertise heading", siteUrl: "Website address", linkedin: "LinkedIn profile URL", alt: "Image description", eyebrow: "Section label", titleEmphasis: "Emphasised title", titleSecondLine: "Title, second line" }[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase()));

type Value = string | Value[] | { [key: string]: Value };
function Fields({ value, template, path, onChange }: { value: Value; template: Value; path: string; onChange: (value: Value) => void }) {
  if (typeof value === "string") return <label className="cms-field" htmlFor={path}>
    <span>{(Number.isInteger(Number(path.split(".").at(-1))) ? "Text" : label(path.split(".").at(-1)!))}</span>
    {(typeof template === "string" && template.length > 100) || /description|summary|challenge|approach|quote|about\.\d+$/.test(path)
      ? <textarea id={path} value={value} rows={4} maxLength={6000} onChange={event => onChange(event.target.value)} />
      : <input id={path} value={value} maxLength={6000} onChange={event => onChange(event.target.value)} />}
    {/\.(image)$/.test(path) && <small>Use an existing /images/ path or a full HTTPS link.</small>}
  </label>;
  if (Array.isArray(value)) return <div className="cms-list">
    {value.map((item, index) => <fieldset className="cms-item" key={index}>
      <legend>{label(path.split(".").at(-1)!)} {index + 1}</legend>
      <Fields value={item} template={(template as Value[])[0]} path={`${path}.${index}`} onChange={next => onChange(value.map((previous, at) => at === index ? next : previous))} />
      <div className="cms-item-actions">
        <button type="button" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Move up</button>
        <button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; onChange(next); }}>Move down</button>
        <button type="button" disabled={value.length === 1} onClick={() => { if (window.confirm("Remove this entry from the draft?")) onChange(value.filter((_, at) => at !== index)); }}>Remove</button>
      </div>
    </fieldset>)}
    <button type="button" disabled={value.length >= 50} onClick={() => onChange([...value, structuredClone((template as Value[])[0])])}>+ Add entry</button>
  </div>;
  return <div className="cms-fields">{Object.entries(value).map(([key, item]) => <Fields key={key} value={item} template={(template as Record<string, Value>)[key]} path={`${path}.${key}`} onChange={next => onChange({ ...value, [key]: next })} />)}</div>;
}

export default function ContentEditor() {
  const [state, setState] = useState<ContentState | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const preview = useRef<HTMLDialogElement>(null);
  const dirty = content !== null && JSON.stringify(content) !== saved;

  async function load() {
    setError("");
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState(data); setContent(data.draft); setSaved(JSON.stringify(data.draft));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load content. Please retry."); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(action: "draft" | "publish") {
    if (!state || !content) return;
    setError(""); setMessage("");
    try { validateContent(content); }
    catch (err) { setError((err as Error).message); return; }
    if (action === "publish" && !window.confirm("Publish these changes to your public portfolio now?")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, revision: state.revision, action }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSaved(JSON.stringify(content));
      const now = new Date().toISOString();
      setState({ ...state, draft: content, revision: result.revision, updatedAt: now, ...(action === "publish" ? { published: content, publishedAt: now } : {}) });
      setMessage(action === "publish" ? "Published. Your portfolio is up to date." : "Draft saved. Your public portfolio has not changed.");
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed. Your edits are still here; please try again."); }
    finally { setBusy(false); }
  }

  return <main className="cms">
    <header className="cms-header"><div><p className="cms-eyebrow">WILLIAM XIE / CONTENT STUDIO</p><h1>Your portfolio, in your words.</h1><p>Edit a section, preview your changes, then publish when you’re ready.</p></div><div className="cms-links"><a href="/" target="_blank" rel="noreferrer">View portfolio ↗</a><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">Sign out</a></div></header>
    <div className="cms-toolbar"><span>{busy ? "Saving…" : dirty ? "Unsaved changes" : state?.updatedAt ? "Draft saved" : "Ready to edit"}</span><div><button disabled={!content || busy} onClick={() => preview.current?.showModal()}>Preview</button><button disabled={!content || busy} onClick={() => void save("draft")}>Save draft</button><button className="cms-button" disabled={!content || busy} onClick={() => void save("publish")}>Publish content ↗</button></div></div>
    <div className="cms-notice" aria-live="polite">{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}</div>
    {!content ? <p>{error ? <button onClick={() => void load()}>Retry loading</button> : "Loading your content…"}</p> : <>
      <fieldset className="cms-form" disabled={busy}><legend className="cms-sr-only">Website content</legend>
        <details open><summary>Identity & links</summary><div className="cms-section">{(["name", "siteUrl", "linkedin", "footer"] as const).map(key => <Fields key={key} value={content[key]} template={site[key]} path={`content.${key}`} onChange={value => { setMessage(""); setContent({ ...content, [key]: value }); }} />)}</div></details>
        {Object.entries(content).filter(([key]) => !["name", "siteUrl", "linkedin", "footer"].includes(key)).map(([key, value]) => <details key={key}><summary>{label(key)}{Array.isArray(value) && <span>{value.length} entries</span>}</summary><div className="cms-section"><Fields value={value as Value} template={site[key as keyof typeof site] as unknown as Value} path={`content.${key}`} onChange={next => { setMessage(""); setContent({ ...content, [key]: next }); }} /></div></details>)}
      </fieldset>
      <p className="cms-footnote">{state?.publishedAt ? `Last published: ${new Date(state.publishedAt).toLocaleString()}` : "Your original portfolio stays live until you publish."} Your LinkedIn profile URL updates both contact buttons. Images can use existing files or an HTTPS address.</p>
      <dialog className="cms-preview" ref={preview}><div className="cms-preview-bar"><strong>Draft preview</strong><button onClick={() => preview.current?.close()}>Close preview ×</button></div><div onClick={event => { if ((event.target as HTMLElement).closest("a")) event.preventDefault(); }}><Portfolio site={content} /></div></dialog>
    </>}
  </main>;
}
