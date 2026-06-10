export type TaskStatus = 'highlight' | 'muted' | 'disabled'

export type HomeProject = {
  id: string
  title: string
  isDefault: boolean
  created: boolean
  relatedWork: TaskStatus
  writing: TaskStatus
}

export type PendingVisit = {
  projectId: string
  task: 'relatedWork' | 'writing'
  activateTask: boolean
}

export type HomeState = {
  projects: HomeProject[]
  order: string[]
  pendingVisit: PendingVisit | null
}

export const STORAGE_KEY = 'paiper-home-v1'
export const RELATED_WORK_URL = 'https://port-0-hci-me2k6w6de195468f.sel5.cloudtype.app/'
export const WRITING_URL = 'https://vast-rachel-inside-pre.trycloudflare.com/'

export function getInitialHomeState(): HomeState {
  return {
    projects: [
      {
        id: 'ai-prompting',
        title: 'AI Prompting',
        isDefault: true,
        created: true,
        relatedWork: 'highlight',
        writing: 'muted',
      },
    ],
    order: ['ai-prompting'],
    pendingVisit: null,
  }
}

export function loadHomeState(): HomeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return getInitialHomeState()
    }

    const parsed = JSON.parse(raw) as HomeState
    if (!parsed.projects?.length || !parsed.order?.length) {
      return getInitialHomeState()
    }

    return parsed
  } catch {
    return getInitialHomeState()
  }
}

export function saveHomeState(state: HomeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearHomeState() {
  localStorage.removeItem(STORAGE_KEY)
}

export function applyPendingVisit(state: HomeState): HomeState {
  if (!state.pendingVisit) {
    return state
  }

  const { projectId, task, activateTask } = state.pendingVisit
  const order = [projectId, ...state.order.filter((id) => id !== projectId)]

  const projects = state.projects.map((project) => {
    if (project.id !== projectId) {
      return project
    }

    if (!activateTask) {
      return project
    }

    return {
      ...project,
      [task]: 'highlight' as TaskStatus,
    }
  })

  return {
    projects,
    order,
    pendingVisit: null,
  }
}

export type TaskUrlOptions = {
  projectId: string
  firstVisit: boolean
}

export function taskUrl(task: 'relatedWork' | 'writing', options: TaskUrlOptions) {
  const base = task === 'relatedWork' ? RELATED_WORK_URL : WRITING_URL
  const url = new URL(base)
  url.searchParams.set('projectId', options.projectId)
  url.searchParams.set('firstVisit', String(options.firstVisit))
  return url.toString()
}

export function taskCardClass(status: TaskStatus) {
  if (status === 'highlight') {
    return 'task-card-highlight'
  }

  if (status === 'muted') {
    return 'task-card-muted'
  }

  return 'task-card-disabled'
}

export function taskActionLabel(status: TaskStatus) {
  return status === 'highlight' ? 'Back to Work' : 'Start'
}
