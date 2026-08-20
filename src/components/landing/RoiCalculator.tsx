import React, { useState } from 'react';
import { Calculator, Clock, DollarSign, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';

export const RoiCalculator: React.FC = () => {
  const [dailyLogGb, setDailyLogGb] = useState(250);
  const [microservicesCount, setMicroservicesCount] = useState(18);

  // Calculations
  const hoursSavedPerMonth = Math.round((dailyLogGb * 0.42) + (microservicesCount * 4.5));
  const mttrReductionPercent = 68;
  const costSavingsPerYear = Math.round((dailyLogGb * 140) + (microservicesCount * 2800));

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80 font-mono">
      <div className="glass-panel-glow rounded-3xl p-8 border border-cyan-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Controls Left */}
          <div className="space-y-6 font-sans">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Log Analysis Efficiency Estimator</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Estimate Log Triage & SecOps Workload Reduction
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Adjust your daily log ingestion volume and microservice footprint to estimate potential time savings and log triage efficiency gains with GovLogAI.
            </p>

            {/* Slider 1: Daily Log Volume */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Daily Log Volume Ingestion</span>
                <span className="text-cyan-400 font-bold">{dailyLogGb} GB / Day</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={dailyLogGb}
                onChange={(e) => setDailyLogGb(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50 GB</span>
                <span>500 GB</span>
                <span>2,000 GB</span>
              </div>
            </div>

            {/* Slider 2: Microservices Count */}
            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Protected E-Gov Microservices</span>
                <span className="text-purple-400 font-bold">{microservicesCount} Pods/Nodes</span>
              </div>
              <input
                type="range"
                min="4"
                max="100"
                step="2"
                value={microservicesCount}
                onChange={(e) => setMicroservicesCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>4 Services</span>
                <span>50 Services</span>
                <span>100+ Services</span>
              </div>
            </div>
          </div>

          {/* Results Cards Right */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-slate-900/90 border border-slate-800 text-center p-6">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-cyan-300 font-mono">
                {hoursSavedPerMonth} hrs
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">SecOps Hours Saved / Month</div>
              <div className="text-[10px] text-cyan-400/80 mt-2 font-mono">Automated triage & log search</div>
            </Card>

            <Card className="bg-slate-900/90 border border-slate-800 text-center p-6">
              <ShieldAlert className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {mttrReductionPercent}%
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">Estimated MTTR Reduction</div>
              <div className="text-[10px] text-emerald-400/80 mt-2 font-mono">AI-assisted log classification</div>
            </Card>

            <Card className="bg-slate-900/90 border border-slate-800 text-center p-6 sm:col-span-2">
              <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-4xl font-black text-purple-300 font-mono">
                ${costSavingsPerYear.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">Estimated Annual Operational Savings</div>
              <div className="text-[10px] text-purple-400/80 mt-2 font-mono">
                Log indexing, event deduplication & compressed storage
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
