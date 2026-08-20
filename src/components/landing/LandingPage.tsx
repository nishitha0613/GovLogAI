import React from 'react';
import { HeroSection } from './HeroSection';
import { PipelineSection } from './PipelineSection';
import { WhyGovLogAI } from './WhyGovLogAI';
import { DashboardPreview } from './DashboardPreview';
import { LiveLogTeaser } from './LiveLogTeaser';
import { RoiCalculator } from './RoiCalculator';
import { UseCases } from './UseCases';
import { ComplianceBadges } from './ComplianceBadges';
import { CtaSection } from './CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <HeroSection />
      <PipelineSection />
      <WhyGovLogAI />
      <DashboardPreview />
      <LiveLogTeaser />
      <RoiCalculator />
      <UseCases />
      <ComplianceBadges />
      <CtaSection />
    </div>
  );
};
