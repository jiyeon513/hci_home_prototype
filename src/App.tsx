import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'

type AuthMode = 'login' | 'signup'
type NewProject = {
  title: string
  created: boolean
}

const RELATED_WORK_URL = 'https://port-0-hci-me2k6w6de195468f.sel5.cloudtype.app/'

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <circle cx="9.5" cy="5.5" r="3.5" stroke="rgba(30, 30, 30, 0.25)" strokeWidth="1.6" />
      <path
        d="M3 16.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
        stroke="rgba(30, 30, 30, 0.25)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="12" height="8" rx="2" stroke="rgba(30, 30, 30, 0.25)" strokeWidth="2" />
      <path
        d="M7 9V6.5C7 4.01 9.01 2 11.5 2S16 4.01 16 6.5V9"
        stroke="rgba(30, 30, 30, 0.25)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true">
      <path
        d="M22.05 11.75c0-.76-.07-1.49-.2-2.18H11.5v4.12h5.92a4.92 4.92 0 0 1-2.13 3.23v2.68h3.45c2.02-1.86 3.18-4.6 3.18-7.85z"
        fill="#4285F4"
      />
      <path
        d="M11.5 22.5c2.88 0 5.3-.95 7.07-2.58l-3.45-2.68c-.95.64-2.17 1.02-3.62 1.02-2.78 0-5.14-1.88-5.98-4.4H2.02v2.77C3.76 20.02 7.4 22.5 11.5 22.5z"
        fill="#34A853"
      />
      <path
        d="M5.52 13.86c-.22-.64-.35-1.32-.35-2.02s.13-1.38.35-2.02V7.05H2.02A11.48 11.48 0 0 0 0 11.84c0 1.93.46 3.75 1.28 5.35l3.24-2.53z"
        fill="#FBBC05"
      />
      <path
        d="M11.5 5.38c1.57 0 2.98.54 4.09 1.6l3.06-3.06C16.8 1.68 14.38.5 11.5.5 7.4.5 3.76 2.98 2.02 7.05l3.5 2.72c.84-2.52 3.2-4.4 5.98-4.4z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ArrowCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.7" stroke="#333333" strokeWidth="1.6" />
      <path d="M6.8 5.2L9.6 8L6.8 10.8" stroke="#333333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="61" height="61" viewBox="0 0 61 61" fill="none" aria-hidden="true">
      <circle cx="30.5" cy="30.5" r="25.42" fill="rgba(29, 27, 32, 0.66)" />
      <path d="M30.5 18.5V42.5M18.5 30.5H42.5" stroke="#E7E7E7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function App() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [page, setPage] = useState<'auth' | 'home'>(() =>
    window.location.pathname === '/home' ? 'home' : 'auth',
  )
  const [newProjects, setNewProjects] = useState<NewProject[]>([])
  const [createdProjectIndex, setCreatedProjectIndex] = useState<number | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupVerifyPassword, setSignupVerifyPassword] = useState('')
  const [signupError, setSignupError] = useState(false)
  const [signupCompleted, setSignupCompleted] = useState(false)
  const isLogin = mode === 'login'
  const isLoginReady = loginEmail.trim() !== '' && loginPassword.trim() !== ''
  const isSignupReady =
    signupEmail.trim() !== '' && signupPassword.trim() !== '' && signupVerifyPassword.trim() !== ''
  const isSubmitReady = isLogin ? isLoginReady : isSignupReady

  useEffect(() => {
    const handlePopState = () => {
      setPage(window.location.pathname === '/home' ? 'home' : 'auth')
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openRelatedWork = () => {
    window.location.href = RELATED_WORK_URL
  }

  const updateNewProjectTitle = (index: number, title: string) => {
    setNewProjects((projects) =>
      projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, title, created: false } : project,
      ),
    )
  }

  const createProject = (index: number) => {
    const projectTitle = newProjects[index]?.title.trim()
    if (!projectTitle) {
      return
    }

    setNewProjects((projects) =>
      projects.map((project, projectIndex) =>
        projectIndex === index && project.title.trim() !== '' ? { ...project, created: true } : project,
      ),
    )
    setCreatedProjectIndex(index)
    window.setTimeout(() => setCreatedProjectIndex(null), 1400)
  }

  const handleProjectTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      createProject(index)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLogin) {
      if (isLoginReady) {
        window.history.pushState(null, '', '/home')
        setPage('home')
      }
      return
    }

    if (!isSignupReady) {
      return
    }

    if (signupPassword !== signupVerifyPassword) {
      setSignupError(true)
      return
    }

    setSignupError(false)
    setSignupCompleted(true)
    window.setTimeout(() => {
      setSignupCompleted(false)
      setSignupEmail('')
      setSignupPassword('')
      setSignupVerifyPassword('')
      setMode('login')
    }, 950)
  }

  if (page === 'home') {
    return (
      <main className="home-page">
        <header className="home-header">
          <div>
            <p className="home-eyebrow">pAIper WORKSPACE</p>
            <h1 className="home-title">Home</h1>
            <p className="home-subtitle">Organize your academic writing workflow in one place.</p>
          </div>
        </header>

        <div className="projects-heading">
          <h2 className="projects-title">Projects</h2>
          <p>Press + to create a project card, then enter a title to activate it.</p>
        </div>

        {createdProjectIndex !== null && <div className="home-toast">Project created</div>}

        <section className="project-card project-card-primary">
          <h3 className="project-title">AI Prompting</h3>
          <div className="project-line" />

          <article className="task-card task-card-highlight">
            <h4>Related Work Finding</h4>
            <button type="button" className="task-action back-to-work" onClick={openRelatedWork}>
              <span>Back to Work</span>
              <ArrowCircleIcon />
            </button>
          </article>

          <article className="task-card task-card-muted">
            <h4>Writing &amp; Evaluation</h4>
            <button type="button" className="task-action start-action">
              <span>Start</span>
              <ArrowCircleIcon />
            </button>
          </article>
        </section>

        {newProjects.map((project, index) => (
          <section
            className="project-card project-card-new"
            style={{ left: `${458 + index * 389}px` }}
            key={index}
          >
            <input
              className="project-title project-title-input"
              value={project.title}
              onChange={(event) => updateNewProjectTitle(index, event.target.value)}
              onKeyDown={(event) => handleProjectTitleKeyDown(event, index)}
              placeholder="Insert title"
              aria-label="New project title"
            />
            {!project.created && <p className="project-meta">Press Enter to create</p>}
            <div className="project-line" />

            <article className={`task-card ${project.created ? 'task-card-muted' : 'task-card-disabled'}`}>
              <h4>Related Work Finding</h4>
              <button
                type="button"
                className="task-action start-action"
                onClick={openRelatedWork}
                disabled={!project.created}
              >
                <span>Start</span>
                <ArrowCircleIcon />
              </button>
            </article>

            <article className={`task-card ${project.created ? 'task-card-muted' : 'task-card-disabled'}`}>
              <h4>Writing &amp; Evaluation</h4>
              <button type="button" className="task-action start-action" disabled={!project.created}>
                <span>Start</span>
                <ArrowCircleIcon />
              </button>
            </article>
          </section>
        ))}

        <button
          type="button"
          className="add-project-card"
          style={{ left: `${458 + newProjects.length * 389}px` }}
          onClick={() => setNewProjects((projects) => [...projects, { title: '', created: false }])}
          aria-label="Add new project"
        >
          <PlusIcon />
        </button>
      </main>
    )
  }

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <img src="/pAIper_logo.png" alt="pAIper" className="auth-logo" />
        <p className="auth-tagline">: Your Trusted AI Partner for Academic Writing</p>
      </section>

      <div className="auth-divider" aria-hidden="true" />

      <section className="auth-form-section">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setMode('login')
              setSignupError(false)
              setSignupCompleted(false)
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setMode('signup')
              setSignupError(false)
              setSignupCompleted(false)
            }}
          >
            Sign Up
          </button>
          <div className="auth-tab-line" aria-hidden="true" />
          <div className={`auth-tab-indicator ${isLogin ? 'login' : 'signup'}`} aria-hidden="true" />
        </div>

        <form className={`auth-form ${isLogin ? '' : 'signup-form'}`} onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-field-icon">
              <UserIcon />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              value={isLogin ? loginEmail : signupEmail}
              onChange={(event) =>
                isLogin ? setLoginEmail(event.target.value) : setSignupEmail(event.target.value)
              }
            />
          </label>

          <label className="auth-field">
            <span className="auth-field-icon">
              <LockIcon />
            </span>
            <input
              type="password"
              placeholder="Enter your password"
              value={isLogin ? loginPassword : signupPassword}
              onChange={(event) => {
                if (isLogin) {
                  setLoginPassword(event.target.value)
                  return
                }

                setSignupPassword(event.target.value)
                setSignupError(false)
              }}
            />
          </label>

          {!isLogin && (
            <div className="signup-verification">
              <label className="auth-field">
                <span className="auth-field-icon">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  placeholder="Verify password"
                  value={signupVerifyPassword}
                  onChange={(event) => {
                    setSignupVerifyPassword(event.target.value)
                    setSignupError(false)
                  }}
                />
              </label>
              {signupError && <p className="signup-error">*password verification failed</p>}
            </div>
          )}

          {isLogin && (
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="auth-forgot">
                Forget Password ?
              </button>
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit ${isLogin ? '' : 'signup-submit'} ${isSubmitReady ? 'active' : ''} ${
              signupCompleted ? 'completed' : ''
            }`}
          >
            <span>{signupCompleted ? 'sign up completed' : isLogin ? 'Login' : 'Sign UP'}</span>
          </button>
        </form>

        <div className="auth-social-divider">
          <span className="auth-social-line" />
          <span className="auth-social-text">or continue with</span>
          <span className="auth-social-line" />
        </div>

        <div className="auth-social-buttons">
          <button type="button" className="auth-social-btn google" aria-label="Continue with Google">
            <GoogleIcon />
          </button>
          <button type="button" className="auth-social-btn github" aria-label="Continue with GitHub">
            <GithubIcon />
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
