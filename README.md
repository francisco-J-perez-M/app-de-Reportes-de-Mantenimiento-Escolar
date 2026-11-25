# Reportes de Mantenimiento Escolar
App Android con Expo SDK 58 y TypeScript. Los reportes y la sesión se persisten localmente con AsyncStorage; no se conecta a servicios externos. La capa modular `src/services/reportService.ts` simula 400 ms de latencia y permite reemplazar el almacenamiento por un backend posteriormente.

## Desarrollo
    npm install
    npm start
    npx tsc --noEmit
    npx expo-doctor

## Cuentas de prueba
- Estudiante: `alumno@utvt.edu.mx` / `123456`
- Administrativo: `admin@utvt.edu.mx` / `123456`

## EAS Build Android

Configura EAS para una cuenta propia y conserva de forma segura las credenciales de firma:

    npx eas-cli login
    npx eas-cli build --platform android --profile development
    npx eas-cli build --platform android --profile preview
    npx eas-cli build --platform android --profile production

`preview` genera un APK interno para instalar y probar; `production` genera un AAB para Google Play. Consulta [EVIDENCIAS_PROYECTO.md](./EVIDENCIAS_PROYECTO.md) para permisos, matrices de pruebas y pasos de distribución.
