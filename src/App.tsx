import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickPushSection } from './components/QuickPushSection';
import { ProjectConfigForm } from './components/ProjectConfigForm';
import { ReadmeEditor } from './components/ReadmeEditor';
import { GitignoreManager } from './components/GitignoreManager';
import { LicenseManager } from './components/LicenseManager';
import { CommitCrafter } from './components/CommitCrafter';
import { GitDoctor } from './components/GitDoctor';
import { AuthGuide } from './components/AuthGuide';
import { DEFAULT_CONFIG } from './data/presets';
import { ProjectConfig } from './types/project';
import { Github, Sparkles, Terminal, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ProjectConfig>(() => {
    try {
      const saved = localStorage.getItem('gitlaunch_config');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('push');

  useEffect(() => {
    try {
      localStorage.setItem('gitlaunch_config', JSON.stringify(config));
    } catch (e) {
      // ignore
    }
  }, [config]);

  const handleUpdateConfig = (partial: Partial<ProjectConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        config={config}
        onUpdateConfig={handleUpdateConfig}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'push' && (
          <QuickPushSection
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'config' && (
          <ProjectConfigForm
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'readme' && (
          <ReadmeEditor
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activeTab === 'gitignore' && (
          <GitignoreManager
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activeTab === 'license' && (
          <LicenseManager
            config={config}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {activeTab === 'commit' && (
          <CommitCrafter />
        )}

        {activeTab === 'doctor' && (
          <GitDoctor config={config} />
        )}

        {activeTab === 'auth' && (
          <AuthGuide config={config} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#161b22] py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-white">GitLaunch</span>
            <span className="text-slate-500">—</span>
            <span>Your complete toolkit for launching projects on GitHub</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('doctor')}
              className="hover:text-slate-200 transition"
            >
              Fix Common Errors
            </button>
            <button
              onClick={() => setActiveTab('auth')}
              className="hover:text-slate-200 transition"
            >
              Authentication Guide
            </button>
            <a
              href="https://docs.github.com/en/get-started"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-200 flex items-center gap-1 transition"
            >
              <span>GitHub Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
