import type { SiteContent } from "../content/validation";

export default function Portfolio({ site }: { site: SiteContent }) {
  return (
    <>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label={`${site.name} home`}>W<span>X</span></a>
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
            <h1>{site.hero.title}<br/><em>{site.hero.titleEmphasis}</em></h1>
            <p className="lead">{site.hero.description}</p>
            <div className="actions">
              <a className="button" href={site.resume} download>{site.hero.resumeLabel}</a>
              <a className="text-link" href="#work">Explore the case studies ↓</a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Professional profile summary">
            <span className="panel-label">{site.profile.label}</span>
            <p>{site.profile.headline}<br/>{site.profile.headlineSecondLine}</p>
            <div className="mini-chart" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
            <div className="panel-foot"><span>{site.profile.location}</span><span>{site.profile.focus}</span></div>
          </aside>
        </section>

        <section className="metrics" id="impact" aria-label="Career highlights">
          {site.metrics.map((metric) => <article key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}
        </section>

        <section className="statement">
          <p className="eyebrow">{site.statement.eyebrow}</p>
          <h2>{site.statement.start} <em>{site.statement.emphasis}</em>{site.statement.end}</h2>
        </section>

        <section className="work" id="work">
          <div className="section-head">
            <div><p className="eyebrow">{site.work.eyebrow}</p><h2>{site.work.title}<br/>{site.work.titleSecondLine}</h2></div>
            <p>{site.work.description}</p>
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
            <div><p className="eyebrow">{site.expertise.eyebrow}</p><h2>{site.expertise.title}<br/>{site.expertise.titleSecondLine}</h2></div>
            <p>{site.expertise.description}</p>
          </div>
          <div className="skill-grid">{site.capabilities.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          <div className="toolbelt"><span>TOOLKIT</span><p>{site.tools.join("  ·  ")}</p></div>
        </section>

        <section className="about" id="about">
          <div><p className="eyebrow">{site.aboutHeading.eyebrow}</p><h2>{site.aboutHeading.title}<br/><em>{site.aboutHeading.titleEmphasis}</em></h2></div>
          <div className="about-copy">{site.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<blockquote>{site.aboutHeading.quote}</blockquote></div>
        </section>

        <section className="contact">
          <p className="eyebrow">{site.contact.eyebrow}</p>
          <h2>{site.contact.title}</h2>
          <div className="actions">
            <a className="button light" href={site.linkedin} target="_blank" rel="noreferrer">{site.contact.linkLabel}</a>
            <a className="text-link light-link" href={site.resume} download>Download résumé ↓</a>
          </div>
        </section>
      </main>
      <footer><a className="brand" href="#top">W<span>X</span></a><p>{site.footer}</p><p>© {new Date().getFullYear()} {site.name}</p></footer>
    </>
  );
}
