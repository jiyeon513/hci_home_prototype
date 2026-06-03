# pAIper Auth UI

```bash
npm install
npm run dev
```

로컬: http://localhost:5180

## Vercel 배포 (권장)

1. https://vercel.com 에서 GitHub 계정으로 로그인
2. **Add New Project** → `jiyeon513/hci_home_prototype` Import
3. Framework Preset: **Vite** (자동 감지), Build: `npm run build`, Output: `dist`
4. **Deploy** 클릭 → `https://프로젝트명.vercel.app` 에서 바로 접속

`main`에 push할 때마다 자동 재배포됩니다. `/` 와 `/home` 라우팅은 `vercel.json`의 SPA rewrite로 처리됩니다.

CLI로 배포할 때:

```bash
npx vercel login
npx vercel --prod
```

## GitHub Pages 배포

배포 URL: **https://jiyeon513.github.io/hci_home_prototype/**

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포합니다.

### 최초 1회 설정 (GitHub 저장소)

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. `main`에 push 후 Actions 탭에서 `Deploy to GitHub Pages` 워크플로가 성공하는지 확인

### 로컬에서 Pages 빌드 미리보기

```bash
npm run build:pages
npm run preview
```

`http://localhost:5180/hci_home_prototype/` 에서 확인합니다.

### Home 개발자 reset (UI에 버튼 없음)

- `Ctrl` + `Shift` + `0`
- 스페이스바 3번 (0.7초 이내, 입력창 포커스 시 제외)
