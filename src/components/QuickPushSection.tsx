import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, RotateCcw, Download, Sparkles, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectConfig, RemoteMethod } from '../types/project';
import { generateGitCommands, getRepositoryUrl, generateBashScript, generateBatScript, downloadFile } from '../utils/generators';

interface QuickPushSectionProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
  onNavigateTab: (tab: string) => void;
}

export const QuickPushSection: React.FC<QuickPushSectionProps> = ({
  config,
  onUpdateConfig,
  onNavigateTab
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const commands = generateGitCommands(config);
  const repoUrl = getRepositoryUrl(config, config.remoteMethod);

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const allCommandsText = commands.map(c => c.command).join('\n');

  // Terminal Simulator Player
  const startSimulation = () => {
    setIsSimulating(true);
    setIsCompleted(false);
    setSimulationStep(0);
    setSimulationLogs(['$ Welcome to Git Simulator. Preparing repository pipeline...']);

    let current = 0;
    const interval = setInterval(() => {
      if (current < commands.length) {
        const cmd = commands[current];
        setSimulationStep(current + 1);
        setSimulationLogs(prev => [
          ...prev,
          `\n$ ${cmd.command}`,
          ...cmd.simulatedOutput.filter(Boolean)
        ]);
        current++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setIsCompleted(true);
        setSimulationLogs(prev => [
          ...prev,
          '\n✨ SUCCESS! 🚀 Repository pushed to GitHub successfully!',
          `Repository URL: https://github.com/${config.githubUsername || 'username'}/${config.repoName || 'repo'}`
        ]);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }
    }, 850);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setIsCompleted(false);
    setSimulationStep(0);
    setSimulationLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Target Repo Banner */}
      <div className="bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Destination Repository
              </span>
              <span className="text-xs text-slate-400">
                Branch: <code className="text-emerald-400 bg-[#0d1117] px-1.5 py-0.5 rounded font-mono">{config.defaultBranch}</code>
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-slate-400">{config.githubUsername || 'your-username'}</span>
              <span className="text-slate-600">/</span>
              <span className="text-indigo-300">{config.repoName || 'my-project'}</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono truncate max-w-xl">
              {repoUrl}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Protocol Selector */}
            <div className="bg-[#0d1117] p-1 rounded-xl border border-[#30363d] flex text-xs font-medium">
              {(['https', 'ssh', 'gh-cli'] as RemoteMethod[]).map(method => (
                <button
                  key={method}
                  onClick={() => onUpdateConfig({ remoteMethod: method })}
                  className={`px-3 py-1.5 rounded-lg transition uppercase ${
                    config.remoteMethod === method
                      ? 'bg-indigo-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {method === 'gh-cli' ? 'GitHub CLI' : method.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('config')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-xl transition"
            >
              Edit Repo Info
            </button>
          </div>
        </div>
      </div>

      {/* Critical Note for First-Time Pushers */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-300">
            Important rule when creating the repo on GitHub:
          </p>
          <p>
            When you create your repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="underline font-medium text-amber-200 hover:text-white">github.com/new</a>, do <strong>NOT</strong> check "Add a README file", "Add .gitignore", or choose a license there if you have local code. Keep it completely empty so Git can push smoothly without merge conflicts!
          </p>
        </div>
      </div>

      {/* Main Grid: Steps on Left, Simulator & One-Click on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sequenced Commands */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Execute in your terminal (Root Directory)</span>
            </h3>
            <button
              onClick={() => copyToClipboard(allCommandsText)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'All Copied!' : 'Copy All Commands'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {commands.map((cmd, idx) => (
              <div
                key={cmd.id}
                className="bg-[#161b22] border border-[#30363d] hover:border-[#484f58] rounded-xl p-4 transition group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#21262d] border border-[#30363d] text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {cmd.stepNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      {cmd.title}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cmd.command, idx)}
                    className="opacity-80 group-hover:opacity-100 flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-[#21262d] hover:bg-[#30363d] rounded border border-[#30363d] transition"
                    title="Copy this command"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs text-emerald-400 border border-[#21262d] flex items-center justify-between overflow-x-auto">
                  <code>{cmd.command}</code>
                </div>

                <p className="mt-2 text-[11px] text-slate-400 leading-normal">
                  {cmd.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Script Download */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-white">Prefer a 1-Click Script?</h4>
              <p className="text-[11px] text-slate-400">
                Download a script to place in your project folder and run automatically.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => downloadFile('push-to-github.sh', generateBashScript(config), 'text/x-sh')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>push.sh (Mac/Linux)</span>
              </button>
              <button
                onClick={() => downloadFile('push-to-github.bat', generateBatScript(config), 'text/plain')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>push.bat (Windows)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Simulator & Checklist */}
        <div className="lg:col-span-5 space-y-4">
          {/* Terminal Simulator */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl flex flex-col h-[420px]">
            {/* Terminal Header */}
            <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">bash ~ /project-root</span>
              </div>
              <div className="flex items-center gap-2">
                {!isSimulating ? (
                  <button
                    onClick={startSimulation}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded transition"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Run</span>
                  </button>
                ) : (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-mono animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Running...
                  </span>
                )}
                {simulationLogs.length > 0 && !isSimulating && (
                  <button
                    onClick={resetSimulation}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded"
                    title="Clear terminal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Content Screen */}
            <div className="p-4 bg-[#0d1117] flex-1 font-mono text-xs text-slate-300 overflow-y-auto space-y-1 select-text">
              {simulationLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600" />
                  <p className="text-slate-400 font-medium">Terminal Simulator Idle</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Click <strong>"Test Run"</strong> to simulate the complete sequence of Git commands before running them in your local terminal.
                  </p>
                </div>
              ) : (
                simulationLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.startsWith('$')
                        ? 'text-indigo-400 font-bold'
                        : log.includes('SUCCESS')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('error')
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Simulation Progress Footer */}
            {isSimulating && (
              <div className="bg-[#1c2128] px-4 py-2 border-t border-[#30363d] flex items-center justify-between text-xs text-slate-400">
                <span>Progress: Step {simulationStep} of {commands.length}</span>
                <div className="w-32 bg-[#0d1117] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${(simulationStep / commands.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            {isCompleted && (
              <div className="bg-emerald-950/30 px-4 py-2 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ready! Now run these commands in your project.
                </span>
              </div>
            )}
          </div>

          {/* Pre-Push Sanity Checklist */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Pre-Push Checklist</span>
              <span className="text-[10px] text-emerald-400 font-normal">All clear</span>
            </h4>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>.gitignore</strong> excludes <code className="text-indigo-300">node_modules/</code> & build artifacts
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Secrets protected</strong>: No real API keys or tokens in code (use <code className="text-indigo-300">.env.example</code>)
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Professional README</strong> ready to impress recruiters and stars
                </span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Open Source License</strong> attached ({config.licenseType})
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-[#30363d] flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('doctor')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>Having Git errors during push? View fixes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
