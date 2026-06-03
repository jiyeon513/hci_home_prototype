# pAIper Auth UI

```bash
npm install
npm run dev
```

로컬: http://localhost:5180

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
