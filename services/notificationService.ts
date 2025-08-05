import { simpleNotificationService } from './simpleNotificationService';
import Constants from 'expo-constants';

// Detectar si estamos en Expo Go
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Servicio inteligente que adapta según disponibilidad
export const notificationService = {
  // Intentar inicializar el servicio apropiado
  async initialize(): Promise<boolean> {
    try {
      // Si estamos en Expo Go, usar solo el sistema simple
      if (isExpoGo) {
        console.log('📱 Detectado Expo Go - usando sistema de notificaciones simple');
        console.log('💡 Para notificaciones completas: npx expo run:android');
        Object.assign(this, simpleNotificationService);
        return await simpleNotificationService.initialize();
      }

      // Si NO estamos en Expo Go, intentar cargar el servicio completo
      try {
        // Dynamic import para evitar errores en Expo Go
        const { backgroundNotificationService } = await import('./backgroundNotificationService');
        const backgroundSuccess = await backgroundNotificationService.initialize();
        
        if (backgroundSuccess) {
          console.log('🚀 Usando sistema de notificaciones completo');
          // Reemplazar métodos con el servicio completo
          Object.assign(this, backgroundNotificationService);
          return true;
        } else {
          throw new Error('Background service no disponible');
        }
      } catch (error) {
        console.log('⚠️ Sistema completo no disponible, usando simple');
        Object.assign(this, simpleNotificationService);
        return await simpleNotificationService.initialize();
      }
    } catch (error) {
      console.error('❌ Error inicializando notificaciones:', error);
      Object.assign(this, simpleNotificationService);
      return await simpleNotificationService.initialize();
    }
  },

  // Métodos por defecto (serán reemplazados en initialize)
  async requestPermissions() { return true; },
  async scheduleReminder() { return null; },
  async cancelReminder() { return false; },
  async getScheduledNotifications() { return []; },
  async cancelAllNotifications() { return false; },
  async showImmediateNotification() { return false; },
  cleanup() {}
};