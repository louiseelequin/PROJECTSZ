export type Visibility = 'public' | 'private';
export type RemoteMethod = 'https' | 'ssh' | 'gh-cli';
export type LicenseId = 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'Unlicense' | 'None';

export interface EnvVarItem {
  id: string;
  name: string;
  description: string;
  defaultValue: string;
}

export interface ProjectConfig {
  projectName: string;
  repoName: string;
  githubUsername: string;
  description: string;
  visibility: Visibility;
  defaultBranch: string;
  authorName: string;
  authorEmail: string;
  authorGithub: string;
  remoteMethod: RemoteMethod;
  primaryLanguage: string;
  techStack: string[];
  features: string[];
  installCommand: string;
  runCommand: string;
  buildCommand: string;
  envVars: EnvVarItem[];
  licenseType: LicenseId;
  gitignoreTemplate: string;
  customGitignoreRules: string[];
  includeBadges: boolean;
  includeDemoLink: boolean;
  demoUrl: string;
  includeScreenshotsPlaceholder: boolean;
  hasSecretsExposed: boolean;
}

export interface GitCommand {
  id: string;
  stepNumber: number;
  title: string;
  command: string;
  explanation: string;
  isOptional?: boolean;
  simulatedOutput: string[];
}

export interface LicenseInfo {
  id: LicenseId;
  name: string;
  shortDesc: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  popular: boolean;
}

export interface ErrorSolution {
  id: string;
  errorPattern: string;
  title: string;
  category: 'authentication' | 'merge_conflict' | 'remote' | 'filesize' | 'branch';
  cause: string;
  solutionCommands: string[];
  explanation: string;
  preventativeTip: string;
}
