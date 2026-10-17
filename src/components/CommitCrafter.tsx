import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { CONVENTIONAL_COMMIT_TYPES } from '../data/presets';

export const CommitCrafter: React.FC = () => {
  const [commitType, setCommitType] = useState('feat');
  const [scope, setScope] = useState('initial');
  const [description, setDescription] = useState('initial project release with full UI and documentation');
  const [isBreaking, setIsBreaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedMessage = `${commitType}${scope.trim() ? `(${scope.trim()})` : ''}${isBreaking ? '!' : ''}: ${description.trim() || 'update'}`;
  const fullGitCommand = `git commit -m "${formattedMessage}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullGitCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyCommitPreset = (t: string, s: string, d: string) => {
    setCommitType(t);
    setScope(s);
    setDescription(d);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Conventional Commit Message Crafter</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardize your Git history according to the industry Conventional Commits specification.
          </p>
        </div>

        {/* Quick Presets for First Push */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30363d]">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          <button
            onClick={() => applyCommitPreset('feat', 'project', 'initial project release with responsive UI')}
            className="px-2.5 py-1 text-xs bg-[#0d1117] hover:bg-[#21262d] text-slate-300 rounded-lg border border-[#30363d] transition"
          >
            ✨ Initial Project
          </button>
          <button
            onClick={() => applyCommitPreset('docs', 'readme', 'add comprehensive setup guide and Shields badges')}
            className="px-2.5 py-1 text-xs bg-[#0d1117] hover:bg-[#21262d] text-slate-300 rounded-lg border border-[#30363d] transition"
          >
            📚 Docs & README
          </button>
          <button
            onClick={() => applyCommitPreset('chore', 'config', 'configure .gitignore and project dependencies')}
            className="px-2.5 py-1 text-xs bg-[#0d1117] hover:bg-[#21262d] text-slate-300 rounded-lg border border-[#30363d] transition"
          >
            🔧 Setup & .gitignore
          </button>
        </div>

        {/* Commit Type Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            1. Select Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONVENTIONAL_COMMIT_TYPES.map(t => (
              <button
                key={t.type}
                type="button"
                onClick={() => setCommitType(t.type)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  commitType === t.type
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                    : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:text-slate-200 hover:border-[#484f58]'
                }`}
              >
                <span className="text-sm">{t.emoji}</span>
                <div>
                  <div className="text-xs font-bold font-mono text-white">{t.type}</div>
                  <div className="text-[10px] text-slate-400 truncate">{t.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scope and Description Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              2. Scope (Optional)
            </label>
            <input
              type="text"
              value={scope}
              onChange={e => setScope(e.target.value)}
              placeholder="e.g. auth, api, ui, nav"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-xs outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              3. Description (Imperative, short)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. add user sign in modal and validations"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Breaking change checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="breaking"
            checked={isBreaking}
            onChange={e => setIsBreaking(e.target.checked)}
            className="rounded border-[#30363d] text-rose-500 focus:ring-0 bg-[#0d1117]"
          />
          <label htmlFor="breaking" className="text-xs text-slate-300 cursor-pointer">
            Mark as Breaking Change (adds <code className="text-rose-400 font-mono">!</code> flag)
          </label>
        </div>

        {/* Output Command Preview */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ready-To-Run Command</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Command'}</span>
            </button>
          </div>

          <div className="p-3 bg-[#161b22] rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-[#21262d]">
            <code>{fullGitCommand}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
