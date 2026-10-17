import React, { useState } from 'react';
import { Settings, Plus, Trash2, Globe, Shield, Sparkles, Check, Code, ExternalLink } from 'lucide-react';
import { ProjectConfig, Visibility } from '../types/project';
import { TECH_BADGES, TEMPLATE_PRESETS } from '../data/presets';

interface ProjectConfigFormProps {
  config: ProjectConfig;
  onUpdateConfig: (partial: Partial<ProjectConfig>) => void;
  onNavigateTab: (tab: string) => void;
}

export const ProjectConfigForm: React.FC<ProjectConfigFormProps> = ({
  config,
  onUpdateConfig,
  onNavigateTab
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvDesc, setNewEnvDesc] = useState('');
  const [newEnvDefault, setNewEnvDefault] = useState('');

  const handleSlugifyRepo = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
    onUpdateConfig({ repoName: slug });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    onUpdateConfig({
      features: [...config.features, newFeature.trim()]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    onUpdateConfig({
      features: config.features.filter((_, i) => i !== index)
    });
  };

  const toggleTech = (tech: string) => {
    if (config.techStack.includes(tech)) {
      onUpdateConfig({ techStack: config.techStack.filter(t => t !== tech) });
    } else {
      onUpdateConfig({ techStack: [...config.techStack, tech] });
    }
  };

  const handleAddEnv = () => {
    if (!newEnvName.trim()) return;
    onUpdateConfig({
      envVars: [
        ...config.envVars,
        {
          id: Date.now().toString(),
          name: newEnvName.trim().toUpperCase(),
          description: newEnvDesc.trim() || 'Configuration parameter',
          defaultValue: newEnvDefault.trim()
        }
      ]
    });
    setNewEnvName('');
    setNewEnvDesc('');
    setNewEnvDefault('');
  };

  const handleRemoveEnv = (id: string) => {
    onUpdateConfig({
      envVars: config.envVars.filter(ev => ev.id !== id)
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Quick Template Selector */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363d]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              <span>Project & Repository Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure your project metadata. All git commands, scripts, README badges, and licenses update in real time.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Load Preset:</span>
            {Object.entries(TEMPLATE_PRESETS).map(([name, data]) => (
              <button
                key={name}
                onClick={() => onUpdateConfig(data)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-[#21262d] hover:bg-indigo-600 hover:text-white rounded-lg border border-[#30363d] transition"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Core Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Project Display Name
            </label>
            <input
              type="text"
              value={config.projectName}
              onChange={e => {
                onUpdateConfig({ projectName: e.target.value });
                if (!config.repoName || config.repoName === 'my-awesome-project') {
                  handleSlugifyRepo(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition"
              placeholder="e.g. Acme SaaS Platform"
            />
          </div>

          {/* Repository Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              GitHub Repository Name (Slug)
            </label>
            <input
              type="text"
              value={config.repoName}
              onChange={e => handleSlugifyRepo(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-indigo-300 font-mono text-sm outline-none transition"
              placeholder="e.g. acme-saas-platform"
            />
          </div>

          {/* GitHub Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Your GitHub Username or Organization
            </label>
            <input
              type="text"
              value={config.githubUsername}
              onChange={e => onUpdateConfig({ githubUsername: e.target.value, authorGithub: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition"
              placeholder="e.g. octocat"
            />
          </div>

          {/* Visibility & Default Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Repository Visibility
              </label>
              <select
                value={config.visibility}
                onChange={e => onUpdateConfig({ visibility: e.target.value as Visibility })}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition"
              >
                <option value="public">Public (Open Source)</option>
                <option value="private">Private (Restricted)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Default Branch
              </label>
              <select
                value={config.defaultBranch}
                onChange={e => onUpdateConfig({ defaultBranch: e.target.value })}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition font-mono"
              >
                <option value="main">main (Recommended)</option>
                <option value="master">master (Legacy)</option>
              </select>
            </div>
          </div>

          {/* Project Description */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Short Description / GitHub Tagline
            </label>
            <textarea
              rows={2}
              value={config.description}
              onChange={e => onUpdateConfig({ description: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition resize-none"
              placeholder="What does your project do? Provide a compelling 1-2 sentence pitch."
            />
          </div>

          {/* Live Demo URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Live Deployment / Demo URL (Optional)</span>
              <span className="text-[10px] text-slate-400">Added to README</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="url"
                value={config.demoUrl}
                onChange={e => onUpdateConfig({ demoUrl: e.target.value, includeDemoLink: Boolean(e.target.value) })}
                className="w-full pl-9 pr-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition"
                placeholder="https://my-app.vercel.app"
              />
            </div>
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Author / Maintainer Name
            </label>
            <input
              type="text"
              value={config.authorName}
              onChange={e => onUpdateConfig({ authorName: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#0d1117] border border-[#30363d] focus:border-indigo-500 rounded-xl text-white text-sm outline-none transition"
              placeholder="e.g. Jane Doe"
            />
          </div>
        </div>
      </div>

      {/* Tech Stack & Badges Selection */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>Technologies & Frameworks</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Selected badges will automatically be rendered with official Shields.io icons in your README.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(TECH_BADGES).map(([tech, data]) => {
            const isSelected = config.techStack.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:text-slate-200 hover:border-[#484f58]'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: data.color }}
                />
                <span>{tech}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* CLI Run & Build Commands */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Local Development Commands</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-semibold text-slate-300">
              Install Dependencies
            </label>
            <input
              type="text"
              value={config.installCommand}
              onChange={e => onUpdateConfig({ installCommand: e.target.value })}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-emerald-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-semibold text-slate-300">
              Start Dev Server
            </label>
            <input
              type="text"
              value={config.runCommand}
              onChange={e => onUpdateConfig({ runCommand: e.target.value })}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-emerald-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-semibold text-slate-300">
              Production Build
            </label>
            <input
              type="text"
              value={config.buildCommand}
              onChange={e => onUpdateConfig({ buildCommand: e.target.value })}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-emerald-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Key Features List */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Project Key Features</h3>
            <p className="text-xs text-slate-400">Bulleted feature highlights for documentation.</p>
          </div>
        </div>

        <div className="space-y-2">
          {config.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d]">
              <span className="text-xs text-slate-300 flex-1">{feature}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add feature input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
              placeholder="e.g. ⚡ Dark and light theme mode switcher"
              className="flex-1 px-3.5 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Feature</span>
            </button>
          </div>
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigateTab('push')}
          className="px-4 py-2 text-xs font-semibold text-slate-300 bg-[#21262d] hover:bg-[#30363d] rounded-xl border border-[#30363d]"
        >
          ← Back to Push Commands
        </button>
        <button
          onClick={() => onNavigateTab('readme')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-600/30"
        >
          Preview & Customize README.md →
        </button>
      </div>
    </div>
  );
};
