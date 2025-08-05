# 📱 Cómo Generar tu APK de NoteDo

## 🚀 Método 1: EAS Build (Recomendado)

### Paso 1: Instalar herramientas
```bash
npm install -g @expo/cli eas-cli
```

### Paso 2: Login en Expo
```bash
eas login
# Ingresa tu email/username y contraseña de Expo
```

### Paso 3: Configurar proyecto (Ya está listo)
El archivo `eas.json` ya está configurado ✅

### Paso 4: Generar APK
```bash
# APK de prueba (más rápido)
eas build -p android --profile preview

# APK de producción (optimizado)
eas build -p android --profile production
```

### Paso 5: Descargar APK
- Te dará un link para descargar
- O ve a https://expo.dev/builds

---

## 🔧 Método 2: Build Local

### Requisitos:
- Android Studio instalado
- Java Development Kit (JDK) 17+
- Android SDK configurado

### Pasos:
```bash
# 1. Generar build local
npx expo run:android --variant release

# 2. El APK se genera en:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## ⚡ Opción Rápida (Si tienes cuenta Expo)

```bash
# 1. Login
eas login

# 2. Build APK directo
eas build -p android --profile preview

# 3. Esperar 5-15 minutos
# 4. Descargar del link que te da
```

---

## 🎯 Para Notificaciones Completas

**IMPORTANTE:** Para que las notificaciones funcionen 24/7 (incluso con app cerrada), necesitas usar cualquiera de estos métodos, NO Expo Go.

### Verificar que funciona:
1. Instala el APK generado
2. Programa una notificación
3. Cierra completamente la app
4. Espera a que llegue la notificación push real 🔔

---

## 🐛 Troubleshooting

### Error: "An Expo user account is required"
```bash
eas login
# Crea cuenta en https://expo.dev si no tienes
```

### Error: Build failed
```bash
# Limpiar cache
npx expo install --fix
npm run android
```

### APK muy pesado
```bash
# Usar perfil optimizado
eas build -p android --profile production
```

---

## 📋 Resumen Rápido

1. **Para probar:** `eas build -p android --profile preview`
2. **Para publicar:** `eas build -p android --profile production`  
3. **Local (avanzado):** `npx expo run:android --variant release`

¡El APK tendrá notificaciones que funcionan 24/7! 🚀
