import { storageService, StorageKeys } from '@/services/storageService';
import {
    TaskList,
    UpdateTaskParams,
    ToggleTaskParams,
    RemoveTaskParams
} from '@/types/interfaces';

// --- Hook principal ---
export const useCRUDTask = () => {

    const UpdateTask = async ({ listId, taskIndex, newTitle }: UpdateTaskParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            listToUpdate.tasks[taskIndex].title = newTitle;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const ToggleTaskCompleted = async ({ listId, taskIndex }: ToggleTaskParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            const currentStatus = listToUpdate.tasks[taskIndex].isCompleted;
            listToUpdate.tasks[taskIndex].isCompleted = !currentStatus;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const removeTask = async ({ listId, taskIndex }: RemoveTaskParams) => {
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