import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GithubIcon, GoogleIcon, LockIcon, UserIcon } from '../icons'

type AuthMode = 'login' | 'signup'

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLogin) {
      if (isLoginReady) {
        navigate('/home')
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

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <img src={`${import.meta.env.BASE_URL}pAIper_logo.png`} alt="pAIper" className="auth-logo" />
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
