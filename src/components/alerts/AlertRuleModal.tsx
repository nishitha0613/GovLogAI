import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AlertRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule?: (ruleName: string) => void;
}

export const AlertRuleModal: React.FC<AlertRuleModalProps> = ({ isOpen, onClose, onSaveRule }) => {
  const [ruleName, setRuleName] = useState('');
  const [service, setService] = useState('National Identity Gateway (GovID)');
  const [threshold, setThreshold] = useState('100');
  const [windowSec, setWindowSec] = useState('60');
  const [severity, setSeverity] = useState('P1 Critical');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ruleName.trim()) {
      if (onSaveRule) onSaveRule(ruleName);
      setRuleName('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span>Create New E-Gov Alert Rule</span>
        </div>
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-slate-300 mb-1">Alert Rule Name</label>
          <input
            type="text"
            required
            placeholder="e.g., Detect SQLi Biometric Query Threshold Exceeded"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Target E-Gov Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
          >
            <option>National Identity Gateway (GovID)</option>
            <option>Central Tax & Revenue Gateway</option>
            <option>Border Control & Visa Gateway</option>
            <option>Public Treasury Settlement API</option>
            <option>Land Registry Cadastral DB</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 mb-1">Trigger Threshold (Requests)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Time Window (Seconds)</label>
            <input
              type="number"
              value={windowSec}
              onChange={(e) => setWindowSec(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Alert Severity Rating</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
          >
            <option>P1 Critical</option>
            <option>P2 High</option>
            <option>P3 Medium</option>
            <option>P4 Low</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Save Rule
          </Button>
        </div>
      </form>
    </Modal>
  );
};
