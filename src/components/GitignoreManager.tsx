import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Copy, Check, Download, AlertTriangle, FileCode, Plus, Trash2 } from 'lucide-react';
import { ProjectConfig } from '../types/project';
import { GITIGNORE_PRESETS } from '../data/presets';
import { generateGitignore, downloadFile } from '../utils/generators';

interface GitignoreManagerProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
}

export const GitignoreManager: React.FC<GitignoreManagerProps> = ({ config, onUpdateConfig }) => {
  const [copied, setCopied] = useState(false);
  const [newRule, setNewRule] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ safe: boolean; findings: string[] } | null>(null);

  const gitignoreContent = generateGitignore(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(gitignoreContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile('.gitignore', gitignoreContent, 'text/plain');
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    onUpdateConfig({
      customGitignoreRules: [...config.customGitignoreRules, newRule.trim()]
    });
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    onUpdateConfig({
      customGitignoreRules: config.customGitignoreRules.filter((_, i) => i !== index)
    });
  };

  const runSecurityScan = () => {
    const findings: string[] = [];
    const text = scanInput;

    if (/\.env(?!\.example)/i.test(text)) {
      findings.push('Detected potential ".env" local secret file mentioned. Make sure only ".env.example" is committed.');
    }
    if (/AIza[0-9A-Za-z-_]{35}/.test(text)) {
      findings.push('Found Google / Firebase API Key pattern!');
    }
    if (/ghp_[0-9A-Za-z]{36}/.test(text)) {
      findings.push('Found GitHub Personal Access Token (ghp_...)!');
    }
    if (/sk-[a-zA-Z0-9]{32,}/.test(text)) {
      findings.push('Found OpenAI or API Secret key pattern (sk-...)!');
    }
    if (/-----BEGIN PRIVATE KEY-----/.test(text)) {
      findings.push('Found RSA / SSH Private Key block! Never commit private keys.');
    }
    if (/node_modules\//.test(text) && !text.includes('.gitignore')) {
      findings.push('"node_modules" detected in list. Ensure this folder is explicitly inside .gitignore to prevent 100MB+ push crashes.');
    }

    if (findings.length > 0) {
      setScanResult({ safe: false, findings });
    } else {
      setScanResult({ safe: true, findings: ['No obvious secrets or credentials detected in the scanned text. Clean!'] });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview & Preset Selection */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30363d]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>.gitignore & Secrets Protection</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Prevent committing gigantic dependencies (like 300MB node_modules) and leaking sensitive API keys to public GitHub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Framework Preset:</span>
            <select
              value={config.gitignoreTemplate}
              onChange={e => onUpdateConfig({ gitignoreTemplate: e.target.value })}
              className="px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-xs outline-none focus:border-indigo-500"
            >
              {Object.keys(GITIGNORE_PRESETS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Security Alert Reminder */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0d1117] border border-emerald-500/20 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Node Modules Ignored
            </span>
            <p className="text-[11px] text-slate-400">
              `node_modules/` is excluded by default so you never hit GitHub's 100MB file limit.
            </p>
          </div>

          <div className="bg-[#0d1117] border border-amber-500/20 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> .env Filtered
            </span>
            <p className="text-[11px] text-slate-400">
              Local `.env` and `.env.local` are blocked, keeping only safe `.env.example` templates in git.
            </p>
          </div>

          <div className="bg-[#0d1117] border border-indigo-500/20 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4" /> Build Artifacts
            </span>
            <p className="text-[11px] text-slate-400">
              `dist/`, `.next/`, `build/` and OS files (`.DS_Store`) won't clutter your commits.
            </p>
          </div>
        </div>
      </div>

      {/* Live .gitignore Preview & Custom Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Preview on Left */}
        <div className="lg:col-span-7 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-[#0d1117] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-semibold">.gitignore</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .gitignore</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#0d1117] flex-1">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[380px] scrollbar-thin">
              {gitignoreContent}
            </pre>
          </div>
        </div>

        {/* Right Column: Custom Rules & Secret Scanner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Custom Rules List */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Add Custom Ignore Rules
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddRule()}
                placeholder="e.g. *.sqlite3 or secrets/"
                className="flex-1 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white font-mono outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddRule}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {config.customGitignoreRules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#30363d] text-xs font-mono text-slate-300">
                  <span>{rule}</span>
                  <button
                    onClick={() => handleRemoveRule(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Secret Scanner */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Pre-Push Secret Leak Checker
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste suspicious code lines, config strings, or file names here to verify there are no exposed credentials.
            </p>

            <textarea
              rows={3}
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              placeholder="Paste file paths or config snippets here to test for secret leaks..."
              className="w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-slate-200 font-mono outline-none focus:border-indigo-500 resize-none"
            />

            <button
              onClick={runSecurityScan}
              className="w-full py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-semibold rounded-xl border border-[#30363d] transition"
            >
              Scan For Sensitive Data
            </button>

            {scanResult && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                scanResult.safe
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  {scanResult.safe ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{scanResult.safe ? 'Clean Scan Result' : 'Security Warning!'}</span>
                </div>
                {scanResult.findings.map((f, i) => (
                  <p key={i} className="text-[11px] leading-relaxed">{f}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
