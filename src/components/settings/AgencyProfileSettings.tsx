import React, { useState } from 'react';
import { Building2, Save, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AgencyProfileSettings: React.FC = () => {
  const [agencyName, setAgencyName] = useState('Ministry of Digital Governance & Cyber Defense');
  const [classification, setClassification] = useState('Secret / Sovereign Air-Gapped');
  const [contactEmail, setContactEmail] = useState('secops-lead@cyberdefense.gov.internal');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Building2 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
          Government Agency Profile & Classification Tier
        </h3>
      </div>

      <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Security Classification Tier</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
            >
              <option>Unclassified / Public Service</option>
              <option>Secret / Sovereign Air-Gapped</option>
              <option>Top Secret / Critical Infrastructure</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 mb-1">SecOps Incident Response Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit" icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}>
            {saved ? 'Settings Saved ✓' : 'Save Agency Profile'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
