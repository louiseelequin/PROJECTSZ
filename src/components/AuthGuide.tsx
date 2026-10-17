import React, { useState } from 'react';
import { KeyRound, Shield, Terminal, Copy, Check, ExternalLink, Laptop, Lock } from 'lucide-react';
import { ProjectConfig } from '../types/project';

interface AuthGuideProps {
  config: ProjectConfig;
}

export const AuthGuide: React.FC<AuthGuideProps> = ({ config }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const email = config.authorEmail || 'your-email@example.com';

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-400" />
          <span>GitHub Authentication & Credentials Setup</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          GitHub requires authentication for git push operations. Traditional account passwords are no longer accepted. Choose between <strong>Personal Access Token (PAT)</strong>, <strong>SSH Key</strong> (recommended), or the <strong>GitHub CLI</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Personal Access Token */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Method 1: HTTPS + PAT
              </span>
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>GitHub Tokens Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h3 className="text-base font-bold text-white">
              Create a Personal Access Token (Classic)
            </h3>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Click your profile icon on GitHub → <strong>Settings</strong>.
              </li>
              <li>
                Scroll down the left sidebar and click <strong>Developer Settings</strong>.
              </li>
              <li>
                Select <strong>Personal access tokens</strong> → <strong>Tokens (classic)</strong>.
              </li>
              <li>
                Click <strong>Generate new token (classic)</strong>.
              </li>
              <li>
                Give it a descriptive Note (e.g., <code>Laptop-Terminal</code>) and check the <strong className="text-emerald-400">repo</strong> scope box.
              </li>
              <li>
                Click <strong>Generate token</strong> and copy the token string (starts with <code>ghp_...</code>).
              </li>
              <li>
                When running <code className="text-indigo-300">git push</code>, paste this token when prompted for your Password.
              </li>
            </ol>
          </div>

          <div className="pt-3 border-t border-[#30363d] space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">
              Save token on your computer so it never asks again:
            </span>
            <div className="flex items-center justify-between bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400">
              <code>git config --global credential.helper store</code>
              <button
                onClick={() => copySnippet('git config --global credential.helper store', 'helper')}
                className="text-slate-400 hover:text-white ml-2"
                title="Copy helper command"
              >
                {copiedKey === 'helper' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Method 2: SSH Keys (Best practice) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Method 2: SSH Key (Recommended)
              </span>
              <a
                href="https://github.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <span>GitHub SSH Keys</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h3 className="text-base font-bold text-white">
              Passwordless SSH Key Authentication
            </h3>

            <p className="text-xs text-slate-400">
              Once configured, you will never have to type passwords or tokens again when pushing to GitHub.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">1. Generate modern Ed25519 key:</span>
                <div className="flex items-center justify-between bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 mt-1">
                  <code className="truncate">{`ssh-keygen -t ed25519 -C "${email}"`}</code>
                  <button
                    onClick={() => copySnippet(`ssh-keygen -t ed25519 -C "${email}"`, 'sshgen')}
                    className="text-slate-400 hover:text-white ml-2 shrink-0"
                  >
                    {copiedKey === 'sshgen' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">2. Copy your public key to clipboard:</span>
                <div className="flex items-center justify-between bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 mt-1">
                  <code>cat ~/.ssh/id_ed25519.pub</code>
                  <button
                    onClick={() => copySnippet('cat ~/.ssh/id_ed25519.pub', 'sshcat')}
                    className="text-slate-400 hover:text-white ml-2 shrink-0"
                  >
                    {copiedKey === 'sshcat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">3. Add to GitHub & Test Connection:</span>
                <div className="flex items-center justify-between bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-400 mt-1">
                  <code>ssh -T git@github.com</code>
                  <button
                    onClick={() => copySnippet('ssh -T git@github.com', 'sshtest')}
                    className="text-slate-400 hover:text-white ml-2 shrink-0"
                  >
                    {copiedKey === 'sshtest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#30363d] text-xs text-slate-400">
            Paste the key into <a href="https://github.com/settings/ssh/new" target="_blank" rel="noreferrer" className="text-indigo-300 underline font-medium">GitHub Settings → SSH Keys</a>.
          </div>
        </div>
      </div>

      {/* Method 3: GitHub CLI */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Method 3: Official GitHub CLI (`gh`)
            </span>
            <h3 className="text-sm font-bold text-white pt-1">
              Browser-based single command login
            </h3>
            <p className="text-xs text-slate-400">
              If you have the official GitHub CLI installed (<code className="text-indigo-300">gh</code>), simply run:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#0d1117] px-4 py-2 rounded-xl border border-[#30363d] font-mono text-xs text-purple-300">
              <code>gh auth login</code>
            </div>
            <button
              onClick={() => copySnippet('gh auth login', 'ghauth')}
              className="px-3 py-2 bg-[#21262d] hover:bg-[#30363d] rounded-xl text-xs font-semibold text-slate-200 border border-[#30363d] transition flex items-center gap-1.5"
            >
              {copiedKey === 'ghauth' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ghauth' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
