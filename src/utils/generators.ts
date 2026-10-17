import { ProjectConfig, GitCommand, RemoteMethod } from '../types/project';
import { TECH_BADGES, GITIGNORE_PRESETS } from '../data/presets';

export function getRepositoryUrl(config: ProjectConfig, method: RemoteMethod = config.remoteMethod): string {
  const username = config.githubUsername.trim() || 'your-username';
  const repo = config.repoName.trim() || 'my-project';

  if (method === 'ssh') {
    return `git@github.com:${username}/${repo}.git`;
  }
  return `https://github.com/${username}/${repo}.git`;
}

export function generateGitCommands(config: ProjectConfig): GitCommand[] {
  const url = getRepositoryUrl(config, config.remoteMethod);
  const branch = config.defaultBranch || 'main';
  const repo = config.repoName || 'my-project';

  if (config.remoteMethod === 'gh-cli') {
    return [
      {
        id: 'gh-auth',
        stepNumber: 1,
        title: 'Login with GitHub CLI (one time)',
        command: 'gh auth login',
        explanation: 'Authenticates your terminal with GitHub interactively via browser token or SSH.',
        simulatedOutput: [
          '? What account do you want to log into? GitHub.com',
          '? What is your preferred protocol for Git operations? HTTPS',
          '? Authenticate Git with your GitHub credentials? Yes',
          '? How would you like to authenticate GitHub CLI? Login with a web browser',
          '✓ Authentication complete. Logged in as ' + (config.githubUsername || 'developer')
        ]
      },
      {
        id: 'gh-create',
        stepNumber: 2,
        title: 'Create and Push in One Single Command',
        command: `gh repo create ${repo} --${config.visibility} --source=. --remote=origin --push`,
        explanation: 'GitHub CLI will automatically create the remote repository on your account, link it, and push your commits in one step!',
        simulatedOutput: [
          `✓ Created repository ${config.githubUsername || 'developer'}/${repo} on GitHub`,
          `✓ Added remote https://github.com/${config.githubUsername || 'developer'}/${repo}.git`,
          `Enumerating objects: 42, done.`,
          `Counting objects: 100% (42/42), done.`,
          `Writing objects: 100% (42/42), 18.42 KiB | 3.68 MiB/s, done.`,
          `Total 42 (delta 8), reused 0 (delta 0)`,
          `To https://github.com/${config.githubUsername || 'developer'}/${repo}.git`,
          ` * [new branch]      HEAD -> ${branch}`,
          `Branch '${branch}' set up to track remote branch '${branch}' from 'origin'.`
        ]
      }
    ];
  }

  return [
    {
      id: 'init',
      stepNumber: 1,
      title: 'Initialize local Git repository',
      command: 'git init',
      explanation: 'Initializes a new Git tracking repository in your project directory (creates the hidden .git directory).',
      simulatedOutput: ['Initialized empty Git repository in /workspace/' + repo + '/.git/']
    },
    {
      id: 'stage',
      stepNumber: 2,
      title: 'Stage all files (respecting .gitignore)',
      command: 'git add .',
      explanation: 'Adds all modified, new, and deleted files to the Git staging index, except files ignored by .gitignore.',
      simulatedOutput: ['']
    },
    {
      id: 'commit',
      stepNumber: 3,
      title: 'Create your first initial commit',
      command: 'git commit -m "feat: initial commit of ' + (config.projectName || 'project') + '"',
      explanation: 'Takes a permanent snapshot of all staged files with an informative description.',
      simulatedOutput: [
        `[main (root-commit) 8fa24b9] feat: initial commit of ${config.projectName || 'project'}`,
        ' 24 files changed, 1420 insertions(+)',
        ' create mode 100644 .gitignore',
        ' create mode 100644 README.md',
        ' create mode 100644 package.json',
        ' create mode 100644 src/App.tsx'
      ]
    },
    {
      id: 'branch',
      stepNumber: 4,
      title: 'Rename main branch (standard default)',
      command: `git branch -M ${branch}`,
      explanation: 'Renames the current default branch to standard "main" (modern GitHub standard over legacy "master").',
      simulatedOutput: ['']
    },
    {
      id: 'remote',
      stepNumber: 5,
      title: 'Connect local repo to your GitHub remote',
      command: `git remote add origin ${url}`,
      explanation: 'Points your local repository to the repository created under your GitHub account.',
      simulatedOutput: ['']
    },
    {
      id: 'push',
      stepNumber: 6,
      title: 'Push code and link upstream tracking',
      command: `git push -u origin ${branch}`,
      explanation: 'Uploads all local commits to GitHub and flags origin/' + branch + ' as the default upstream remote.',
      simulatedOutput: [
        'Enumerating objects: 28, done.',
        'Counting objects: 100% (28/28), done.',
        'Compressing objects: 100% (22/22), done.',
        'Writing objects: 100% (28/28), 16.48 KiB | 5.49 MiB/s, done.',
        'Total 28 (delta 5), reused 0 (delta 0)',
        'remote: Resolving deltas: 100% (5/5), done.',
        `To ${url}`,
        ` * [new branch]      ${branch} -> ${branch}`,
        `Branch '${branch}' set up to track remote branch '${branch}' from 'origin'.`
      ]
    }
  ];
}

export function generateReadme(config: ProjectConfig): string {
  const username = config.githubUsername.trim() || 'username';
  const repo = config.repoName.trim() || 'project';
  const year = new Date().getFullYear();

  let badgesMarkdown = '';
  if (config.includeBadges) {
    badgesMarkdown = `
<!-- BADGES -->
<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/${username}/${repo}?style=for-the-badge&color=blue)
![GitHub stars](https://img.shields.io/github/stars/${username}/${repo}?style=for-the-badge&color=gold)
![GitHub forks](https://img.shields.io/github/forks/${username}/${repo}?style=for-the-badge&color=silver)
![GitHub license](https://img.shields.io/badge/license-${config.licenseType}-green?style=for-the-badge)

</div>
`;
  }

  // Tech stack badges
  let techBadgesStr = '';
  if (config.techStack && config.techStack.length > 0) {
    const list = config.techStack.map(tech => {
      const b = TECH_BADGES[tech];
      if (b) {
        return `![${tech}](${b.badge})`;
      }
      return `\`${tech}\``;
    });
    techBadgesStr = `\n### 🛠️ Built With\n\n<div align="center">\n\n${list.join(' ')}\n\n</div>\n`;
  }

  // Demo link
  let demoSection = '';
  if (config.includeDemoLink && config.demoUrl) {
    demoSection = `\n> 🌐 **Live Demo:** [${config.demoUrl}](${config.demoUrl})\n`;
  }

  // Features
  let featuresSection = '';
  if (config.features && config.features.length > 0) {
    featuresSection = `\n## ✨ Features\n\n${config.features.map(f => `- ${f}`).join('\n')}\n`;
  }

  // Env vars
  let envSection = '';
  if (config.envVars && config.envVars.length > 0) {
    const rows = config.envVars
      .map(ev => `| \`${ev.name}\` | ${ev.description} | \`${ev.defaultValue || '-'}\` |`)
      .join('\n');

    envSection = `\n## 🔐 Environment Variables\n\nTo run this project, you will need to add the following environment variables to your \`.env\` file:\n\n| Variable | Description | Default / Example |\n| :--- | :--- | :--- |\n${rows}\n`;
  }

  // Screenshots placeholder
  let screenshotSection = '';
  if (config.includeScreenshotsPlaceholder) {
    screenshotSection = `\n## 📸 Screenshots & Preview\n\n<p align="center">\n  <img src="https://raw.githubusercontent.com/${username}/${repo}/main/preview.png" alt="Application Screenshot" width="850" />\n</p>\n`;
  }

  return `# ${config.projectName}

${badgesMarkdown}

<p align="center">
  <strong>${config.description}</strong>
</p>

${demoSection}
${techBadgesStr}
${screenshotSection}
${featuresSection}

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [Git](https://git-scm.com/)

### 📦 Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/${username}/${repo}.git
   \`\`\`

2. **Navigate into the directory:**
   \`\`\`bash
   cd ${repo}
   \`\`\`

3. **Install project dependencies:**
   \`\`\`bash
   ${config.installCommand}
   \`\`\`
${envSection}
### 💻 Running the Application

Start the local development server:

\`\`\`bash
${config.runCommand}
\`\`\`

Open [http://localhost:3000](http://localhost:3000) (or specified port) with your browser to view the application.

### 🏗️ Production Build

To build the application for production:

\`\`\`bash
${config.buildCommand}
\`\`\`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project (\`Fork\` button on GitHub)
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'feat: add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **${config.licenseType} License**. See \`LICENSE\` for more information.

---

## 👤 Author

**${config.authorName || 'Developer'}**
- GitHub: [@${config.authorGithub || username}](https://github.com/${config.authorGithub || username})
${config.authorEmail ? `- Email: ${config.authorEmail}` : ''}

<div align="center">
  <sub>Built with ❤️ and pushed using <a href="https://github.com">GitLaunch</a>.</sub>
</div>
`;
}

export function generateGitignore(config: ProjectConfig): string {
  const basePreset = GITIGNORE_PRESETS[config.gitignoreTemplate] || GITIGNORE_PRESETS['Node/React'];
  let extra = '';

  if (config.customGitignoreRules && config.customGitignoreRules.length > 0) {
    extra = `\n\n# Custom project additions\n` + config.customGitignoreRules.join('\n');
  }

  return basePreset + extra;
}

export function generateLicense(config: ProjectConfig): string {
  const year = new Date().getFullYear();
  const author = config.authorName || config.githubUsername || 'The Project Author';

  switch (config.licenseType) {
    case 'MIT':
      return `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

    case 'Apache-2.0':
      return `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright ${year} ${author}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`;

    case 'BSD-3-Clause':
      return `BSD 3-Clause License

Copyright (c) ${year}, ${author}
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`;

    case 'Unlicense':
      return `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`;

    case 'GPL-3.0':
      return `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) ${year} ${author}

Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`;

    default:
      return `# All rights reserved.\n# Copyright (c) ${year} ${author}`;
  }
}

export function generateBashScript(config: ProjectConfig): string {
  const url = getRepositoryUrl(config, config.remoteMethod);
  const branch = config.defaultBranch || 'main';

  return `#!/usr/bin/env bash
# GitLaunch Auto-Push Script for ${config.projectName}
# Run this inside your project folder: chmod +x push.sh && ./push.sh

set -e

echo "🚀 Starting GitLaunch Repository Setup for ${config.projectName}..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed or not in your PATH."
    exit 1
fi

# Initialize if not a git repo
if [ ! -d ".git" ]; then
    echo "📦 Initializing local git repository..."
    git init
else
    echo "ℹ️  Git repository already initialized."
fi

# Stage files
echo "📝 Staging files (respecting .gitignore)..."
git add .

# Commit files if there are changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "ℹ️  No changes to commit."
else
    echo "💾 Creating commit..."
    git commit -m "feat: initial commit of ${config.projectName}"
fi

# Set default branch
echo "🌿 Setting default branch to ${branch}..."
git branch -M ${branch}

# Configure remote origin
if git remote | grep -q "^origin$"; then
    echo "🔄 Updating existing remote 'origin' to ${url}..."
    git remote set-url origin "${url}"
else
    echo "🔗 Adding remote 'origin' ${url}..."
    git remote add origin "${url}"
fi

# Push
echo "⬆️ Pushing commits to GitHub..."
git push -u origin ${branch}

echo ""
echo "🎉 SUCCESS! Your project has been published to:"
echo "   https://github.com/${config.githubUsername || 'username'}/${config.repoName || 'repo'}"
`;
}

export function generateBatScript(config: ProjectConfig): string {
  const url = getRepositoryUrl(config, config.remoteMethod);
  const branch = config.defaultBranch || 'main';

  return `@echo off
REM GitLaunch Auto-Push Script for Windows (CMD / PowerShell)
title GitLaunch - Pushing ${config.projectName}

echo ========================================================
echo   GitLaunch Auto-Push Script for ${config.projectName}
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

if not exist ".git" (
    echo [*] Initializing Git repository...
    git init
) else (
    echo [*] Git repository already present.
)

echo [*] Staging files...
git add .

echo [*] Committing files...
git commit -m "feat: initial commit of ${config.projectName}"

echo [*] Setting branch name to ${branch}...
git branch -M ${branch}

git remote get-url origin >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Updating remote origin URL...
    git remote set-url origin "${url}"
) else (
    echo [*] Adding remote origin...
    git remote add origin "${url}"
)

echo [*] Pushing to GitHub...
git push -u origin ${branch}

echo.
echo ========================================================
echo   SUCCESS! Pushed to GitHub!
echo   https://github.com/${config.githubUsername}/${config.repoName}
echo ========================================================
pause
`;
}

export function downloadFile(filename: string, content: string, contentType = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
