import CharacterCanvas from './CharacterCanvas'
import MagneticCursor from './MagneticCursor'

const PROFILE_URL = 'https://ankitaworksataress.github.io/profile/'
const EMAIL = 'mailto:ankitasudhakarbhadane@gmail.com'
const LINKEDIN = 'https://linkedin.com/in/ankita-bhadane-370ba5152'
const GITHUB = 'https://github.com/ankitaworksataress'

export default function Hero() {
  return (
    <>
      <main className="hero" id="home">
        <CharacterCanvas />
        <MagneticCursor />

        <header className="nav-wrap">
          <nav className="nav-pill" aria-label="Primary">
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              My Work
            </a>
            <a href="#about">About</a>
            <a href={EMAIL}>Contact</a>
          </nav>
        </header>

        <section className="hero-copy">
          <p className="eyebrow">Hi, I&apos;m</p>
          <h1 className="name">Ankita</h1>
          <p className="role">Cloud / DevOps Engineer</p>
          <p className="bio">
            I turn messy cloud ops into calm, automated systems — Terraform,
            CI/CD, and observability that keep AWS production boring (in a good
            way). Six years in. Still hunting down surprise bills before merge.
          </p>
          <div className="cta-row">
            <a
              className="btn"
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              See My Work
            </a>
            <a className="btn btn-ghost" href={EMAIL}>
              Let&apos;s Talk
            </a>
          </div>
        </section>
      </main>

      <section className="panel panel-about" id="about" aria-labelledby="about-title">
        <div className="panel-inner narrow">
          <p className="panel-eyebrow">About</p>
          <h2 id="about-title">Infrastructure that ships itself</h2>
          <p>
            Cloud &amp; DevOps engineer with 6 years across hosting support,
            cloud operations, and DevOps — now focused on Terraform automation,
            secure CI/CD, and platforms that stay up without heroics.
          </p>
          <p>
            Builder of <strong>CloudCostLens</strong>, so cost impact shows up
            in the pull request — not in next month&apos;s invoice.
          </p>
          <ul className="about-chips">
            <li>AWS Solutions Architect – Associate</li>
            <li>Terraform · GitHub Actions · ECS</li>
            <li>Datadog · Grafana · CloudWatch</li>
          </ul>
          <div className="cta-row">
            <a
              className="btn"
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Full Profile
            </a>
            <a
              className="btn btn-ghost"
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn btn-ghost"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
