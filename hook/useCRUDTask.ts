import { storageService, StorageKeys } from '@/services/storageService';
import { TaskList } from './useCRUDList'; // Reutilizamos la interfaz de la lista

// --- Interfaces de Props para las funciones del hook ---
interface PropsUpdateTask {
    listId: string;
    taskIndex: number;
    newTitle: string;
}

interface PropsToggleTask {
    listId: string;
    taskIndex: number;
}

interface PropsRemoveTask {
    listId: string;
    taskIndex: number;
}

// --- Hook principal ---
export const useCRUDTask = () => {

    const UpdateTask = async ({ listId, taskIndex, newTitle }: PropsUpdateTask) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            listToUpdate.tasks[taskIndex].title = newTitle;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const ToggleTaskCompleted = async ({ listId, taskIndex }: PropsToggleTask) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            const currentStatus = listToUpdate.tasks[taskIndex].isCompleted;
            listToUpdate.tasks[taskIndex].isCompleted = !currentStatus;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const removeTask = async ({ listId, taskIndex }: PropsRemoveTask) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate) {
            // Por ahora se elimina, pero la lógica de la papelera la agregaremos en un próximo paso
            listToUpdate.tasks.splice(taskIndex, 1);
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    return { UpdateTask, ToggleTaskCompleted, removeTask };
};