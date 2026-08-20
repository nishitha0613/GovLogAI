import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AiEngineSettings: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(85);
  const [airGappedLlm, setAirGappedLlm] = useState('GovLogAI-Sovereign-70B-AirGapped');
  const [autoBlockIp, setAutoBlockIp] = useState(true);
  const [autoIsolatePod, setAutoIsolatePod] = useState(true);

  return (
    <Card className="bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            GovLogAI Neural Anomaly Engine Tuning
          </h3>
        </div>
        <Badge variant="purple" size="sm">
          Model: Local Air-Gapped
        </Badge>
      </div>

      <div className="space-y-6 font-mono text-xs">
        {/* Sensitivity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-300">Anomaly Detection Sensitivity Threshold</span>
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
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>50% (Permissive)</span>
            <span>75% (Balanced)</span>
            <span>99% (Paranoid Zero-Trust)</span>
          </div>
        </div>

        {/* Local LLM Selector */}
        <div>
          <label className="block text-slate-300 mb-1">Air-Gapped LLM Inference Provider</label>
          <select
            value={airGappedLlm}
            onChange={(e) => setAirGappedLlm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white"
          >
            <option>GovLogAI-Sovereign-70B-AirGapped (Local On-Prem GPU Cluster)</option>
            <option>GovLogAI-DeepSec-8B (Edge Low-Latency Node)</option>
            <option>Local Llama-3-70B-GovCert Quantized</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-slate-400 uppercase tracking-wider font-bold">
            Autonomous Mitigation Actions:
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="text-slate-200 font-bold">Auto-Block Attack CIDRs on Enterprise WAF</div>
              <div className="text-[10px] text-slate-400">Instantly applies 72h block rule upon P1 SQLi / Brute Force detection.</div>
            </div>
            <input
              type="checkbox"
              checked={autoBlockIp}
              onChange={(e) => setAutoBlockIp(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="text-slate-200 font-bold">Auto-Isolate Compromised Microservice Pods</div>
              <div className="text-[10px] text-slate-400">Quarantines affected Kubernetes pods without downtime via blue-green failover.</div>
            </div>
            <input
              type="checkbox"
              checked={autoIsolatePod}
              onChange={(e) => setAutoIsolatePod(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </Card>
  );
};
