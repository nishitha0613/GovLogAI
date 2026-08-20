import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { LogsPage } from './components/logs/LogsPage';
import { EventsPage } from './components/events/EventsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsPage } from './components/settings/SettingsPage';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  switch (currentRoute) {
    case 'landing':
      return <LandingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'logs':
      return <LogsPage />;
    case 'events':
      return <EventsPage />;
    case 'alerts':
      return <AlertsPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

export function App() {
  return (
    <AppProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </AppProvider>
  );
}

export default App;
