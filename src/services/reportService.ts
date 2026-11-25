import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaintenanceReport, ReportStatus, UserSession } from '../types';

const SESSION_KEY = '@school-reports/session';
const REPORTS_KEY = '@school-reports/reports';
const SIMULATED_LATENCY_MS = 400;

const TEST_USERS: Record<string, { password: string; role: UserSession['role'] }> = {
  'alumno@utvt.edu.mx': { password: '123456', role: 'student' },
  'admin@utvt.edu.mx': { password: '123456', role: 'admin' },
};

const waitForSimulatedNetwork = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function createSampleReports(): MaintenanceReport[] {
  const now = Date.now();
  return [
    {
      id: 'sample-1',
      title: 'Filtración de agua en el techo',
      description: 'Se observa humedad y goteo cerca de las ventanas.',
      area: 'Aulas',
      createdAt: new Date(now - 86_400_000).toISOString(),
      manualLocation: 'Edificio A, aula 204',
      status: 'pending',
      createdBy: 'alumno@utvt.edu.mx',
    },
    {
      id: 'sample-2',
      title: 'Luminaria fundida',
      description: 'La lámpara del pasillo no enciende.',
      area: 'Eléctrico',
      createdAt: new Date(now - 172_800_000).toISOString(),
      manualLocation: 'Edificio B, segundo piso',
      status: 'in_progress',
      createdBy: 'alumno@utvt.edu.mx',
    },
  ];
}

export const reportService = {
  async login(email: string, password: string): Promise<UserSession> {
    await waitForSimulatedNetwork();
    const normalizedEmail = email.trim().toLowerCase();
    const credentials = TEST_USERS[normalizedEmail];
    if (!credentials || credentials.password !== password) {
      console.warn('[auth] Intento de inicio de sesión rechazado:', normalizedEmail);
      throw new Error('Correo o contraseña incorrectos.');
    }
    const session = { email: normalizedEmail, role: credentials.role };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.info('[auth] Inicio de sesión correcto:', normalizedEmail, credentials.role);
    return session;
  },

  async getSession(): Promise<UserSession | null> {
    await waitForSimulatedNetwork();
    const stored = await AsyncStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as UserSession) : null;
  },

  async logout(): Promise<void> {
    await waitForSimulatedNetwork();
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async getReports(): Promise<MaintenanceReport[]> {
    await waitForSimulatedNetwork();
    const stored = await AsyncStorage.getItem(REPORTS_KEY);
    if (stored) return JSON.parse(stored) as MaintenanceReport[];
    const initialReports = createSampleReports();
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(initialReports));
    return initialReports;
  },

  async createReport(
    input: Omit<MaintenanceReport, 'id' | 'createdAt' | 'status'>,
  ): Promise<MaintenanceReport> {
    await waitForSimulatedNetwork();
    const reports = await this.readReportsWithoutLatency();
    const report: MaintenanceReport = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify([report, ...reports]));
    return report;
  },

  async updateReportStatus(id: string, status: ReportStatus): Promise<MaintenanceReport[]> {
    await waitForSimulatedNetwork();
    const reports = await this.readReportsWithoutLatency();
    const updated = reports.map((report) =>
      report.id === id ? { ...report, status } : report,
    );
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    return updated;
  },

  async readReportsWithoutLatency(): Promise<MaintenanceReport[]> {
    const stored = await AsyncStorage.getItem(REPORTS_KEY);
    return stored ? (JSON.parse(stored) as MaintenanceReport[]) : createSampleReports();
  },
};
