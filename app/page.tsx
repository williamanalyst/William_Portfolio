import { site } from "../content/site";

export default function Home() {
  return (
    <>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="William home">W<span>X</span></a>
        <nav aria-label="Primary navigation">
          <a href="#impact">Impact</a><a href="#work">Work</a><a href="#expertise">Expertise</a><a href="#about">About</a>
          <a className="nav-cta" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1>Data that moves<br/><em>business forward.</em></h1>
            <p className="lead">{site.hero.description}</p>
            <div className="actions"><a className="button" href="#work">Explore my work ↓</a><a className="text-link" href={site.linkedin} target="_blank" rel="noreferrer">Connect with William ↗</a></div>
          </div>
          <aside className="hero-panel" aria-label="Professional profile summary">
            <span className="panel-label">PROFILE / 01</span>
            <p>Highly technical.<br/>Highly commercial.</p>
            <div className="mini-chart" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
            <div className="panel-foot"><span>Sydney, Australia</span><span>Open to opportunities</span></div>
          </aside>
        </section>

        <section className="metrics" id="impact" aria-label="Career highlights">
          {site.metrics.map((metric) => <article key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}
        </section>

        <section className="statement">
          <p className="eyebrow">What I bring</p>
          <h2>I turn complex data into <em>clear commercial value</em>—then build the systems that make it repeatable.</h2>
        </section>

        <section className="work" id="work">
          <div className="section-head"><div><p className="eyebrow">Selected impact</p><h2>Work that changed<br/>the outcome.</h2></div><p>Commercial problems, technical solutions, and measurable results—delivered in partnership with teams across category, finance, marketing, operations, IT, and sales.</p></div>
          <div className="project-list">
            {site.projects.map((project, index) => <article className="project" key={project.title}>
              <div className="project-index">0{index + 1}</div>
              <div><p className="category">{project.category}</p><h3>{project.title}</h3></div>
              <div className="project-detail"><p>{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
              <strong className="impact">{project.impact}</strong>
            </article>)}
          </div>
        </section>

        <section className="expertise" id="expertise">
          <div className="section-head"><div><p className="eyebrow">End-to-end capability</p><h2>From raw signal<br/>to confident action.</h2></div><p>Hands-on across the full data lifecycle, with the commercial judgement to connect technical work to what matters.</p></div>
          <div className="skill-grid">{site.capabilities.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          <div className="toolbelt"><span>TOOLKIT</span><p>{site.tools.join("  ·  ")}</p></div>
        </section>

        <section className="about" id="about">
          <div><p className="eyebrow">About William</p><h2>Analytical rigour.<br/><em>Human clarity.</em></h2></div>
          <div className="about-copy">{site.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<blockquote>“The upper limit is turning data into value. The foundation is making work simpler, faster, and more reliable.”</blockquote></div>
        </section>

        <section className="contact"><p className="eyebrow">Let’s build something useful</p><h2>Looking for a data leader who can connect models, systems, and commercial outcomes?</h2><a className="button light" href={site.linkedin} target="_blank" rel="noreferrer">Start a conversation ↗</a></section>
      </main>
      <footer><a className="brand" href="#top">W<span>X</span></a><p>Data Science · Analytics · Automation</p><p>© {new Date().getFullYear()} William</p></footer>
    </>
  );
}
