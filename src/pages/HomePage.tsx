import { useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import { ArrowCircleIcon, PlusIcon } from '../icons'
import {
  applyPendingVisit,
  clearHomeState,
  getInitialHomeState,
  loadHomeState,
  saveHomeState,
  taskActionLabel,
  taskCardClass,
  taskUrl,
  type HomeProject,
  type HomeState,
  type TaskStatus,
} from '../homeState'

const CARD_BASE_LEFT = 69
const CARD_SECOND_LEFT = 458
const CARD_GAP = 389

function getCardLeft(index: number) {
  return index === 0 ? CARD_BASE_LEFT : CARD_SECOND_LEFT + (index - 1) * CARD_GAP
}

export default function HomePage() {
  const [homeState, setHomeState] = useState<HomeState>(() => applyPendingVisit(loadHomeState()))
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  const persistHomeState = useCallback((nextState: HomeState) => {
    saveHomeState(nextState)
    setHomeState(nextState)
  }, [])

  const syncPendingVisit = useCallback(() => {
    const loaded = loadHomeState()
    if (!loaded.pendingVisit) {
      return
    }

    const nextState = applyPendingVisit(loaded)
    saveHomeState(nextState)
    setHomeState(nextState)
  }, [])

  useEffect(() => {
    syncPendingVisit()

    const handlePageShow = () => {
      syncPendingVisit()
    }

    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('focus', syncPendingVisit)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('focus', syncPendingVisit)
    }
  }, [syncPendingVisit])

  const orderedProjects = homeState.order
    .map((id) => homeState.projects.find((project) => project.id === id))
    .filter((project): project is HomeProject => project !== undefined)

  const openTask = (projectId: string, task: 'relatedWork' | 'writing', status: TaskStatus) => {
    if (status === 'disabled') {
      return
    }

    const pendingState: HomeState = {
      ...homeState,
      pendingVisit: {
        projectId,
        task,
        activateTask: status === 'muted',
      },
    }

    saveHomeState(pendingState)
    window.location.href = taskUrl(task)
  }

  const addProject = () => {
    const id = `project-${Date.now()}`
    const nextState: HomeState = {
      ...homeState,
      projects: [
        ...homeState.projects,
        {
          id,
          title: '',
          isDefault: false,
          created: false,
          relatedWork: 'disabled',
          writing: 'disabled',
        },
      ],
      order: [...homeState.order, id],
    }

    persistHomeState(nextState)
  }

  const updateProjectTitle = (projectId: string, title: string) => {
    const nextState: HomeState = {
      ...homeState,
      projects: homeState.projects.map((project) =>
        project.id === projectId ? { ...project, title, created: false } : project,
      ),
    }

    persistHomeState(nextState)
  }

  const createProject = (projectId: string) => {
    const project = homeState.projects.find((item) => item.id === projectId)
    const projectTitle = project?.title.trim()

    if (!projectTitle) {
      return
    }

    const nextState: HomeState = {
      ...homeState,
      projects: homeState.projects.map((item) =>
        item.id === projectId
          ? {
              ...item,
              created: true,
              relatedWork: 'muted',
              writing: 'muted',
            }
          : item,
      ),
    }

    persistHomeState(nextState)
    setCreatedProjectId(projectId)
    window.setTimeout(() => setCreatedProjectId(null), 1400)
  }

  const handleProjectTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      createProject(projectId)
    }
  }

  const resetWorkspace = useCallback(() => {
    const confirmed = window.confirm(
      '저장된 프로젝트와 진행 상태를 모두 삭제하고 초기 화면으로 돌아갑니다. 계속할까요?',
    )

    if (!confirmed) {
      return
    }

    clearHomeState()
    setHomeState(getInitialHomeState())
    setCreatedProjectId(null)
  }, [])

  useEffect(() => {
    const TRIPLE_PRESS_WINDOW_MS = 700
    let pressCount = 0
    let lastPressAt = 0

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false
      }

      const tag = target.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === '0') {
        event.preventDefault()
        resetWorkspace()
        return
      }

      if (event.key !== ' ' || event.repeat || isEditableTarget(event.target)) {
        return
      }

      const now = Date.now()
      if (now - lastPressAt > TRIPLE_PRESS_WINDOW_MS) {
        pressCount = 0
      }

      pressCount += 1
      lastPressAt = now

      if (pressCount >= 3) {
        event.preventDefault()
        pressCount = 0
        resetWorkspace()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetWorkspace])

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

      {createdProjectId !== null && <div className="home-toast">Project created</div>}

      {orderedProjects.map((project, index) => {
        const relatedWorkStatus = project.relatedWork
        const writingStatus = project.writing
        const relatedWorkLabel = taskActionLabel(relatedWorkStatus)
        const writingLabel = taskActionLabel(writingStatus)
        const relatedWorkActionClass =
          relatedWorkLabel === 'Back to Work' ? 'task-action back-to-work' : 'task-action start-action'
        const writingActionClass =
          writingLabel === 'Back to Work' ? 'task-action back-to-work' : 'task-action start-action'

        return (
          <section
            className={`project-card ${project.isDefault ? 'project-card-primary' : 'project-card-new'}`}
            style={{ left: `${getCardLeft(index)}px` }}
            key={project.id}
          >
            {project.isDefault ? (
              <h3 className="project-title">{project.title}</h3>
            ) : (
              <>
                <input
                  className="project-title project-title-input"
                  value={project.title}
                  onChange={(event) => updateProjectTitle(project.id, event.target.value)}
                  onKeyDown={(event) => handleProjectTitleKeyDown(event, project.id)}
                  placeholder="Insert title"
                  aria-label="New project title"
                />
                {!project.created && <p className="project-meta">Press Enter to create</p>}
              </>
            )}
            <div className="project-line" />

            <article className={`task-card ${taskCardClass(relatedWorkStatus)}`}>
              <h4>Related Work Finding</h4>
              <button
                type="button"
                className={relatedWorkActionClass}
                onClick={() => openTask(project.id, 'relatedWork', relatedWorkStatus)}
                disabled={relatedWorkStatus === 'disabled'}
              >
                <span>{relatedWorkLabel}</span>
                <ArrowCircleIcon />
              </button>
            </article>

            <article className={`task-card ${taskCardClass(writingStatus)}`}>
              <h4>Writing &amp; Evaluation</h4>
              <button
                type="button"
                className={writingActionClass}
                onClick={() => openTask(project.id, 'writing', writingStatus)}
                disabled={writingStatus === 'disabled'}
              >
                <span>{writingLabel}</span>
                <ArrowCircleIcon />
              </button>
            </article>
          </section>
        )
      })}

      <button
        type="button"
        className="add-project-card"
        style={{ left: `${getCardLeft(orderedProjects.length)}px` }}
        onClick={addProject}
        aria-label="Add new project"
      >
        <PlusIcon />
      </button>
    </main>
  )
}
