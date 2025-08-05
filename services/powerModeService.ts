import { Platform, Alert, Linking } from 'react-native';
import * as Device from 'expo-device';
import * as Battery from 'expo-battery';

export const powerModeService = {
  
  // Verificar si el modo ahorro de energía está activo
  async isPowerSavingModeActive(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // En Android, verificar estado de batería
        const batteryState = await Battery.getBatteryStateAsync();
        const powerSaveMode = await Battery.isLowPowerModeEnabledAsync();
        return powerSaveMode;
      } 
      else if (Platform.OS === 'ios') {
        // En iOS, verificar Low Power Mode
        const powerSaveMode = await Battery.isLowPowerModeEnabledAsync();
        return powerSaveMode;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error verificando modo ahorro energía:', error);
      return false;
    }
  },

  // Verificar permisos de optimización de batería (Android)
  async checkBatteryOptimization(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android puede limitar apps en background
        // Esto requiere verificación manual del usuario
        return true; // Asumir que puede estar optimizado
      }
      return false;
    } catch (error) {
      console.error('❌ Error verificando optimización batería:', error);
      return false;
    }
  },

  // Mostrar alerta sobre modo ahorro de energía
  async showPowerSavingAlert(): Promise<void> {
    const deviceType = Device.deviceType;
    const platform = Platform.OS;
    
    let title = '⚡ Modo Ahorro de Energía Detectado';
    let message = '';
    let instructions = '';

    if (platform === 'android') {
      message = 'El modo ahorro de energía está activo. Esto puede limitar las notificaciones cuando la app esté cerrada.';
      instructions = 'Para recibir notificaciones:\n\n1. Ve a Configuración\n2. Batería > Ahorro de energía\n3. Desactiva el modo ahorro\n4. O añade NoteDo a apps exentas';
    } else if (platform === 'ios') {
      message = 'El modo de bajo consumo está activo. Esto puede limitar las notificaciones en segundo plano.';
      instructions = 'Para recibir notificaciones:\n\n1. Ve a Configuración\n2. Batería\n3. Desactiva "Modo de bajo consumo"';
    } else {
      message = 'El modo ahorro de energía puede estar limitando las notificaciones.';
      instructions = 'Verifica la configuración de energía de tu dispositivo.';
    }

    Alert.alert(
      title,
      `${message}\n\n${instructions}`,
      [
        {
          text: 'Entendido',
          style: 'default'
        },
        {
          text: 'Abrir Configuración',
          style: 'default',
          onPress: () => {
            this.openBatterySettings();
          }
        }
      ],
      { cancelable: true }
    );
  },

  // Mostrar alerta sobre optimización de batería (Android)
  async showBatteryOptimizationAlert(): Promise<void> {
    if (Platform.OS !== 'android') return;

    Alert.alert(
      '🔋 Optimización de Batería',
      'Para garantizar que las notificaciones funcionen correctamente, te recomendamos desactivar la optimización de batería para NoteDo.\n\n¿Quieres ver las instrucciones?',
      [
        {
          text: 'Ahora no',
          style: 'cancel'
        },
        {
          text: 'Ver instrucciones',
          style: 'default',
          onPress: () => {
            this.showBatteryOptimizationInstructions();
          }
        }
      ]
    );
  },

  // Mostrar instrucciones detalladas para optimización de batería
  showBatteryOptimizationInstructions(): void {
    Alert.alert(
      '📱 Instrucciones Android',
      'Para desactivar la optimización de batería:\n\n' +
      '1. Ve a Configuración\n' +
      '2. Aplicaciones > NoteDo\n' +
      '3. Batería > Optimización de batería\n' +
      '4. Selecciona "No optimizar"\n\n' +
      'O también:\n' +
      '1. Configuración > Batería\n' +
      '2. Optimización de batería\n' +
      '3. Busca NoteDo\n' +
      '4. Selecciona "No optimizar"',
      [
        {
          text: 'Entendido',
          style: 'default'
        }
      ]
    );
  },

  // Abrir configuración de batería del sistema
  async openBatterySettings(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await Linking.openSettings();
      } else if (Platform.OS === 'ios') {
        await Linking.openURL('App-prefs:BATTERY_USAGE');
      }
    } catch (error) {
      console.error('❌ Error abriendo configuración:', error);
      Alert.alert(
        'Error',
        'No se pudo abrir la configuración automáticamente. Por favor, ábrela manualmente desde Configuración > Batería.'
      );
    }
  },

  // Verificar todo y mostrar alertas si es necesario
  async checkAndAlertPowerIssues(): Promise<void> {
    try {
      console.log('🔍 Verificando configuración de energía...');
      
      // Verificar modo ahorro de energía
      const isPowerSaving = await this.isPowerSavingModeActive();
      
      if (isPowerSaving) {
        console.log('⚠️ Modo ahorro de energía detectado');
        await this.showPowerSavingAlert();
        return; // Solo mostrar una alerta a la vez
      }

      // Si no hay modo ahorro, verificar optimización en Android
      if (Platform.OS === 'android') {
        // Mostrar alerta informativa sobre optimización de batería
        // Solo la primera vez o ocasionalmente
        const shouldShowOptimizationAlert = await this.shouldShowOptimizationAlert();
        if (shouldShowOptimizationAlert) {
          await this.showBatteryOptimizationAlert();
        }
      }

      console.log('✅ Verificación de energía completada');
      
    } catch (error) {
      console.error('❌ Error verificando configuración energía:', error);
    }
  },

  // Verificar si debe mostrar alerta de optimización (evitar spam)
  async shouldShowOptimizationAlert(): Promise<boolean> {
    try {
      // Lógica simple: mostrar solo algunas veces
      // En una implementación real, podrías usar AsyncStorage para controlar frecuencia
      const randomChance = Math.random();
      return randomChance < 0.3; // 30% de probabilidad
    } catch (error) {
      return false;
    }
  },

  // Obtener información del estado de energía
  async getPowerStatus(): Promise<{
    isPowerSaving: boolean;
    batteryLevel: number;
    batteryState: string;
    deviceType: string;
  }> {
    try {
      const isPowerSaving = await this.isPowerSavingModeActive();
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      const deviceType = Device.deviceType || 'unknown';

      return {
        isPowerSaving,
        batteryLevel: Math.round(batteryLevel * 100),
        batteryState: String(batteryState),
        deviceType: String(deviceType)
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado energía:', error);
      return {
        isPowerSaving: false,
        batteryLevel: 100,
        batteryState: 'unknown',
        deviceType: 'unknown'
      };
    }
  }
};
