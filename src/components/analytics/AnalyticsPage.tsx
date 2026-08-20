import React, { useState } from 'react';
import { AnalyticsFilterBar } from './AnalyticsFilterBar';
import { VolumeAndCategoryCharts } from './VolumeAndCategoryCharts';
import { SeverityAndServiceStats } from './SeverityAndServiceStats';
import { TrendsAndMttrSection } from './TrendsAndMttrSection';
import { AiGeneratedInsightsSection } from './AiGeneratedInsightsSection';
import { LatencyHeatmap } from './LatencyHeatmap';
import { PredictiveForecasting } from './PredictiveForecasting';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  return (
    <div className="space-y-5">
      {/* 1. Date Range & Filter Controls */}
      <AnalyticsFilterBar
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
      />

      {/* 2. Log Volume Over Time & Category Breakdown */}
      <VolumeAndCategoryCharts />

      {/* 3. Severity Distribution & Service-Wise Error/Incident Statistics */}
      <SeverityAndServiceStats />

      {/* 4. Critical Incident Trends, MTTR Benchmarks & Recurring Issues */}
      <TrendsAndMttrSection />

      {/* 5. AI-Generated Insights Section */}
      <AiGeneratedInsightsSection />

      {/* 6. Latency Percentiles & AI Predictive Forecast Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LatencyHeatmap />
        <PredictiveForecasting />
      </div>
    </div>
  );
};
