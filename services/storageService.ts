import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrashItem } from '@/types/interfaces';

export const StorageKeys = {
    LISTS: 'NoteList',
    TRASH_LISTS: 'NoteTrashLists',
    TRASH_TASKS: 'NoteTrashTasks',
    REMINDERS: 'NoteReminders',
} as const;

export const storageService = {
    // Método genérico para obtener datos
    async get<T>(key: string): Promise<T[]> {
        try {
            const value = await AsyncStorage.getItem(key);
            if (!value) return [];
            return JSON.parse(value);
        } catch (error) {
            console.error(`Error getting data from ${key}:`, error);
            return [];
        }
    },

    // Método genérico para guardar datos
    async set<T>(key: string, data: T[]): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data to ${key}:`, error);
            throw error;
        }
    },

    // Método para limpiar una key específica
    async clear(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error clearing ${key}:`, error);
            throw error;
        }
    },

    // Método específico para mover elementos a papelera
    async moveToTrash(item: TrashItem): Promise<void> {
        try {
            const trashKey = item.type === 'list' ? StorageKeys.TRASH_LISTS : StorageKeys.TRASH_TASKS;
            const trashItems = await this.get<TrashItem>(trashKey);
            trashItems.unshift(item);
            await this.set(trashKey, trashItems);
        } catch (error) {
            console.error('Error moving item to trash:', error);
            throw error;
        }
    },

    // Método específico para restaurar elementos de papelera
    async restoreFromTrash(itemId: string, type: 'list' | 'task'): Promise<TrashItem | null> {
        try {
            const trashKey = type === 'list' ? StorageKeys.TRASH_LISTS : StorageKeys.TRASH_TASKS;
            const trashItems = await this.get<TrashItem>(trashKey);
            const itemIndex = trashItems.findIndex(item => item.id === itemId);
            
            if (itemIndex === -1) return null;
            
            const [restoredItem] = trashItems.splice(itemIndex, 1);
            await this.set(trashKey, trashItems);
            
            return restoredItem;
        } catch (error) {
            console.error('Error restoring item from trash:', error);
            throw error;
        }
    },

    // Método específico para eliminar permanentemente de papelera
    async deleteFromTrash(itemId: string, type: 'list' | 'task'): Promise<boolean> {
        try {
            const trashKey = type === 'list' ? StorageKeys.TRASH_LISTS : StorageKeys.TRASH_TASKS;
            const trashItems = await this.get<TrashItem>(trashKey);
            const filteredItems = trashItems.filter(item => item.id !== itemId);
            
            if (filteredItems.length === trashItems.length) return false;
            
            await this.set(trashKey, filteredItems);
            return true;
        } catch (error) {
            console.error('Error deleting item from trash:', error);
            throw error;
        }
    },

    // Método para limpiar elementos antiguos de papelera (opcional)
    async cleanOldTrashItems(daysOld: number = 30): Promise<void> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            for (const trashKey of [StorageKeys.TRASH_LISTS, StorageKeys.TRASH_TASKS]) {
                const trashItems = await this.get<TrashItem>(trashKey);
                const filteredItems = trashItems.filter(item => 
                    new Date(item.deletedAt) > cutoffDate
                );
                await this.set(trashKey, filteredItems);
            }
        } catch (error) {
            console.error('Error cleaning old trash items:', error);
            throw error;
        }
    }
};
