import React, { useState } from 'react';
import { Building2, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { AgencyProfileSettings } from './AgencyProfileSettings';
import { AiEngineSettings } from './AiEngineSettings';
import { IngestionSourcesSettings } from './IngestionSourcesSettings';
import { RbacSettings } from './RbacSettings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'ingestion' | 'rbac'>('profile');

  const tabs = [
    { id: 'profile', label: 'Agency Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Anomaly Tuning', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'ingestion', label: 'Log Collectors', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { id: 'rbac', label: 'RBAC & Audit', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {tab.icon}
            <span className="font-sans font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'profile' && <AgencyProfileSettings />}
      {activeTab === 'ai' && <AiEngineSettings />}
      {activeTab === 'ingestion' && <IngestionSourcesSettings />}
      {activeTab === 'rbac' && <RbacSettings />}
    </div>
  );
};
