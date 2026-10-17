import React, { useState } from 'react';
import { Stethoscope, Search, Copy, Check, AlertTriangle, Terminal, HelpCircle } from 'lucide-react';
import { COMMON_GIT_ERRORS } from '../data/presets';
import { ProjectConfig } from '../types/project';

interface GitDoctorProps {
  config: ProjectConfig;
}

export const GitDoctor: React.FC<GitDoctorProps> = ({ config }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredErrors = COMMON_GIT_ERRORS.filter(err => {
    const q = searchQuery.toLowerCase();
    return (
      err.title.toLowerCase().includes(q) ||
      err.errorPattern.toLowerCase().includes(q) ||
      err.cause.toLowerCase().includes(q) ||
      err.category.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string, id: string) => {
    // Replace <USERNAME> and <REPO> with user config if present
    const personalized = text
      .replace(/<USERNAME>/g, config.githubUsername || 'your-username')
      .replace(/<REPO>/g, config.repoName || 'your-repo');
    navigator.clipboard.writeText(personalized);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-rose-400" />
              <span>Git & GitHub Error Doctor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Encountered a red error message in your terminal during upload? Find the diagnosis and copy the exact fix.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search error message..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Solutions list */}
      <div className="space-y-4">
        {filteredErrors.length === 0 ? (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-500" />
            <p className="font-semibold text-white">No matching errors found</p>
            <p className="text-xs">Try searching for keywords like "password", "origin", "rejected", or "limit".</p>
          </div>
        ) : (
          filteredErrors.map(err => {
            return (
              <div
                key={err.id}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4 shadow-sm"
              >
                {/* Error Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {err.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{err.title}</h3>
                    </div>
                    <code className="text-[11px] font-mono text-rose-300/90 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/30 inline-block">
                      {err.errorPattern}
                    </code>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-xs text-slate-300 leading-relaxed bg-[#0d1117]/60 p-3 rounded-xl border border-[#21262d]">
                  <p className="font-medium text-slate-200 mb-1">💡 What causes this:</p>
                  <p className="text-slate-400">{err.cause}</p>
                </div>

                {/* Solution Commands */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resolution Command(s)</span>
                    </span>
                    <button
                      onClick={() => handleCopy(err.solutionCommands.join('\n\n'), err.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition"
                    >
                      {copiedId === err.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Fix</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-[#0d1117] rounded-xl font-mono text-xs text-emerald-400 border border-[#21262d] whitespace-pre-wrap">
                    {err.solutionCommands.map(cmd =>
                      cmd
                        .replace(/<USERNAME>/g, config.githubUsername || 'your-username')
                        .replace(/<REPO>/g, config.repoName || 'your-repo')
                    ).join('\n\n')}
                  </div>
                </div>

                {/* Preventative tip */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-indigo-400">Pro-Tip:</span>
                  <span>{err.preventativeTip}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
