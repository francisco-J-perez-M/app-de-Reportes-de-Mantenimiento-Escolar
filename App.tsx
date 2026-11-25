import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, View } from 'react-native';
import CreateReportScreen from './src/screens/CreateReportScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ReportDetailScreen from './src/screens/ReportDetailScreen';
import { reportService } from './src/services/reportService';
import { colors } from './src/styles';
import { MaintenanceReport, ReportStatus, UserSession } from './src/types';

type Screen = 'home' | 'create' | 'detail';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>();
  const [screen, setScreen] = useState<Screen>('home');
  const [loading, setLoading] = useState(true);

  const loadReports = async () => setReports(await reportService.getReports());

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const [savedSession, savedReports] = await Promise.all([
          reportService.getSession(),
          reportService.getReports(),
        ]);
        if (active) {
          setSession(savedSession);
          setReports(savedReports);
        }
      } catch (error) {
        console.error('[app] No se pudieron cargar los datos locales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos guardados en el dispositivo.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void bootstrap();
    return () => { active = false; };
  }, []);

  const selectedReport = reports.find((report) => report.id === selectedReportId);

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  if (!session) return <LoginScreen onLogin={setSession} />;
  if (screen === 'create') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <CreateReportScreen
          onBack={() => setScreen('home')}
          onSave={async (input) => {
            await reportService.createReport(input);
            await loadReports();
            setScreen('home');
          }}
          session={session}
        />
      </>
    );
  }
  if (screen === 'detail' && selectedReport) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ReportDetailScreen
          onBack={() => setScreen('home')}
          onUpdateStatus={async (status: ReportStatus) => {
            setReports(await reportService.updateReportStatus(selectedReport.id, status));
          }}
          report={selectedReport}
          session={session}
        />
      </>
    );
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <HomeScreen
        onCreate={() => setScreen('create')}
        onLogout={async () => {
          try {
            await reportService.logout();
            setSession(null);
            setScreen('home');
          } catch (error) {
            console.error('[auth] No se pudo cerrar la sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
          }
        }}
        onSelect={(report) => {
          setSelectedReportId(report.id);
          setScreen('detail');
        }}
        reports={reports}
        session={session}
      />
    </>
  );
}
