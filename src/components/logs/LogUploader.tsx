import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, Play, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { parseAndClassifyLogFile, type ParsedAnalysisResult } from '../../utils/logParser';

interface LogUploaderProps {
  onAnalysisComplete: (result: ParsedAnalysisResult) => void;
}

export const LogUploader: React.FC<LogUploaderProps> = ({ onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [presetName, setPresetName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleTraces: Record<string, string> = {
    'tax_portal_access.log': `[2026-08-20 14:26:38] POST /api/v3/tax/submit-annual-return status=500 source_ip=10.240.12.89 db_pool=exhausted msg="Database connection pool 100% capacity starvation"
[2026-08-20 14:26:39] GET /api/v3/tax/filings status=200 source_ip=10.240.12.90 msg="Tax filing summary query executed"
[2026-08-20 14:26:40] POST /api/v3/tax/calculate status=500 source_ip=10.240.12.91 msg="Unindexed query timeout after 2400ms"
[2026-08-20 14:26:41] GET /api/v3/tax/health status=200 source_ip=10.240.12.1 msg="K8s readiness probe healthy"`,

    'border_biometrics.csv': `timestamp,service,method,endpoint,status,source_ip,message
2026-08-20T14:26:45.102Z,Border Gateway,POST,/api/v2/visa/verify-passport,403,185.220.101.44,"CRITICAL: SQL Injection attempt UNION SELECT biometric_hash endpoint=/api/v2/visa/verify-passport source_ip=185.220.101.44"
2026-08-20T14:26:46.001Z,Border Gateway,POST,/api/v2/biometrics/match-iris,503,10.250.0.12,"FATAL: HSM key vault lost socket connection endpoint=/api/v2/biometrics/match-iris source_ip=10.250.0.12"
2026-08-20T14:26:47.412Z,Border Gateway,GET,/api/v2/visa/status,200,10.250.0.1,"INFO: Passport lookup successful source_ip=10.250.0.1"`,

    'treasury_audit.txt': `[14:26:28] [CRITICAL] [Public Treasury Settlement API] POST /api/v1/treasury/authorize-disbursement - 401 (62ms) source_ip=45.154.255.89 msg="Privilege escalation attempt with alg: none JWT header endpoint=/api/v1/treasury/authorize-disbursement source_ip=45.154.255.89"
[14:26:29] [INFO] [Public Treasury Settlement API] GET /api/v1/treasury/audit-trail - 200 (18ms) source_ip=10.128.0.4 msg="Authorized procurement auditor log query source_ip=10.128.0.4"`
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPresetName('');
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPresetName('');
      readFile(file);
    }
  };

  const handleLoadSample = (sampleName: string) => {
    setPresetName(sampleName);
    setSelectedFile(null);
    setFileContent(sampleTraces[sampleName] || '');
  };

  const handleStartAnalysis = () => {
    const name = selectedFile ? selectedFile.name : presetName || 'sovereign_egov_cluster.log';
    const size = selectedFile ? selectedFile.size : (fileContent.length || 2048);
    const content = fileContent || sampleTraces['tax_portal_access.log'];

    setIsProcessing(true);
    setCurrentStep(1);
    setProgressPercent(15);

    // Simulate pipeline progression visually
    let step = 1;
    const interval = setInterval(() => {
      step += 1;
      if (step <= 6) {
        setCurrentStep(step);
        setProgressPercent(Math.round((step / 6) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          const result = parseAndClassifyLogFile(content, name, size);
          onAnalysisComplete(result);
        }, 500);
      }
    }, 450);
  };

  const activeName = selectedFile ? selectedFile.name : presetName || '';
  const fileSizeDisplay = selectedFile 
    ? `${(selectedFile.size / 1024).toFixed(1)} KB` 
    : fileContent 
    ? `${(fileContent.length / 1024).toFixed(1)} KB` 
    : '';

  const pipelineStages = [
    { name: '1. Ingestion', text: 'Reading uploaded raw file payload into memory...' },
    { name: '2. Parsing', text: 'Extracting timestamps, IPs, endpoints & status codes...' },
    { name: '3. Classification', text: 'Rule-based categorization (Authentication, API, DB, Network)...' },
    { name: '4. Severity', text: 'Evaluating anomaly score (0-100%) and risk rating...' },
    { name: '5. Event Grouping', text: 'Synthesizing correlated multi-log event groups...' },
    { name: '6. Insights', text: 'Generating AI analysis summary & recommended playbooks...' },
  ];

  return (
    <Card className="glass-panel-glow border border-cyan-500/30 p-6 bg-slate-900/90 font-mono text-xs">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wide">
              <Upload className="w-4 h-4" />
              <span>Sovereign Server Log Upload & Analysis Engine (Prototype)</span>
            </div>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Upload `.log`, `.txt`, or `.csv` files to trigger real-time in-browser parsing, classification & event grouping.
            </p>
          </div>

          {/* Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500">Sample Presets:</span>
            <button
              onClick={() => handleLoadSample('tax_portal_access.log')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                presetName === 'tax_portal_access.log'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Tax Gateway Log
            </button>
            <button
              onClick={() => handleLoadSample('border_biometrics.csv')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                presetName === 'border_biometrics.csv'
                  ? 'bg-rose-950 text-rose-300 border-rose-700 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Border Biometrics CSV
            </button>
            <button
              onClick={() => handleLoadSample('treasury_audit.txt')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                presetName === 'treasury_audit.txt'
                  ? 'bg-purple-950 text-purple-300 border-purple-700 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Treasury Audit TXT
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
              : activeName
              ? 'border-emerald-500/60 bg-emerald-950/20'
              : 'border-slate-800 hover:border-cyan-500/40 bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>

            {activeName ? (
              <div className="space-y-1">
                <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> {activeName} ({fileSizeDisplay}) Ready for Analysis
                </div>
                <div className="text-slate-400 text-xs">Click or drag another file to replace</div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  Drag & drop server log files here, or <span className="text-cyan-400 underline">browse</span>
                </div>
                <div className="text-slate-400 text-xs">Supports .log, .txt, and .csv files</div>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Logs Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-slate-400 text-xs">
            {activeName ? `Selected File: ${activeName} (${fileSizeDisplay})` : 'Select or load a log file above to trigger parsing'}
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={!activeName || isProcessing}
            onClick={handleStartAnalysis}
            icon={isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          >
            {isProcessing ? 'Processing Pipeline...' : 'Analyze Logs'}
          </Button>
        </div>

        {/* Processing Pipeline Animated Stepper Bar */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                Pipeline Stage: {pipelineStages[currentStep - 1]?.name}
              </span>
              <span className="text-slate-300 font-bold">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400">
              {pipelineStages[currentStep - 1]?.text}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
