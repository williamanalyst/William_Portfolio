import { site } from "../content/site";

export default function Home() {
  return (
    <>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="William Xie home">W<span>X</span></a>
        <nav aria-label="Primary navigation">
          <a href="#impact">Impact</a>
          <a href="#work">Case studies</a>
          <a href="#expertise">Expertise</a>
          <a href="#about">About</a>
          <a className="nav-resume" href={site.resume} download>Download résumé ↓</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="shoreline" aria-hidden="true"><span /></div>
          <div className="hero-copy">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1>Data that moves<br/><em>business forward.</em></h1>
            <p className="lead">{site.hero.description}</p>
            <div className="actions">
              <a className="button" href={site.resume} download>Download July 30 résumé ↓</a>
              <a className="text-link" href="#work">Explore the case studies ↓</a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Professional profile summary">
            <span className="panel-label">PROFILE / 2026</span>
            <p>Highly technical.<br/>Commercially focused.</p>
            <div className="mini-chart" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
            <div className="panel-foot"><span>Sydney, Australia</span><span>Analytics & AI leadership</span></div>
          </aside>
        </section>

        <section className="metrics" id="impact" aria-label="Career highlights">
          {site.metrics.map((metric) => <article key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}
        </section>

        <section className="statement">
          <p className="eyebrow">What I bring</p>
          <h2>I turn complex evidence into <em>clear commercial value</em>—then build the systems that make it repeatable.</h2>
        </section>

        <section className="work" id="work">
          <div className="section-head">
            <div><p className="eyebrow">Selected analytics & AI portfolio</p><h2>From problem<br/>to practical value.</h2></div>
            <p>Four concrete case studies grounded in the July 30 résumé: the business question, the delivery approach, and the value created.</p>
          </div>
          <div className="case-grid">
            {site.projects.map((project, index) => (
              <article className="case-study" key={project.title}>
                <figure>
                  <img src={project.image} alt={project.alt} loading={index === 0 ? "eager" : "lazy"}/>
                  <figcaption><span>0{index + 1}</span><span>{project.category}</span></figcaption>
                </figure>
                <div className="case-body">
                  <div className="case-intro"><h3>{project.title}</h3><p>{project.summary}</p></div>
                  <dl className="case-details">
                    <div><dt>Challenge</dt><dd>{project.challenge}</dd></div>
                    <div><dt>Approach</dt><dd>{project.approach}</dd></div>
                  </dl>
                  <div className="case-result"><span>Outcome</span><strong>{project.outcome}</strong></div>
                  <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="expertise" id="expertise">
          <div className="section-head">
            <div><p className="eyebrow">End-to-end capability</p><h2>From raw signal<br/>to confident action.</h2></div>
            <p>Hands-on across the full data lifecycle, with the commercial judgement and stakeholder skill to connect technical work to what matters.</p>
          </div>
          <div className="skill-grid">{site.capabilities.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          <div className="toolbelt"><span>TOOLKIT</span><p>{site.tools.join("  ·  ")}</p></div>
        </section>

        <section className="about" id="about">
          <div><p className="eyebrow">About William</p><h2>Analytical rigour.<br/><em>Human clarity.</em></h2></div>
          <div className="about-copy">{site.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<blockquote>“Clarify the decision. Build the evidence. Make the value usable.”</blockquote></div>
        </section>

        <section className="contact">
          <p className="eyebrow">Let’s build something useful</p>
          <h2>Looking for a data leader who can connect models, systems and commercial outcomes?</h2>
          <div className="actions">
            <a className="button light" href={site.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a>
            <a className="text-link light-link" href={site.resume} download>Download résumé ↓</a>
          </div>
        </section>
      </main>
      <footer><a className="brand" href="#top">W<span>X</span></a><p>Data Analytics · AI · Automation</p><p>© {new Date().getFullYear()} William Xie</p></footer>
    </>
  );
}
