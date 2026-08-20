import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { LogLevel, LogEntry } from '../../types/log';
import type { ParsedAnalysisResult } from '../../utils/logParser';
import { LogUploader } from './LogUploader';
import { LogAnalysisSummary } from './LogAnalysisSummary';
import { RawLogTerminal } from './RawLogTerminal';
import { LogFilters } from './LogFilters';
import { LogTable } from './LogTable';
import { AiLogInspector } from './AiLogInspector';

export const LogsPage: React.FC = () => {
  const { searchQuery, analysisResult, setAnalysisResult } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedStatusCode, setSelectedStatusCode] = useState<string>('ALL');

  const handleAnalysisComplete = (result: ParsedAnalysisResult) => {
    // Save to central shared AppContext dataset & metrics
    setAnalysisResult(result);
  };

  const activeLogsToFilter: LogEntry[] = analysisResult ? analysisResult.logs : [];

  // Filter logic
  const filteredLogs = activeLogsToFilter.filter((log) => {
    // Level match
    if (selectedLevel !== 'ALL' && log.level !== selectedLevel) return false;

    // Service match
    if (selectedService !== 'ALL' && log.service !== selectedService) return false;

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesMsg = log.message.toLowerCase().includes(q);
      const matchesEndpoint = log.endpoint.toLowerCase().includes(q);
      const matchesIp = log.ipAddress.includes(q);
      const matchesLevel = log.level.toLowerCase() === q;
      const matchesStatus = log.statusCode.toString() === q;
      const matchesService = log.service.toLowerCase().includes(q);

      if (!matchesMsg && !matchesEndpoint && !matchesIp && !matchesLevel && !matchesStatus && !matchesService) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-5">
      {/* 1. Log Upload & Pipeline Stepper Section */}
      <LogUploader onAnalysisComplete={handleAnalysisComplete} />

      {/* 2. AI Analysis Summary KPI Cards */}
      <LogAnalysisSummary
        fileName={analysisResult ? `${analysisResult.fileName} (${analysisResult.fileSizeFormatted})` : 'No log file loaded'}
        totalLogs={analysisResult ? analysisResult.totalLogs : 0}
        errorCount={analysisResult ? analysisResult.errorCount : 0}
        criticalCount={analysisResult ? analysisResult.criticalCount : 0}
        eventGroupsCount={analysisResult ? analysisResult.eventGroupsCount : 0}
        confidenceRating={analysisResult ? analysisResult.confidenceRating : 'N/A'}
        isCustomFile={!!analysisResult}
      />

      {/* 3. Raw Log Terminal Buffer Viewer */}
      <RawLogTerminal
        customLogs={activeLogsToFilter}
        customRawText={analysisResult?.rawText}
      />

      {/* 4. Filters & Classified Logs Table */}
      <div className="space-y-4">
        <LogFilters
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedStatusCode={selectedStatusCode}
          setSelectedStatusCode={setSelectedStatusCode}
          availableServices={analysisResult ? Array.from(new Set(analysisResult.logs.map(l => l.service))) : []}
        />
        <LogTable logs={filteredLogs} hasProcessedLogs={!!analysisResult} />
      </div>

      {/* Interactive AI Inspector Side Drawer */}
      <AiLogInspector />
    </div>
  );
};
