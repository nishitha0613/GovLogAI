import React, { useState } from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AiEngineSettings: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(85);
  const [airGappedLlm, setAirGappedLlm] = useState('GovLogAI-IsolationForest-ML-Engine');
  const [autoBlockIp, setAutoBlockIp] = useState(true);
  const [localIocFeedEnabled, setLocalIocFeedEnabled] = useState(true);

  return (
    <div className="space-y-4 font-mono text-xs">
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wide">
              GovLogAI ML Anomaly & Threat Engine Tuning
            </h3>
          </div>
          <Badge variant="purple" size="sm">
            Air-Gapped Sovereign Node
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Sensitivity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-sans font-medium">Statistical Anomaly Z-Score Threshold</span>
              <span className="text-cyan-400 font-bold">{sensitivity}% (Strict)</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50% (Permissive)</span>
              <span>75% (Balanced)</span>
              <span>99% (Paranoid Zero-Trust)</span>
            </div>
          </div>

          {/* Local ML Provider */}
          <div>
            <label className="block text-slate-300 mb-1 font-sans">ML Anomaly Detection Algorithm</label>
            <select
              value={airGappedLlm}
              onChange={(e) => setAirGappedLlm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
            >
              <option value="GovLogAI-IsolationForest-ML-Engine">Isolation Forest + Z-Score Hybrid ML Engine (Client-Side WASM)</option>
              <option value="GovLogAI-Local-FastAPI">Local Modular Python FastAPI Backend (/backend/app/main.py)</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="text-slate-400 uppercase tracking-wider font-bold font-sans">
              Autonomous Mitigation & Threat Feed Controls:
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <div className="text-slate-200 font-bold font-sans">Local IoC Threat Intelligence Feed Correlation</div>
                <div className="text-[10px] text-slate-400">Correlate extracted IP addresses against local Tor exit nodes & scanner threat lists.</div>
              </div>
              <input
                type="checkbox"
                checked={localIocFeedEnabled}
                onChange={(e) => setLocalIocFeedEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <div className="text-slate-200 font-bold font-sans">Auto-Block Attack IPs on Enterprise WAF</div>
                <div className="text-[10px] text-slate-400">Generates 72h WAF block rule upon P1 SQLi or Credential Stuffing detection.</div>
              </div>
              <input
                type="checkbox"
                checked={autoBlockIp}
                onChange={(e) => setAutoBlockIp(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </Card>

      {/* Zero-Config Deployment Script Card */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
              Zero-Config Deployment Script (deploy.sh)
            </h3>
          </div>
          <Badge variant="success" size="sm">
            Ubuntu Ready
          </Badge>
        </div>

        <p className="text-slate-300 font-sans text-xs">
          Deploy GovLogAI instantly on any air-gapped or on-premise Ubuntu server using the zero-config setup script:
        </p>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
          <code>$ bash deploy.sh</code>
        </div>
      </Card>
    </div>
  );
};
