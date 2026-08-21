import React, { useState } from 'react';
import { Plus, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AlertItem, EventSeverity, AlertStatus } from '../../types/log';
import { AlertSummaryCards } from './AlertSummaryCards';
import { AlertFilters } from './AlertFilters';
import { AlertTable } from './AlertTable';
import { AlertDetailModal } from './AlertDetailModal';
import { AlertRuleModal } from './AlertRuleModal';
import { ResolveBlockIpModal } from './ResolveBlockIpModal';
import { Button } from '../ui/Button';

export const AlertsPage: React.FC = () => {
  const { alerts, events, setSelectedEvent, setCurrentRoute, acknowledgeAlert, investigateAlert, resolveAlert } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<EventSeverity | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [activeTabAlert, setActiveTabAlert] = useState<AlertItem | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  // Filter logic
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && alert.status !== selectedStatus) return false;
    if (selectedService !== 'ALL' && alert.service !== selectedService) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesTitle = alert.title.toLowerCase().includes(q);
      const matchesDesc = alert.description.toLowerCase().includes(q);
      const matchesRule = alert.ruleTriggered.toLowerCase().includes(q);
      const matchesService = alert.service.toLowerCase().includes(q);
      const matchesId = alert.id.toLowerCase().includes(q);

      if (!matchesTitle && !matchesDesc && !matchesRule && !matchesService && !matchesId) {
        return false;
      }
    }

    return true;
  });

  const handleViewEvent = (eventId: string) => {
    const targetEvt = events.find(e => e.id === eventId);
    if (targetEvt) {
      setSelectedEvent(targetEvt);
      setActiveTabAlert(null);
      setCurrentRoute('events');
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Security Alert Triage Workspace
            </h1>
            <p className="text-slate-400 text-xs font-sans">
              Real-time threat detection queue and automated remediation playbooks
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsRuleModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Alert Rule
        </Button>
      </div>

      {/* 1. Summary KPI Cards */}
      <AlertSummaryCards />

      {/* 2. Filters & Search */}
      <AlertFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />

      {/* 3. Alerts Table */}
      <AlertTable
        alerts={filteredAlerts}
        onSelectAlert={(alt) => setActiveTabAlert(alt)}
        onAcknowledge={acknowledgeAlert}
        onResolve={resolveAlert}
      />

      {/* Interactive Detail Modal */}
      <AlertDetailModal
        alert={activeTabAlert}
        onClose={() => setActiveTabAlert(null)}
        onAcknowledge={acknowledgeAlert}
        onInvestigate={investigateAlert}
        onResolve={resolveAlert}
        onViewEvent={handleViewEvent}
      />

      {/* Rule Creation Modal */}
      <AlertRuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
      />

      {/* CRITICAL Event Resolve -> Block IP Prompt Modal */}
      <ResolveBlockIpModal />
    </div>
  );
};
