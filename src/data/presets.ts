import { LicenseId, LicenseInfo, ErrorSolution, ProjectConfig } from '../types/project';

export const TECH_BADGES: Record<string, { label: string; badge: string; color: string }> = {
  'React': { label: 'React', badge: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB', color: '#61DAFB' },
  'TypeScript': { label: 'TypeScript', badge: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white', color: '#007ACC' },
  'JavaScript': { label: 'JavaScript', badge: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black', color: '#F7DF1E' },
  'Tailwind CSS': { label: 'Tailwind CSS', badge: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white', color: '#38B2AC' },
  'Vite': { label: 'Vite', badge: 'https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white', color: '#646CFF' },
  'Node.js': { label: 'Node.js', badge: 'https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white', color: '#339933' },
  'Express': { label: 'Express.js', badge: 'https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white', color: '#ffffff' },
  'Next.js': { label: 'Next.js', badge: 'https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white', color: '#ffffff' },
  'Python': { label: 'Python', badge: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white', color: '#3776AB' },
  'FastAPI': { label: 'FastAPI', badge: 'https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi', color: '#005571' },
  'HTML5/CSS3': { label: 'HTML5/CSS3', badge: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white', color: '#E34F26' },
  'PostgreSQL': { label: 'PostgreSQL', badge: 'https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white', color: '#316192' },
  'Firebase': { label: 'Firebase', badge: 'https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black', color: '#FFCA28' },
  'Docker': { label: 'Docker', badge: 'https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white', color: '#2CA5E0' }
};

export const DEFAULT_CONFIG: ProjectConfig = {
  projectName: 'My Awesome Project',
  repoName: 'my-awesome-project',
  githubUsername: 'my-github-username',
  description: 'A modern, high-performance web application built with clean architecture and modern developer tooling.',
  visibility: 'public',
  defaultBranch: 'main',
  authorName: 'Developer',
  authorEmail: 'dev@example.com',
  authorGithub: 'my-github-username',
  remoteMethod: 'https',
  primaryLanguage: 'TypeScript',
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  features: [
    '⚡ Blazing fast performance powered by Vite and React',
    '🎨 Elegant and responsive UI styled with Tailwind CSS',
    '🔒 Type-safe codebase with strict TypeScript verification',
    '📱 100% Mobile, tablet, and desktop responsive layout',
    '🚀 Ready for one-click deployment to Vercel, Netlify, or Cloud Run'
  ],
  installCommand: 'npm install',
  runCommand: 'npm run dev',
  buildCommand: 'npm run build',
  envVars: [
    { id: '1', name: 'VITE_API_BASE_URL', description: 'Base endpoint URL for backend requests', defaultValue: 'https://api.example.com' },
    { id: '2', name: 'PORT', description: 'Port number for the local preview server', defaultValue: '3000' }
  ],
  licenseType: 'MIT',
  gitignoreTemplate: 'Node/React',
  customGitignoreRules: ['.env.local', 'build/', '.cache/'],
  includeBadges: true,
  includeDemoLink: true,
  demoUrl: 'https://my-app-demo.vercel.app',
  includeScreenshotsPlaceholder: true,
  hasSecretsExposed: false
};

export const TEMPLATE_PRESETS: Record<string, Partial<ProjectConfig>> = {
  'React + Vite + Tailwind': {
    projectName: 'React Web App',
    repoName: 'react-vite-app',
    primaryLanguage: 'TypeScript',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    buildCommand: 'npm run build',
    gitignoreTemplate: 'Node/React',
    features: [
      '⚡ Ultra-fast HMR and bundle speeds with Vite',
      '💎 Modern React 19 component architecture',
      '🎨 Utility-first styling with Tailwind CSS',
      '📦 Lightweight production build'
    ]
  },
  'Next.js Fullstack': {
    projectName: 'Next.js Modern App',
    repoName: 'nextjs-web-app',
    primaryLanguage: 'TypeScript',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    buildCommand: 'npm run build',
    gitignoreTemplate: 'Next.js',
    features: [
      '🚀 Server Components & Server Actions for maximum speed',
      '🔍 Automatic SEO metadata & OpenGraph optimization',
      '🛡️ API route protection and server validation',
      '🌐 Seamless deployment on Vercel'
    ]
  },
  'Node.js Express API': {
    projectName: 'Express REST API',
    repoName: 'express-rest-api',
    primaryLanguage: 'TypeScript',
    techStack: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL'],
    installCommand: 'npm install',
    runCommand: 'npm run dev',
    buildCommand: 'npm run build',
    gitignoreTemplate: 'Node/React',
    features: [
      '🔌 Clean RESTful API architecture',
      '🛡️ Helmet, CORS, and rate limiting security middleware',
      '📄 Auto-generated Swagger / OpenAPI specs',
      '🧪 Unit and integration testing suite'
    ]
  },
  'Python FastAPI / AI': {
    projectName: 'FastAPI AI Backend',
    repoName: 'fastapi-ai-service',
    primaryLanguage: 'Python',
    techStack: ['Python', 'FastAPI', 'Docker'],
    installCommand: 'pip install -r requirements.txt',
    runCommand: 'uvicorn main:app --reload',
    buildCommand: 'pytest',
    gitignoreTemplate: 'Python',
    features: [
      '⚡ High performance async ASGI server powered by Starlette & Pydantic',
      '📖 Interactive auto-generated OpenAPI docs at /docs',
      '🧠 Native compatibility with LLMs and ML pipelines',
      '🐳 Dockerized multi-stage container build'
    ]
  }
};

export const GITIGNORE_PRESETS: Record<string, string> = {
  'Node/React': `# Dependencies
node_modules/
/.pnp
.pnp.js

# Production build outputs
dist/
build/
out/

# Environment files & secrets (NEVER commit secrets!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor & OS files
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`,

  'Next.js': `# Next.js build
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Env & Secrets
.env*.local
.env
!.env.example

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS & IDE
.DS_Store
.idea/
.vscode/
*.tsbuildinfo
next-env.d.ts`,

  'Python': `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual environments
venv/
env/
ENV/
.venv/

# Environment files
.env
.env.*
!.env.example

# IDE & OS
.idea/
.vscode/
.DS_Store
Thumbs.db
*.log`
};

export const LICENSES: LicenseInfo[] = [
  {
    id: 'MIT',
    name: 'MIT License',
    shortDesc: 'A short, permissive software license. Anyone can do anything with your code as long as they include your copyright.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['Include license & copyright notice in copies'],
    limitations: ['No warranty', 'No liability on the author'],
    popular: true
  },
  {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    shortDesc: 'Permissive license with explicit grant of patent rights and trademark restrictions.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent grant'],
    conditions: ['Include license & copyright', 'State major changes', 'Include NOTICE if present'],
    limitations: ['No warranty', 'No trademark rights', 'No liability'],
    popular: true
  },
  {
    id: 'GPL-3.0',
    name: 'GNU General Public License v3.0',
    shortDesc: 'Strong copyleft license. Modifications must be released under the same open-source license.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent rights'],
    conditions: ['Disclose source code', 'License modifications under GPL-3.0', 'State changes'],
    limitations: ['No warranty', 'No liability'],
    popular: true
  },
  {
    id: 'BSD-3-Clause',
    name: 'BSD 3-Clause "New" or "Revised"',
    shortDesc: 'Permissive license with a clause forbidding endorsement using author names without prior permission.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['Retain copyright notice and disclaimer'],
    limitations: ['No author endorsement without consent', 'No warranty'],
    popular: false
  },
  {
    id: 'Unlicense',
    name: 'The Unlicense',
    shortDesc: 'Dedicates your work directly to the public domain. Anyone can freely use it with zero conditions.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Public domain'],
    conditions: ['None'],
    limitations: ['No warranty', 'No liability'],
    popular: false
  }
];

export const COMMON_GIT_ERRORS: ErrorSolution[] = [
  {
    id: 'remote-exists',
    errorPattern: 'fatal: remote origin already exists.',
    title: 'Remote Origin Already Exists',
    category: 'remote',
    cause: 'Git already has a remote named "origin" saved in this folder from an earlier setup or clone.',
    solutionCommands: [
      '# Option A: Update existing origin to your new repository URL\n' +
      'git remote set-url origin https://github.com/<USERNAME>/<REPO>.git',
      '# Option B: Remove old origin and re-add it\n' +
      'git remote remove origin\ngit remote add origin https://github.com/<USERNAME>/<REPO>.git'
    ],
    explanation: 'You do not need to re-initialize Git. Simply update the URL using `git remote set-url origin <new-url>`.',
    preventativeTip: 'Run `git remote -v` anytime to inspect which remote URL is currently linked.'
  },
  {
    id: 'password-auth-removed',
    errorPattern: 'Support for password authentication was removed. Please use a personal access token instead.',
    title: 'Password Authentication Deprecated',
    category: 'authentication',
    cause: 'GitHub discontinued plain account passwords for git push/clone operations in August 2021.',
    solutionCommands: [
      '# 1. Generate a Personal Access Token (classic):\n# Go to GitHub -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)\n# Select "repo" scope, copy your token (ghp_...)\n\n# 2. When prompted for password in terminal, paste the token!\n\n# 3. Alternatively, store credentials helper so you never type it again:\ngit config --global credential.helper store'
    ],
    explanation: 'GitHub requires either a Personal Access Token (PAT) with "repo" permissions or SSH keys (`git@github.com:...`).',
    preventativeTip: 'Use GitHub CLI (`gh auth login`) to log in via browser with a single command.'
  },
  {
    id: 'push-rejected-pull-first',
    errorPattern: 'error: failed to push some refs to... Updates were rejected because the remote contains work that you do not have locally.',
    title: 'Updates Were Rejected (Remote Contains Work)',
    category: 'merge_conflict',
    cause: 'When creating the repo on GitHub, you checked "Add README" or "Add .gitignore", creating an initial commit on GitHub that your local computer does not have yet.',
    solutionCommands: [
      '# Pull and merge the remote commit into your local branch\ngit pull origin main --rebase\n\n# Then push your code\ngit push -u origin main',
      '# If it warns about unrelated histories:\ngit pull origin main --allow-unrelated-histories\ngit push -u origin main'
    ],
    explanation: 'Remote has commits you lack. Rebasing places your commits on top of the remote commit cleanly.',
    preventativeTip: 'When creating a new repository on GitHub for existing code, leave "Initialize with README" UNCHECKED.'
  },
  {
    id: 'src-refspec-main-not-match',
    errorPattern: 'error: src refspec main does not match any / error: failed to push some refs',
    title: 'Branch Name Mismatch or Empty Commit',
    category: 'branch',
    cause: 'You tried to push to `main`, but either you haven\'t made any commits yet, or your local branch is named `master`.',
    solutionCommands: [
      '# Check your local branch name\ngit branch\n\n# Ensure you have committed files first!\ngit add .\ngit commit -m "feat: initial project setup"\n\n# Rename branch to main\ngit branch -M main\n\n# Push\ngit push -u origin main'
    ],
    explanation: 'Git cannot push if HEAD does not point to an actual commit, or if your local branch name is different.',
    preventativeTip: 'Always run `git add .` followed by `git commit -m "..."` BEFORE running `git push`.'
  },
  {
    id: 'file-size-limit-100mb',
    errorPattern: 'remote: error: File is 120.00 MB; this exceeds GitHub\'s file size limit of 100.00 MB',
    title: 'File Exceeds GitHub 100MB Limit',
    category: 'filesize',
    cause: 'GitHub strictly blocks individual files larger than 100 MB from standard Git commits (e.g., node_modules, huge videos, sqlite files, ML model weights).',
    solutionCommands: [
      '# 1. Unstage the giant file\ngit rm --cached path/to/large-file.zip\n\n# 2. Add the file extension or folder to .gitignore\necho "path/to/large-file.zip" >> .gitignore\n\n# 3. Amend the commit\ngit commit --amend -CHEAD\n\n# 4. If already committed in history, remove with filter-branch or git-filter-repo, or install Git LFS (Large File Storage):\n# git lfs install && git lfs track "*.zip"'
    ],
    explanation: 'Large binaries should either be tracked via Git LFS, stored in cloud storage (S3/GCS), or ignored via `.gitignore`.',
    preventativeTip: 'Always add `node_modules/` and build directories to `.gitignore` before making your first commit!'
  }
];

export const CONVENTIONAL_COMMIT_TYPES = [
  { type: 'feat', title: 'Feature', description: 'A new feature or capability for the user', emoji: '✨' },
  { type: 'fix', title: 'Bug Fix', description: 'A bug fix or patch', emoji: '🐛' },
  { type: 'docs', title: 'Documentation', description: 'Documentation changes only (README, docs)', emoji: '📚' },
  { type: 'style', title: 'Styling', description: 'Changes that do not affect the meaning of the code (whitespace, formatting)', emoji: '💎' },
  { type: 'refactor', title: 'Refactor', description: 'A code change that neither fixes a bug nor adds a feature', emoji: '📦' },
  { type: 'perf', title: 'Performance', description: 'A code change that improves performance', emoji: '⚡' },
  { type: 'test', title: 'Tests', description: 'Adding missing tests or correcting existing tests', emoji: '🚨' },
  { type: 'chore', title: 'Chore', description: 'Updating build tasks, package manager configs, etc.', emoji: '🔧' }
];
