import { Reminder } from '@/types/interfaces';
import { Alert } from 'react-native';
import { storageService } from './storageService';

// Sistema de notificaciones simple sin expo-notifications
export const simpleNotificationService = {
  
  // Siempre disponible
  async requestPermissions(): Promise<boolean> {
    return true;
  },

  // Programar un recordatorio usando nuestro sistema
  async scheduleReminder(reminder: Reminder, taskTitle: string): Promise<string | null> {
    try {
      // Combinar fecha y hora
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      
      // Verificar que la fecha sea futura
      if (reminderDateTime <= new Date()) {
        Alert.alert('Error', 'La fecha del recordatorio debe ser futura');
        return null;
      }

      // Crear recordatorio programado
      const scheduledReminder = {
        id: `reminder_${Date.now()}`,
        reminderId: reminder.id,
        taskTitle,
        scheduledTime: reminderDateTime.getTime(),
        isActive: true,
      };

      // Guardar en storage
      const existingReminders = await storageService.get('scheduledReminders') || [];
      const updatedReminders = [...existingReminders, scheduledReminder];
      await storageService.set('scheduledReminders', updatedReminders);

      // Iniciar el sistema de verificación
      this.startReminderChecker();

      Alert.alert(
        'Recordatorio programado',
        `Se ha programado un recordatorio para "${taskTitle}" el ${this.formatDateTime(reminder.date, reminder.time)}`
      );

      return scheduledReminder.id;
    } catch (error) {
      console.error('Error programando recordatorio:', error);
      Alert.alert('Error', 'No se pudo programar el recordatorio');
      return null;
    }
  },

  // Sistema de verificación de recordatorios
  reminderCheckInterval: null as NodeJS.Timeout | null,

  startReminderChecker() {
    // Evitar múltiples intervalos
    if (this.reminderCheckInterval) return;

    this.reminderCheckInterval = setInterval(async () => {
      await this.checkPendingReminders();
    }, 30000); // Verificar cada 30 segundos
  },

  stopReminderChecker() {
    if (this.reminderCheckInterval) {
      clearInterval(this.reminderCheckInterval);
      this.reminderCheckInterval = null;
    }
  },

  async checkPendingReminders() {
    try {
      const scheduledReminders = await storageService.get('scheduledReminders') || [];
      const now = Date.now();
      const activeReminders = [];
      let hasTriggered = false;

      for (const reminder of scheduledReminders) {
        if (reminder.isActive && reminder.scheduledTime <= now) {
          // Disparar recordatorio
          Alert.alert(
            '📋 Recordatorio de Tarea',
            reminder.taskTitle,
            [
              { 
                text: 'OK', 
                onPress: () => {
                  // Marcar como completado
                  this.markReminderAsCompleted(reminder.id);
                }
              }
            ]
          );
          hasTriggered = true;
          
          // Marcar como inactivo
          reminder.isActive = false;
        }
        
        // Mantener recordatorios para referencia (incluso inactivos)
        activeReminders.push(reminder);
      }

      if (hasTriggered) {
        await storageService.set('scheduledReminders', activeReminders);
      }
    } catch (error) {
      console.error('Error verificando recordatorios:', error);
    }
  },

  async markReminderAsCompleted(reminderId: string) {
    try {
      const scheduledReminders = await storageService.get('scheduledReminders') || [];
      const updated = scheduledReminders.map((r: any) => 
        r.id === reminderId ? { ...r, isActive: false, completed: true } : r
      );
      await storageService.set('scheduledReminders', updated);
    } catch (error) {
      console.error('Error marcando recordatorio como completado:', error);
    }
  },

  // Cancelar un recordatorio
  async cancelReminder(notificationId: string): Promise<boolean> {
    try {
      const scheduledReminders = await storageService.get('scheduledReminders') || [];
      const updated = scheduledReminders.filter((r: any) => r.id !== notificationId);
      await storageService.set('scheduledReminders', updated);
      return true;
    } catch (error) {
      console.error('Error cancelando recordatorio:', error);
      return false;
    }
  },

  // Obtener recordatorios programados
  async getScheduledNotifications() {
    try {
      return await storageService.get('scheduledReminders') || [];
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  },

  // Cancelar todos los recordatorios
  async cancelAllNotifications(): Promise<boolean> {
    try {
      await storageService.set('scheduledReminders', []);
      return true;
    } catch (error) {
      console.error('Error cancelando recordatorios:', error);
      return false;
    }
  },

  // Mostrar notificación inmediata
  async showImmediateNotification(title: string, body: string) {
    Alert.alert(title, body);
    return true;
  },

  // Formatear fecha y hora para mostrar
  formatDateTime(date: string, time: string): string {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  },

  // Verificar si una fecha/hora es válida para recordatorio
  isValidReminderTime(date: string, time: string): boolean {
    try {
      const reminderDateTime = new Date(`${date}T${time}`);
      return reminderDateTime > new Date();
    } catch (error) {
      return false;
    }
  },

  // Obtener fecha actual en formato YYYY-MM-DD
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  },

  // Obtener hora actual en formato HH:MM
  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  // Inicializar el servicio
  initialize() {
    this.startReminderChecker();
  },

  // Limpiar al cerrar
  cleanup() {
    this.stopReminderChecker();
  }
};
