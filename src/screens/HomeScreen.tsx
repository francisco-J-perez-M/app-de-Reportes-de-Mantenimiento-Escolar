import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors, styles } from '../styles';
import { MaintenanceReport, UserSession } from '../types';

interface HomeScreenProps {
  reports: MaintenanceReport[];
  session: UserSession;
  onCreate: () => void;
  onSelect: (report: MaintenanceReport) => void;
  onLogout: () => void;
}

export function statusLabel(status: MaintenanceReport['status']): string {
  if (status === 'in_progress') return 'En proceso';
  if (status === 'resolved') return 'Resuelto';
  return 'Pendiente';
}

export default function HomeScreen({ reports, session, onCreate, onSelect, onLogout }: HomeScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.heading}>Reportes escolares</Text>
            <Text style={styles.subheading}>{session.role === 'admin' ? 'Administrativo' : 'Estudiante'} · {session.email}</Text>
          </View>
          <TouchableOpacity accessibilityRole="button" onPress={onLogout} style={[styles.button, styles.secondaryButton, { minHeight: 40, paddingVertical: 9 }]}>
            <Text style={styles.secondaryButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={onCreate} style={[styles.button, { marginTop: 16 }]}>
          <Text style={styles.buttonText}>+ Registrar reporte</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={styles.content}
        data={reports}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.muted}>Aún no hay reportes registrados.</Text>}
        ListHeaderComponent={<Text style={[styles.heading, { fontSize: 19, marginBottom: 14 }]}>Incidencias recientes</Text>}
        renderItem={({ item }) => {
          const badgeColor = item.status === 'resolved' ? colors.green : item.status === 'in_progress' ? colors.amber : colors.primary;
          return (
            <TouchableOpacity accessibilityRole="button" onPress={() => onSelect(item)} style={[styles.card, styles.row]}>
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={{ width: 68, height: 68, borderRadius: 10, backgroundColor: '#E4ECEF' }} />
              ) : (
                <View style={{ width: 68, height: 68, borderRadius: 10, backgroundColor: '#E4ECEF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 25 }}>📋</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text numberOfLines={1} style={{ color: colors.ink, fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
                <Text style={[styles.muted, { marginTop: 3 }]}>{item.area} · {new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text numberOfLines={1} style={[styles.muted, { fontSize: 12, marginTop: 3 }]}>
                  {item.latitude != null && item.longitude != null
                    ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
                    : item.manualLocation || 'Ubicación no indicada'}
                </Text>
                <Text style={{ color: badgeColor, fontWeight: '700', fontSize: 12, marginTop: 5 }}>{statusLabel(item.status)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
