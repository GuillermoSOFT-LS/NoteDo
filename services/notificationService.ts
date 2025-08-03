import { Reminder } from '@/types/interfaces';
import { Alert } from 'react-native';

// Servicio de notificaciones simplificado (sin expo-notifications por ahora)
export const notificationService = {
  // Simular solicitud de permisos
  async requestPermissions(): Promise<boolean> {
    // Por ahora siempre retorna true, en producción se usaría expo-notifications
    return true;
  },

  // Programar un recordatorio (simulado)
  async scheduleReminder(reminder: Reminder, taskTitle: string): Promise<string | null> {
    try {
      // Combinar fecha y hora
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      
      // Verificar que la fecha sea futura
      if (reminderDateTime <= new Date()) {
        Alert.alert('Error', 'La fecha del recordatorio debe ser futura');
        return null;
      }

      // Simular ID de notificación
      const notificationId = `reminder_${Date.now()}`;
      
      // Mostrar confirmación
      Alert.alert(
        'Recordatorio programado',
        `Se ha programado un recordatorio para "${taskTitle}" el ${this.formatDateTime(reminder.date, reminder.time)}`,
        [{ text: 'OK' }]
      );

      console.log(`Recordatorio programado: ${notificationId} para ${taskTitle}`);
      return notificationId;
    } catch (error) {
      console.error('Error programando recordatorio:', error);
      Alert.alert('Error', 'No se pudo programar el recordatorio');
      return null;
    }
  },

  // Cancelar un recordatorio
  async cancelReminder(notificationId: string): Promise<boolean> {
    try {
      console.log(`Recordatorio cancelado: ${notificationId}`);
      Alert.alert('Recordatorio cancelado', 'El recordatorio ha sido eliminado');
      return true;
    } catch (error) {
      console.error('Error cancelando recordatorio:', error);
      return false;
    }
  },

  // Obtener recordatorios programados (simulado)
  async getScheduledNotifications() {
    // En producción retornaría las notificaciones reales
    return [];
  },

  // Cancelar todos los recordatorios
  async cancelAllNotifications(): Promise<boolean> {
    try {
      console.log('Todos los recordatorios cancelados');
      return true;
    } catch (error) {
      console.error('Error cancelando recordatorios:', error);
      return false;
    }
  },

  // Mostrar notificación inmediata (para testing)
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
  }
};