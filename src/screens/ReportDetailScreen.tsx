import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors, styles } from '../styles';
import { MaintenanceReport, ReportStatus, UserSession } from '../types';
import { statusLabel } from './HomeScreen';

interface ReportDetailScreenProps {
  report: MaintenanceReport;
  session: UserSession;
  onBack: () => void;
  onUpdateStatus: (status: ReportStatus) => Promise<void>;
}

const statusOptions: ReportStatus[] = ['pending', 'in_progress', 'resolved'];

export default function ReportDetailScreen({ report, session, onBack, onUpdateStatus }: ReportDetailScreenProps) {
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState('');

  const updateStatus = async (status: ReportStatus) => {
    setSavingStatus(true);
    setError('');
    try {
      await onUpdateStatus(status);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar el estado.');
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { flexGrow: 1 }]}>
      <Text style={styles.heading}>{report.title}</Text>
      <Text style={styles.subheading}>{report.area} · {new Date(report.createdAt).toLocaleString()}</Text>
      {report.photoUri ? <Image source={{ uri: report.photoUri }} style={{ width: '100%', height: 230, borderRadius: 14, marginTop: 18, backgroundColor: '#E4ECEF' }} resizeMode="cover" /> : null}
      <View style={[styles.card, { marginTop: 18 }]}>
        <Text style={[styles.label, { marginTop: 0 }]}>Descripción</Text>
        <Text style={styles.muted}>{report.description}</Text>
        <Text style={styles.label}>Ubicación</Text>
        <Text style={styles.muted}>
          {report.latitude != null && report.longitude != null
            ? `Latitud ${report.latitude}, longitud ${report.longitude}${report.accuracy == null ? '' : ` · precisión ${Math.round(report.accuracy)} m`}`
            : report.manualLocation || 'Sin ubicación proporcionada'}
        </Text>
        <Text style={styles.label}>Estado</Text>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>{statusLabel(report.status)}</Text>
        <Text style={[styles.muted, { marginTop: 9 }]}>Registrado por {report.createdBy}</Text>
      </View>
      {session.role === 'admin' && (
        <View style={styles.card}>
          <Text style={[styles.label, { marginTop: 0 }]}>Actualizar estado (administrativo)</Text>
          {statusOptions.map((status) => (
            <TouchableOpacity
              accessibilityRole="button"
              disabled={savingStatus || report.status === status}
              key={status}
              onPress={() => updateStatus(status)}
              style={[styles.button, styles.secondaryButton, { marginTop: 8, opacity: report.status === status ? 0.55 : 1 }]}
            >
              <Text style={styles.secondaryButtonText}>{statusLabel(status)}</Text>
            </TouchableOpacity>
          ))}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
      <TouchableOpacity onPress={onBack} style={[styles.button, styles.secondaryButton, { marginTop: 'auto', marginBottom: 12 }]}>
        <Text style={styles.secondaryButtonText}>‹ Volver a reportes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
