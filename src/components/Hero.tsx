import CharacterCanvas from './CharacterCanvas'
import MagneticCursor from './MagneticCursor'

const PROFILE_URL = 'https://ankitaworksataress.github.io/profile/'
const EMAIL = 'mailto:ankitasudhakarbhadane@gmail.com'

export default function Hero() {
  return (
    <main className="hero" id="home">
      <CharacterCanvas />
      <MagneticCursor />

      <header className="nav-wrap">
        <nav className="nav-pill" aria-label="Primary">
          <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
            Profile
          </a>
          <a href={EMAIL}>Contact</a>
        </nav>
      </header>

      <section className="hero-copy">
        <p className="eyebrow">Hi, I&apos;m</p>
        <h1 className="name">Ankita</h1>
        <p className="role">Cloud / DevOps Engineer</p>
        <p className="bio">
          I build and automate reliable cloud infrastructure, from provisioning
          and deployments to monitoring and production operations.
          <br />
          <br />
          6 years of hands-on experience across AWS, Terraform, CI/CD,
          containers, and observability.
        </p>
        <div className="cta-row">
          <a
            className="btn"
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View My Profile
          </a>
          <a className="btn btn-ghost" href={EMAIL}>
            Let&apos;s Talk
          </a>
        </div>
      </section>
    </main>
  )
}
