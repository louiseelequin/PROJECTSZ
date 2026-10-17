import React, { useState } from 'react';
import { Scale, Check, Copy, Download, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { ProjectConfig, LicenseId } from '../types/project';
import { LICENSES } from '../data/presets';
import { generateLicense, downloadFile } from '../utils/generators';

interface LicenseManagerProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
}

export const LicenseManager: React.FC<LicenseManagerProps> = ({ config, onUpdateConfig }) => {
  const [copied, setCopied] = useState(false);

  const activeLicenseInfo = LICENSES.find(l => l.id === config.licenseType) || LICENSES[0];
  const licenseText = generateLicense(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile('LICENSE', licenseText, 'text/plain');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Description */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <span>Open Source License Selector</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          An open-source license informs everyone what they can and cannot do with your GitHub code. Without a license, default copyright laws apply, meaning nobody has permission to reproduce or modify your work.
        </p>

        {/* License Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
          {LICENSES.map(lic => {
            const isSelected = config.licenseType === lic.id;
            return (
              <button
                key={lic.id}
                type="button"
                onClick={() => onUpdateConfig({ licenseType: lic.id })}
                className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-[#0d1117] border-[#30363d] hover:border-[#484f58]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-white">{lic.name}</span>
                    {lic.popular && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-3">
                    {lic.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#21262d] flex items-center justify-between text-xs">
                  <span className={`font-medium ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {isSelected ? 'Selected License' : 'Click to Select'}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected License Breakdown & Generated Legal Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Breakdown Card */}
        <div className="lg:col-span-5 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{activeLicenseInfo.name} Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Plain-English legal permissions and limits.</p>
          </div>

          {/* Permissions */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
              Allowed Permissions
            </span>
            <div className="space-y-1">
              {activeLicenseInfo.permissions.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
              Required Conditions
            </span>
            <div className="space-y-1">
              {activeLicenseInfo.conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-rose-400 tracking-wider">
              Limitations & Liability
            </span>
            <div className="space-y-1">
              {activeLicenseInfo.limitations.map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Generated LICENSE Text */}
        <div className="lg:col-span-7 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-[#0d1117] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-white font-semibold">LICENSE</span>
              <span className="text-slate-500 font-sans">({config.licenseType})</span>
            </div>
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
                className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition font-medium shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download LICENSE</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-[#0d1117] flex-1">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[350px] scrollbar-thin whitespace-pre-wrap">
              {licenseText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
