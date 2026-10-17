import React, { useState } from 'react';
import { Copy, Check, Download, Eye, FileText, Sparkles, ExternalLink, Shield } from 'lucide-react';
import { ProjectConfig } from '../types/project';
import { generateReadme, downloadFile } from '../utils/generators';
import { TECH_BADGES } from '../data/presets';

interface ReadmeEditorProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
}

export const ReadmeEditor: React.FC<ReadmeEditorProps> = ({ config, onUpdateConfig }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [copied, setCopied] = useState(false);

  const markdownContent = generateReadme(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile('README.md', markdownContent, 'text/markdown');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Controls Toolbar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#0d1117] p-1 rounded-xl border border-[#30363d] flex text-xs font-medium">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'visual'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Preview</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 border-l border-[#30363d] pl-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeBadges}
                onChange={e => onUpdateConfig({ includeBadges: e.target.checked })}
                className="rounded border-[#30363d] text-indigo-500 focus:ring-0 bg-[#0d1117]"
              />
              <span>Badges</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeScreenshotsPlaceholder}
                onChange={e => onUpdateConfig({ includeScreenshotsPlaceholder: e.target.checked })}
                className="rounded border-[#30363d] text-indigo-500 focus:ring-0 bg-[#0d1117]"
              />
              <span>Screenshot Mockup</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-xl transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy README'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {viewMode === 'visual' ? (
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 sm:p-10 text-slate-200 shadow-2xl font-sans">
          {/* Header Title */}
          <div className="border-b border-[#30363d] pb-6 mb-8 text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {config.projectName}
            </h1>

            {/* Badges preview */}
            {config.includeBadges && (
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-blue-600/90 text-[11px] font-bold text-white shadow-sm font-mono">
                  REPO SIZE 184 KB
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-amber-500/90 text-[11px] font-bold text-black shadow-sm font-mono">
                  STARS 0
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-emerald-600/90 text-[11px] font-bold text-white shadow-sm font-mono">
                  LICENSE {config.licenseType}
                </span>
              </div>
            )}

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              {config.description}
            </p>

            {config.includeDemoLink && config.demoUrl && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Live Demonstration:</span>
                <a href={config.demoUrl} target="_blank" rel="noreferrer" className="underline font-semibold text-indigo-200 hover:text-white">
                  {config.demoUrl}
                </a>
              </div>
            )}
          </div>

          {/* Tech Stack Icons */}
          {config.techStack.length > 0 && (
            <div className="mb-10 text-center space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Built With
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {config.techStack.map(tech => {
                  const badge = TECH_BADGES[tech];
                  return (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-[#161b22] border border-[#30363d] text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badge?.color || '#58a6ff' }} />
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Screenshot placeholder */}
          {config.includeScreenshotsPlaceholder && (
            <div className="mb-10 rounded-xl border border-[#30363d] bg-[#161b22] p-8 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Project Screenshot / UI Preview</p>
              <p className="text-xs text-slate-500">
                Place an image named <code className="text-indigo-400">preview.png</code> in your repo root or assets folder.
              </p>
            </div>
          )}

          {/* Features */}
          <div className="mb-10 space-y-3">
            <h2 className="text-xl font-bold text-white border-b border-[#30363d] pb-2">
              ✨ Features
            </h2>
            <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
              {config.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>

          {/* Getting Started */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-[#30363d] pb-2">
              🚀 Getting Started
            </h2>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">1. Clone & Setup</h3>
              <pre className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 overflow-x-auto">
{`git clone https://github.com/${config.githubUsername || 'username'}/${config.repoName || 'repo'}.git
cd ${config.repoName || 'repo'}
${config.installCommand}`}
              </pre>

              <h3 className="text-sm font-bold text-slate-200">2. Run Local Development</h3>
              <pre className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 overflow-x-auto">
{config.runCommand}
              </pre>

              <h3 className="text-sm font-bold text-slate-200">3. Build for Production</h3>
              <pre className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 overflow-x-auto">
{config.buildCommand}
              </pre>
            </div>

            {/* License & Maintainer */}
            <div className="pt-6 border-t border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span>Licensed under the <strong>{config.licenseType}</strong> Open Source License.</span>
              <span>Maintained by <strong>{config.authorName || config.githubUsername}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
          <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">README.md</span>
            <span className="text-xs text-slate-500">{markdownContent.length} characters</span>
          </div>
          <textarea
            readOnly
            value={markdownContent}
            rows={24}
            className="w-full p-4 bg-[#0d1117] text-slate-300 font-mono text-xs outline-none resize-y selection:bg-indigo-600 selection:text-white"
          />
        </div>
      )}
    </div>
  );
};
