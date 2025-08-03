import { useState } from 'react';
import { storageService, StorageKeys } from '@/services/storageService';
import { notificationService } from '@/services/notificationService';
import { Reminder, Task, TaskList } from '@/types/interfaces';
import { generateId } from '@/utils/generateId';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Crear un nuevo recordatorio
  const createReminder = async (
    taskId: string,
    taskTitle: string,
    date: string,
    time: string
  ): Promise<boolean> => {
    try {
      // Validar fecha y hora
      if (!notificationService.isValidReminderTime(date, time)) {
        throw new Error('La fecha y hora del recordatorio debe ser futura');
      }

      // Crear recordatorio
      const newReminder: Reminder = {
        id: generateId(),
        date,
        time,
        isActive: true,
      };

      // Programar notificación
      const notificationId = await notificationService.scheduleReminder(
        newReminder,
        taskTitle
      );

      if (!notificationId) {
        throw new Error('No se pudo programar la notificación');
      }

      // Guardar recordatorio en storage
      const existingReminders = await storageService.get<Reminder>(StorageKeys.REMINDERS);
      const updatedReminders = [newReminder, ...existingReminders];
      await storageService.set(StorageKeys.REMINDERS, updatedReminders);

      // Actualizar la tarea con el recordatorio
      await addReminderToTask(taskId, newReminder);

      setReminders(updatedReminders);
      return true;
    } catch (error) {
      console.error('Error creando recordatorio:', error);
      return false;
    }
  };

  // Agregar recordatorio a una tarea específica
  const addReminderToTask = async (taskId: string, reminder: Reminder) => {
    try {
      const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
      let taskFound = false;

      for (const list of lists) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
          task.reminder = reminder;
          taskFound = true;
          break;
        }
      }

      if (taskFound) {
        await storageService.set(StorageKeys.LISTS, lists);
      }
    } catch (error) {
      console.error('Error agregando recordatorio a tarea:', error);
    }
  };

  // Obtener todos los recordatorios
  const getAllReminders = async (): Promise<Reminder[]> => {
    try {
      const remindersList = await storageService.get<Reminder>(StorageKeys.REMINDERS);
      setReminders(remindersList);
      return remindersList;
    } catch (error) {
      console.error('Error obteniendo recordatorios:', error);
      return [];
    }
  };

  // Eliminar un recordatorio
  const deleteReminder = async (reminderId: string, taskId?: string): Promise<boolean> => {
    try {
      // Cancelar notificación
      await notificationService.cancelReminder(reminderId);

      // Remover de storage de recordatorios
      const existingReminders = await storageService.get<Reminder>(StorageKeys.REMINDERS);
      const updatedReminders = existingReminders.filter(r => r.id !== reminderId);
      await storageService.set(StorageKeys.REMINDERS, updatedReminders);

      // Remover de la tarea si se proporciona taskId
      if (taskId) {
        await removeReminderFromTask(taskId);
      }

      setReminders(updatedReminders);
      return true;
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
      return false;
    }
  };

  // Remover recordatorio de una tarea
  const removeReminderFromTask = async (taskId: string) => {
    try {
      const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
      let taskFound = false;

      for (const list of lists) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task && task.reminder) {
          delete task.reminder;
          taskFound = true;
          break;
        }
      }

      if (taskFound) {
        await storageService.set(StorageKeys.LISTS, lists);
      }
    } catch (error) {
      console.error('Error removiendo recordatorio de tarea:', error);
    }
  };

  // Activar/desactivar un recordatorio
  const toggleReminder = async (reminderId: string): Promise<boolean> => {
    try {
      const existingReminders = await storageService.get<Reminder>(StorageKeys.REMINDERS);
      const reminder = existingReminders.find(r => r.id === reminderId);

      if (!reminder) return false;

      reminder.isActive = !reminder.isActive;

      if (reminder.isActive) {
        // Reactivar notificación
        await notificationService.scheduleReminder(reminder, 'Recordatorio reactivado');
      } else {
        // Cancelar notificación
        await notificationService.cancelReminder(reminderId);
      }

      await storageService.set(StorageKeys.REMINDERS, existingReminders);
      setReminders(existingReminders);
      return true;
    } catch (error) {
      console.error('Error alternando recordatorio:', error);
      return false;
    }
  };

  // Obtener recordatorios de una tarea específica
  const getTaskReminders = async (taskId: string): Promise<Reminder[]> => {
    try {
      const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
      const taskReminders: Reminder[] = [];

      for (const list of lists) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task && task.reminder) {
          taskReminders.push(task.reminder);
        }
      }

      return taskReminders;
    } catch (error) {
      console.error('Error obteniendo recordatorios de tarea:', error);
      return [];
    }
  };

  // Limpiar recordatorios vencidos
  const cleanExpiredReminders = async (): Promise<number> => {
    try {
      const existingReminders = await storageService.get<Reminder>(StorageKeys.REMINDERS);
      const now = new Date();
      let cleanedCount = 0;

      const activeReminders = existingReminders.filter(reminder => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        const isExpired = reminderDateTime <= now;
        
        if (isExpired) {
          cleanedCount++;
          // Cancelar notificación del recordatorio vencido
          notificationService.cancelReminder(reminder.id);
        }
        
        return !isExpired;
      });

      if (cleanedCount > 0) {
        await storageService.set(StorageKeys.REMINDERS, activeReminders);
        setReminders(activeReminders);
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error limpiando recordatorios vencidos:', error);
      return 0;
    }
  };

  return {
    reminders,
    createReminder,
    getAllReminders,
    deleteReminder,
    toggleReminder,
    getTaskReminders,
    cleanExpiredReminders,
  };
};