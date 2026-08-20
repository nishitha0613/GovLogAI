import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { EventSeverity, EventStatus } from '../../types/log';
import { EventCorrelationCard } from './EventCorrelationCard';
import { EventFilters } from './EventFilters';
import { EventTable } from './EventTable';
import { EventDetailModal } from './EventDetailModal';

export const EventsPage: React.FC = () => {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<EventSeverity | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'ALL'>('ALL');

  // Filter events
  const filteredEvents = events.filter((evt) => {
    if (selectedSeverity !== 'ALL' && evt.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    if (selectedService !== 'ALL' && evt.affectedService !== selectedService) return false;
    if (selectedStatus !== 'ALL' && evt.status !== selectedStatus) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesTitle = evt.title.toLowerCase().includes(q);
      const matchesIp = evt.threatActorIp.toLowerCase().includes(q);
      const matchesCause = evt.aiRootCause.toLowerCase().includes(q);
      const matchesId = evt.id.toLowerCase().includes(q);
      if (!matchesTitle && !matchesIp && !matchesCause && !matchesId) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Correlation Engine Visual Header */}
      <EventCorrelationCard />

      {/* 2. Search & Filters */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* 3. Classified Events Table */}
      <EventTable events={filteredEvents} />

      {/* 4. Detailed Investigation Panel Modal */}
      <EventDetailModal />
    </div>
  );
};
