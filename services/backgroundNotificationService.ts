import * as Notifications from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { Reminder } from '@/types/interfaces';
import { storageService } from './storageService';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Task de background para verificar notificaciones
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    console.log('🔔 Ejecutando verificación de notificaciones en background');
    
    // Obtener recordatorios programados
    const scheduledReminders = await storageService.get('scheduledReminders') || [];
    const now = Date.now();
    let processedCount = 0;
    
    const activeReminders = [];
    
    for (const reminder of scheduledReminders) {
      if (reminder.isActive && reminder.scheduledTime <= now) {
        // Enviar notificación push real (compatible iOS/Android)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '📋 Recordatorio de Tarea',
            body: reminder.taskTitle,
            sound: 'default',
            priority: Platform.OS === 'android' 
              ? Notifications.AndroidNotificationPriority.HIGH 
              : undefined,
          },
          trigger: null, // Inmediata
        });
        
        // Marcar como procesado
        reminder.isActive = false;
        reminder.processed = true;
        processedCount++;
      }
      
      activeReminders.push(reminder);
    }
    
    // Actualizar storage si hubo cambios
    if (processedCount > 0) {
      await storageService.set('scheduledReminders', activeReminders);
    }
    
    console.log(`✅ Procesadas ${processedCount} notificaciones en background`);
    
    return processedCount > 0 ? BackgroundTask.BackgroundTaskResult.NewData : BackgroundTask.BackgroundTaskResult.NoData;
  } catch (error) {
    console.error('❌ Error en background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const backgroundNotificationService = {
  
  // Configurar y solicitar permisos
  async initialize(): Promise<boolean> {
    try {
      // Este servicio solo debe ejecutarse en builds nativos
      // La detección de Expo Go se hace en notificationService.ts

      // Solicitar permisos de notificaciones
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Permisos de notificación denegados');
        return false;
      }
      
      // Configurar canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Recordatorios NoteDo',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF8C00',
          sound: 'default',
          enableVibrate: true,
        });
      }

      // Configuración adicional para iOS
      if (Platform.OS === 'ios') {
        // iOS maneja las notificaciones automáticamente con los permisos
        console.log('📱 Configuración iOS aplicada');
      }
      
      // Registrar background task
      await BackgroundTask.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 15000, // 15 segundos mínimo
        stopOnTerminate: false, // Continuar después de cerrar app
        startOnBoot: true, // Iniciar al reiniciar dispositivo
      });
      
      console.log('✅ Servicio de notificaciones background inicializado');
      return true;
      
    } catch (error) {
      console.error('❌ Error inicializando notificaciones background:', error);
      return false;
    }
  },
  
  // Programar recordatorio con notificación real
  async scheduleReminder(reminder: Reminder, taskTitle: string): Promise<string | null> {
    try {
      // Combinar fecha y hora
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      
      // Verificar que la fecha sea futura
      if (reminderDateTime <= new Date()) {
        throw new Error('La fecha del recordatorio debe ser futura');
      }

      // Programar notificación push (compatible iOS/Android)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📋 Recordatorio de Tarea',
          body: taskTitle,
          sound: 'default',
          priority: Platform.OS === 'android' 
            ? Notifications.AndroidNotificationPriority.HIGH 
            : undefined,
          categoryIdentifier: 'reminder',
        },
        trigger: {
          date: reminderDateTime,
        },
      });

      // Crear recordatorio programado para backup
      const scheduledReminder = {
        id: `reminder_${Date.now()}`,
        notificationId,
        reminderId: reminder.id,
        taskTitle,
        scheduledTime: reminderDateTime.getTime(),
        isActive: true,
      };

      // Guardar en storage como backup
      const existingReminders = await storageService.get('scheduledReminders') || [];
      const updatedReminders = [...existingReminders, scheduledReminder];
      await storageService.set('scheduledReminders', updatedReminders);

      console.log(`✅ Recordatorio programado: ${taskTitle} para ${reminderDateTime.toLocaleString()}`);
      return notificationId;
      
    } catch (error) {
      console.error('❌ Error programando recordatorio:', error);
      throw error;
    }
  },

  // Cancelar recordatorio
  async cancelReminder(notificationId: string): Promise<boolean> {
    try {
      // Cancelar notificación programada
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      // Remover del storage
      const scheduledReminders = await storageService.get('scheduledReminders') || [];
      const updated = scheduledReminders.filter((r: any) => 
        r.notificationId !== notificationId && r.id !== notificationId
      );
      await storageService.set('scheduledReminders', updated);
      
      return true;
    } catch (error) {
      console.error('❌ Error cancelando recordatorio:', error);
      return false;
    }
  },

  // Obtener notificaciones programadas
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones:', error);
      return [];
    }
  },

  // Cancelar todas las notificaciones
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storageService.set('scheduledReminders', []);
      return true;
    } catch (error) {
      console.error('❌ Error cancelando todas las notificaciones:', error);
      return false;
    }
  },

  // Mostrar notificación inmediata
  async showImmediateNotification(title: string, body: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Platform.OS === 'android' 
            ? Notifications.AndroidNotificationPriority.HIGH 
            : undefined,
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
      return false;
    }
  },

  // Verificar estado de background task
  async getBackgroundTaskStatus() {
    try {
      const status = await BackgroundTask.getStatusAsync();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      
      return {
        status,
        isRegistered,
        statusText: this.getStatusText(status)
      };
    } catch (error) {
      console.error('❌ Error verificando estado background:', error);
      return null;
    }
  },

  getStatusText(status: BackgroundTask.BackgroundTaskStatus): string {
    switch (status) {
      case BackgroundTask.BackgroundTaskStatus.Available:
        return 'Disponible ✅';
      case BackgroundTask.BackgroundTaskStatus.Denied:
        return 'Denegado ❌';
      case BackgroundTask.BackgroundTaskStatus.Restricted:
        return 'Restringido ⚠️';
      default:
        return 'Desconocido ❓';
    }
  },

  // Limpiar resources
  async cleanup() {
    try {
      await TaskManager.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log('🧹 Background task desregistrado');
    } catch (error) {
      console.error('❌ Error limpiando background service:', error);
    }
  }
};
