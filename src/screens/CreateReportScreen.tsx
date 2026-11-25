import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, styles } from '../styles';
import { MaintenanceReport, UserSession } from '../types';

const areas = ['Aulas', 'Sanitarios', 'Eléctrico', 'Mobiliario', 'Áreas Verdes'];

interface CreateReportScreenProps {
  session: UserSession;
  onBack: () => void;
  onSave: (report: Omit<MaintenanceReport, 'id' | 'createdAt' | 'status'>) => Promise<void>;
}

type PermissionKind = 'camera' | 'gallery' | 'location';
interface PermissionFeedback {
  kind: PermissionKind;
  message: string;
  openSettings: boolean;
}

export default function CreateReportScreen({ session, onBack, onSave }: CreateReportScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [photoUri, setPhotoUri] = useState<string>();
  const [location, setLocation] = useState<Pick<MaintenanceReport, 'latitude' | 'longitude' | 'accuracy'>>();
  const [manualLocation, setManualLocation] = useState('');
  const [permissionFeedback, setPermissionFeedback] = useState<PermissionFeedback>();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const confirmPermissionUse = (kind: PermissionKind, explanation: string, action: () => Promise<void>) => {
    setPermissionFeedback(undefined);
    Alert.alert('Permiso necesario', explanation, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Continuar', onPress: () => { void action(); } },
    ]);
  };

  const openSettings = () => {
    void Linking.openSettings().catch((settingsError: unknown) => {
      setError(settingsError instanceof Error ? settingsError.message : 'No se pudieron abrir los ajustes del sistema.');
    });
  };

  const handleImagePermission = async (kind: 'camera' | 'gallery') => {
    try {
      const current = kind === 'camera'
        ? await ImagePicker.getCameraPermissionsAsync()
        : await ImagePicker.getMediaLibraryPermissionsAsync();
      const permission = current.granted ? current : kind === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPermissionFeedback({
          kind,
          message: permission.canAskAgain
            ? 'Permiso rechazado. Puedes continuar sin fotografía o intentarlo de nuevo.'
            : 'El permiso está desactivado. Abre Ajustes de Android para habilitarlo.',
          openSettings: !permission.canAskAgain,
        });
        return;
      }
      const result = kind === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch (permissionError) {
      setPermissionFeedback({
        kind,
        message: permissionError instanceof Error ? permissionError.message : 'No fue posible acceder a las fotografías.',
        openSettings: false,
      });
    }
  };

  const handleLocation = async () => {
    try {
      const current = await Location.getForegroundPermissionsAsync();
      const permission = current.granted ? current : await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setPermissionFeedback({
          kind: 'location',
          message: permission.canAskAgain
            ? 'Permiso de ubicación rechazado. Escribe el edificio o aula como ubicación manual.'
            : 'El permiso de ubicación está desactivado. Puedes indicar el lugar manualmente o habilitarlo en Ajustes.',
          openSettings: !permission.canAskAgain,
        });
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setPermissionFeedback({ kind: 'location', message: 'Ubicación obtenida correctamente.', openSettings: false });
    } catch (locationError) {
      setPermissionFeedback({
        kind: 'location',
        message: locationError instanceof Error
          ? `No se pudo obtener la ubicación: ${locationError.message}. Puedes indicar el lugar manualmente.`
          : 'No se pudo obtener la ubicación. Puedes indicar el lugar manualmente.',
        openSettings: false,
      });
    }
  };

  const capture = (kind: 'camera' | 'gallery') => {
    confirmPermissionUse(
      kind,
      kind === 'camera'
        ? 'La cámara solo se usa cuando eliges tomar una fotografía para adjuntarla a este reporte.'
        : 'El acceso a fotografías solo se usa cuando eliges una imagen para adjuntarla a este reporte.',
      () => handleImagePermission(kind),
    );
  };

  const locate = () => confirmPermissionUse(
    'location',
    'La ubicación se consulta solo para adjuntarla a este reporte mientras usas la aplicación. No se realiza seguimiento en segundo plano.',
    handleLocation,
  );

  const submit = async () => {
    if (title.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres.');
      return;
    }
    if (description.trim().length < 5) {
      setError('La descripción debe tener al menos 5 caracteres.');
      return;
    }
    if (!area) {
      setError('Selecciona el área escolar del reporte.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        area,
        photoUri,
        ...location,
        manualLocation: manualLocation.trim() || undefined,
        createdBy: session.email,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el reporte.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Nuevo reporte</Text>
      <Text style={styles.subheading}>Describe la incidencia para facilitar su atención.</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput maxLength={100} onChangeText={setTitle} placeholder="Ej. Fuga de agua en el pasillo" style={styles.input} value={title} />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        multiline
        maxLength={1000}
        onChangeText={setDescription}
        placeholder="Describe qué ocurre y desde cuándo..."
        style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
        value={description}
      />

      <Text style={styles.label}>Área escolar</Text>
      <View style={[styles.row, { flexWrap: 'wrap', gap: 8 }]}>
        {areas.map((item) => (
          <TouchableOpacity key={item} onPress={() => setArea(item)} style={[styles.button, styles.secondaryButton, { minHeight: 40, paddingVertical: 9, backgroundColor: area === item ? '#DCEFF4' : colors.white }]}>
            <Text style={styles.secondaryButtonText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fotografía (opcional)</Text>
      <TouchableOpacity onPress={() => capture('camera')} style={[styles.button, styles.secondaryButton, { marginTop: 8 }]}>
        <Text style={styles.secondaryButtonText}>Tomar Foto (Cámara)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => capture('gallery')} style={[styles.button, styles.secondaryButton, { marginTop: 8 }]}>
        <Text style={styles.secondaryButtonText}>Elegir de Galería</Text>
      </TouchableOpacity>
      {photoUri ? <Image source={{ uri: photoUri }} style={{ height: 190, borderRadius: 12, marginTop: 12 }} resizeMode="cover" /> : null}

      <Text style={styles.label}>Ubicación GPS (opcional)</Text>
      <TouchableOpacity onPress={locate} style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryButtonText}>Obtener ubicación GPS</Text>
      </TouchableOpacity>
      {location && <Text style={[styles.muted, { marginTop: 8 }]}>Lat. {location.latitude?.toFixed(6)}, long. {location.longitude?.toFixed(6)} · precisión {location.accuracy == null ? 'N/D' : `${Math.round(location.accuracy)} m`}</Text>}
      <Text style={styles.muted}>Si no autorizas el GPS, puedes escribir el lugar manualmente.</Text>
      <TextInput maxLength={120} onChangeText={setManualLocation} placeholder="Edificio, piso, aula o referencia" style={[styles.input, { marginTop: 9 }]} value={manualLocation} />
      {permissionFeedback && (
        <View>
          <Text style={[styles.muted, { marginTop: 10 }]}>{permissionFeedback.message}</Text>
          {permissionFeedback.openSettings && (
            <TouchableOpacity onPress={openSettings} style={[styles.button, styles.secondaryButton, { marginTop: 8 }]}>
              <Text style={styles.secondaryButtonText}>Abrir Ajustes</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <TouchableOpacity disabled={saving} onPress={submit} style={[styles.button, { marginTop: 22 }]}>
        <Text style={styles.buttonText}>{saving ? 'Guardando...' : 'Enviar reporte'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={[styles.button, styles.secondaryButton, { marginTop: 12 }]}>
        <Text style={styles.secondaryButtonText}>‹ Volver a reportes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
