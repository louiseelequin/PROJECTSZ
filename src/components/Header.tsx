import React from 'react';
import { Github, Sparkles, Download, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { ProjectConfig } from '../types/project';
import { TEMPLATE_PRESETS } from '../data/presets';
import { downloadFile, generateReadme, generateGitignore, generateLicense, generateBashScript, generateBatScript } from '../utils/generators';

interface HeaderProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onUpdateConfig,
  activeTab,
  onSelectTab
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadAll = () => {
    setDownloading(true);
    // Download primary files
    downloadFile('README.md', generateReadme(config), 'text/markdown');
    setTimeout(() => {
      downloadFile('.gitignore', generateGitignore(config), 'text/plain');
    }, 200);
    setTimeout(() => {
      downloadFile('LICENSE', generateLicense(config), 'text/plain');
    }, 400);
    setTimeout(() => {
      downloadFile('push-to-github.sh', generateBashScript(config), 'text/x-sh');
    }, 600);
    setTimeout(() => {
      downloadFile('push-to-github.bat', generateBatScript(config), 'text/plain');
      setDownloading(false);
    }, 800);
  };

  const applyPreset = (presetName: string) => {
    const preset = TEMPLATE_PRESETS[presetName];
    if (preset) {
      onUpdateConfig(preset);
    }
  };

  return (
    <header className="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-[10px] flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">GitLaunch</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Push
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                GitHub Repository Prep & Push Command Generator
              </p>
            </div>
          </div>

          {/* Quick Preset Selector & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center bg-[#0d1117] rounded-lg border border-[#30363d] p-1 text-xs">
              <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
              </span>
              {Object.keys(TEMPLATE_PRESETS).map(name => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-[#21262d] rounded transition text-xs font-medium"
                >
                  {name.split(' ')[0]}
                </button>
              ))}
            </div>

            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition"
              title="Open GitHub in a new tab to create the empty repo"
            >
              <span>Create Repo on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-lg transition shadow-sm shadow-emerald-900/50"
              title="Download README.md, .gitignore, LICENSE, and push scripts"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Export All Files'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
          {[
            { id: 'push', label: '🚀 Push Commands & Terminal', badge: 'Main' },
            { id: 'config', label: '⚙️ Project Config' },
            { id: 'readme', label: '📝 README Architect' },
            { id: 'gitignore', label: '🛡️ .gitignore & Secrets' },
            { id: 'license', label: '⚖️ License Selector' },
            { id: 'commit', label: '💬 Commit Crafter' },
            { id: 'doctor', label: '🩺 Git Error Doctor', badge: 'Help' },
            { id: 'auth', label: '🔑 Auth & Token Setup' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 font-medium rounded-md whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'text-white bg-[#21262d] border-b-2 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b22]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
