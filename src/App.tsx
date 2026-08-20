import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { LogsPage } from './components/logs/LogsPage';
import { SecurityAlertsPage } from './components/alerts/SecurityAlertsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsPage } from './components/settings/SettingsPage';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  switch (currentRoute) {
    case 'landing':
      return <LandingPage />;
    case 'logs':
      return <LogsPage />;
    case 'security-alerts':
    case 'events':
    case 'alerts':
      return <SecurityAlertsPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <LogsPage />;
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
