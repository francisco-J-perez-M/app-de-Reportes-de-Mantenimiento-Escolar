# Evidencias del proyecto: Reportes de Mantenimiento Escolar

## Datos de identificación

| Dato | Configuración |
|---|---|
| Nombre | Reportes Mantenimiento Escolar |
| Identificador Android | `com.utvt.reportesmantenimiento` |
| Versión | `1.0.0` |
| `versionCode` | `1` |
| Almacenamiento | Local en el dispositivo mediante AsyncStorage; sin Firebase, Supabase ni API de reportes |
| Cuentas de prueba | `alumno@utvt.edu.mx` / `123456`; `admin@utvt.edu.mx` / `123456` |
| SDK de Expo | `58.0.0` |
| React Native | `0.88.1` |

> Esta plantilla separa la funcionalidad implementada de los resultados que deben obtenerse en un dispositivo. Completa las columnas de resultado y adjunta capturas propias después de ejecutar cada prueba; no se presuponen pruebas físicas ni una compilación EAS ya realizada.

## Parte 1 — Evidencias de pruebas funcionales

### Matriz de pruebas

| Prueba | Procedimiento | Resultado esperado | Resultado observado / evidencia |
|---|---|---|---|
| Inicio de sesión válido | Probar ambas cuentas de prueba; cerrar y volver a abrir la app | Acceso según rol; sesión restaurada; cierre de sesión vuelve al login | Pendiente de ejecución: ____________________ |
| Inicio de sesión inválido | Probar campos vacíos, correo mal formado y contraseña incorrecta | Mensajes claros; no se inicia sesión; intento registrado en consola | Pendiente de ejecución: ____________________ |
| Registro de reporte | Completar título, descripción y área; guardar | Reporte persistido localmente como Pendiente y visible en el listado | Pendiente de ejecución: ____________________ |
| Captura fotográfica | Probar cámara y galería por separado | La imagen seleccionada se previsualiza y se adjunta al reporte | Pendiente de ejecución: ____________________ |
| Ubicación GPS | Conceder permiso y obtener posición | Se muestran latitud, longitud y precisión en metros | Pendiente de ejecución: ____________________ |
| Estado administrativo | Ingresar como administrativo y cambiar el estado de un reporte | El cambio persiste y se refleja en detalle y listado; estudiante no tiene controles de edición | Pendiente de ejecución: ____________________ |

**Capturas para insertar:** login (`01-login.png`), listado (`02-reportes.png`), formulario (`03-registro.png`), permisos/captura (`04-fotografia.png`), GPS (`05-ubicacion.png`), estado administrativo (`06-estado.png`).

### Registro de logs y errores de prueba

| Fecha/hora | Dispositivo / versión | Prueba | Log observado / mensaje | Resultado / acción |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |

Los intentos de autenticación se diagnostican en la consola con el prefijo `[auth]`; errores al cargar datos locales y al cerrar sesión se registran como `[app]` y `[auth]`. No registrar contraseñas en logs.

Las cuentas y contraseñas incluidas son únicamente para demostración y pruebas. No utilizar esta autenticación local como control de acceso de una versión pública.

### Comparativa técnica: Debug y Release

| Aspecto | Debug / desarrollo | Release / distribución |
|---|---|---|
| Propósito | Desarrollo, depuración y pruebas internas | Entrega a usuarios de prueba o publicación |
| Herramientas | Expo Dev Client o servidor de desarrollo; logs y herramientas de depuración | Binario firmado generado por EAS; sin depender del servidor de desarrollo |
| Distribución | Equipo de desarrollo o perfil `development` | APK interno (`preview`) o AAB de producción |
| Rendimiento | Puede incluir instrumentación y no representar rendimiento final | Optimizado para distribución; validar funcionamiento en dispositivo real |
| Comando EAS | `eas build --platform android --profile development` | `eas build --platform android --profile preview` o `--profile production` |

### Conclusión funcional

La aplicación ofrece autenticación local con roles de prueba, persistencia local de sesión y reportes, consulta de detalle, actualización de estado por personal administrativo y captura opcional de foto y ubicación. La capa de servicio simula una latencia de 400 ms y está aislada para facilitar una futura sustitución por un backend. Antes de declarar aceptación, completar la matriz con resultados verificados en dispositivos/emuladores Android.

## Parte 2 — Evidencias de permisos y privacidad

### Matriz de permisos

| Uso | Permiso declarado en `app.json` | Solicitud en tiempo de ejecución | Aceptación | Rechazo / revocación |
|---|---|---|---|---|
| Cámara | `CAMERA` | Solo al pulsar **Tomar Foto (Cámara)**, después de explicar el uso | Permite capturar y adjuntar una imagen al reporte | Informa que no hay permiso; si Android ya no permite volver a preguntar, muestra **Abrir Ajustes** |
| Fotografías / archivos | `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE` | Solo al pulsar **Elegir de Galería**, después de explicar el uso | Permite seleccionar una imagen para el reporte | Informa el rechazo; ofrece **Abrir Ajustes** cuando `canAskAgain` es `false` |
| Ubicación GPS | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` | Solo al pulsar **Obtener ubicación GPS**, después de explicar el uso | Obtiene posición en primer plano y precisión | Mantiene disponible el campo manual edificio/aula; informa el rechazo y ofrece **Abrir Ajustes** si corresponde |

`ACCESS_BACKGROUND_LOCATION` no está declarado. Los plugins `expo-image-picker` y `expo-location` especifican mensajes de uso en `app.json`. La aplicación no solicita estos permisos durante el inicio.

**Evidencia por permiso:** adjuntar una captura con el diálogo del sistema aceptado, otra con permiso rechazado y, cuando aplique, otra de la alternativa manual / acceso a Ajustes. Completar en un dispositivo Android; los diálogos pueden variar por versión del sistema.

### Medidas de privacidad aplicadas

- Los reportes, la sesión y las referencias a fotos se guardan en el almacenamiento local del dispositivo. No se envían a servicios externos en esta versión.
- Cámara y galería solo se usan por acción explícita del usuario; la ubicación se solicita únicamente durante el uso y para el reporte.
- Si no se concede ubicación, el formulario permite indicar edificio, piso o aula manualmente; foto y GPS son opcionales.
- No se declara permiso de ubicación en segundo plano y no se realiza seguimiento continuo.
- AsyncStorage no es almacenamiento cifrado. No almacenar información sensible en reportes de prueba y evaluar almacenamiento seguro/cifrado antes de incluir datos personales reales.
- Los permisos Android declarados no garantizan por sí solos el comportamiento de cada versión de Android; validar APK final y manifiesto en los dispositivos objetivo.

## Parte 3 — Configuración y empaquetado Android

### Configuración del proyecto

| Propiedad | Valor |
|---|---|
| `android.package` | `com.utvt.reportesmantenimiento` |
| `version` | `1.0.0` |
| `android.versionCode` | `1` |
| Permisos | Cámara, imágenes/archivos y ubicación precisa/aproximada; sin ubicación en segundo plano |
| Plugins | `expo-image-picker`, `expo-location` |

Se requiere una cuenta EAS y credenciales de firma Android para generar la compilación. Desde la raíz del proyecto:

```bash
npm install
npx expo-doctor
npx tsc --noEmit
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

El perfil `preview` produce un **APK** de distribución interna. Descargarlo desde el enlace de la compilación EAS e instalarlo en un Android autorizado para pruebas. El proyecto configura también `development` (cliente de desarrollo interno) y `production` (AAB).

### APK frente a AAB

| Formato | Uso | Instalación / distribución |
|---|---|---|
| APK | Pruebas internas o distribución directa | Se puede instalar directamente en Android, sujeto a permitir esa fuente y a la firma |
| AAB | Publicación en Google Play | Es un paquete de publicación; Google Play genera APK optimizados para cada dispositivo. No se instala directamente como un APK convencional |

## Parte 4 — Distribución y publicación

### Compartir un APK de prueba mediante EAS Build

1. Revisa permisos, versión, identificador y política de privacidad; prueba el APK en dispositivos objetivo.
2. Ejecuta `npx eas-cli build --platform android --profile preview` desde la raíz.
3. Espera a que EAS Build finalice y descarga el APK desde el enlace proporcionado por EAS.
4. Comparte el enlace de descarga únicamente con las personas autorizadas para la prueba. El enlace de compilación permite distribuir el artefacto; no sustituye un mecanismo de control de acceso para datos.
5. En Android, abre el APK y autoriza temporalmente la instalación desde la fuente usada, si el sistema lo solicita. Recomienda desactivar esa autorización al terminar.
6. Documenta versión, dispositivo, resultado de instalación y pruebas funcionales; revoca/retira el acceso de prueba al concluir.

### Firebase App Distribution (alternativa)

Firebase App Distribution es una opción de distribución de binarios de prueba, no una dependencia de la app ni su backend de reportes.

1. Crea/configura un proyecto Firebase y habilita App Distribution; invita a los testers por correo o grupo.
2. Genera el APK firmado de `preview` con EAS y descarga el artefacto.
3. Sube el APK a App Distribution mediante su consola o CLI autenticada; selecciona la app Android correspondiente y añade notas de versión.
4. Envía invitaciones; los testers aceptan y descargan la compilación según las instrucciones de Firebase.
5. Gestiona altas/bajas de testers y elimina versiones que ya no deban distribuirse. No publicar credenciales ni tokens de Firebase en el repositorio.

### Requisitos para publicación pública en Google Play

- Cuenta de desarrollador de Google Play verificada y aceptación de los acuerdos aplicables; pueden existir tarifas y verificaciones vigentes que deben confirmarse en Play Console.
- Identificador de paquete único y definitivo, clave de firma protegida y compilación **AAB** de producción. Incrementar `versionCode` en cada actualización.
- Completar ficha de tienda, clasificación de contenido, audiencia objetivo, países, datos de contacto y recursos gráficos requeridos.
- Publicar una política de privacidad accesible y coherente con las prácticas reales de recopilación, uso, retención y eliminación de datos. Declarar permisos y completar el formulario de Seguridad de datos con precisión.
- Solicitar únicamente permisos necesarios, proporcionar justificación clara y cumplir las políticas de Google Play, incluidas las reglas aplicables a datos personales, fotos y ubicación.
- Ejecutar pruebas de calidad y compatibilidad en dispositivos objetivo; cumplir requisitos de nivel de API, formato, firma y plazos vigentes de Play Console.
- Revisar requisitos legales de privacidad y protección de datos aplicables a la institución, usuarios y jurisdicción antes de procesar reportes con datos personales o imágenes.

La lista anterior es una guía técnica general, no asesoría legal. Los requisitos y políticas de Play/Firebase pueden cambiar; verificar la documentación y Play Console vigentes al momento de publicar.
