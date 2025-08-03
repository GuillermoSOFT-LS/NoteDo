import React from 'react';
import { router } from 'expo-router';
import { storageService, StorageKeys } from '@/services/storageService';
import { 
    Task, 
    TaskList, 
    TrashItem,
    AddListParams, 
    ShowListParams, 
    RemoveListParams, 
    UpdateListParams, 
    AddTaskParams,
    UpdateTaskParams,
    ToggleTaskParams,
    RemoveTaskParams,
    ItemType
} from '@/types/interfaces';
import { uuid } from 'uuidv4';

export const useCRUD = () => {
    
    // ========== FUNCIONES DE LISTAS ==========
    
    const addList = async ({ title, setTitle }: AddListParams) => {
        if (title.trim() === '') {
            return alert('El campo no puede estar vacío');
        }

        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);

        // Validación de nombres de listas duplicados
        if (lists.some(list => list.title.toLowerCase() === title.toLowerCase())) {
            return alert('Ya existe una lista con este nombre.');
        }

        const newList: TaskList = {
            id: uuid(),
            title,
            createdAt: new Date().toISOString(),
            tasks: [],
        };
        
        const updatedLists = [newList, ...lists];
        setTitle('');
        await storageService.set(StorageKeys.LISTS, updatedLists);
        router.back();
    };

    const showLists = async ({ setList }: ShowListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        setList(lists);
    };

    const updateList = async ({ id, newTitle }: UpdateListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === id);

        if (listToUpdate) {
            // Validación de nombres de listas duplicados
            if (lists.some(list => list.title.toLowerCase() === newTitle.toLowerCase() && list.id !== id)) {
                return alert('Ya existe una lista con este nombre.');
            }
            listToUpdate.title = newTitle;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const removeList = async ({ id, setList }: RemoveListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToRemove = lists.find(list => list.id === id);
        
        if (!listToRemove) return;

        // Crear item de papelera
        const trashItem: TrashItem = {
            id: uuid(),
            originalId: listToRemove.id,
            type: ItemType.LIST,
            data: listToRemove,
            deletedAt: new Date().toISOString(),
        };

        // Mover a papelera
        await storageService.moveToTrash(trashItem);

        // Remover de listas activas
        const updatedLists = lists.filter(list => list.id !== id);
        await storageService.set(StorageKeys.LISTS, updatedLists);
        setList(updatedLists);
    };

    // ========== FUNCIONES DE TAREAS ==========

    const addTaskToList = async ({ listId, taskTitle, setTaskTitle }: AddTaskParams) => {
        if (taskTitle.trim() === '') {
            return alert('El campo no puede estar vacío');
        }

        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listIndex = lists.findIndex(list => list.id === listId);

        if (listIndex !== -1) {
            const newTask: Task = {
                id: uuid(),
                title: taskTitle,
                isCompleted: false,
                createdAt: new Date().toISOString(),
            };

            lists[listIndex].tasks.unshift(newTask);
            await storageService.set(StorageKeys.LISTS, lists);
            setTaskTitle('');
        }
    };

    const updateTask = async ({ listId, taskIndex, newTitle }: UpdateTaskParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            listToUpdate.tasks[taskIndex].title = newTitle;
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    const toggleTaskCompleted = async ({ listId, taskIndex }: ToggleTaskParams) => {
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

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            const taskToRemove = listToUpdate.tasks[taskIndex];

            // Crear item de papelera
            const trashItem: TrashItem = {
                id: uuid(),
                originalId: taskToRemove.id,
                type: ItemType.TASK,
                data: taskToRemove,
                deletedAt: new Date().toISOString(),
                parentListId: listId,
            };

            // Mover a papelera
            await storageService.moveToTrash(trashItem);

            // Remover de la lista
            listToUpdate.tasks.splice(taskIndex, 1);
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    // ========== FUNCIONES DE PAPELERA ==========

    const getTrashItems = async (type?: 'list' | 'task') => {
        if (type === 'list') {
            return await storageService.get<TrashItem>(StorageKeys.TRASH_LISTS);
        } else if (type === 'task') {
            return await storageService.get<TrashItem>(StorageKeys.TRASH_TASKS);
        } else {
            const trashLists = await storageService.get<TrashItem>(StorageKeys.TRASH_LISTS);
            const trashTasks = await storageService.get<TrashItem>(StorageKeys.TRASH_TASKS);
            return [...trashLists, ...trashTasks].sort((a, b) => 
                new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
            );
        }
    };

    const restoreFromTrash = async (itemId: string, type: 'list' | 'task') => {
        const restoredItem = await storageService.restoreFromTrash(itemId, type);
        
        if (!restoredItem) return false;

        if (type === 'list') {
            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            lists.unshift(restoredItem.data as TaskList);
            await storageService.set(StorageKeys.LISTS, lists);
        } else if (type === 'task' && restoredItem.parentListId) {
            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const parentList = lists.find(list => list.id === restoredItem.parentListId);
            
            if (parentList) {
                parentList.tasks.unshift(restoredItem.data as Task);
                await storageService.set(StorageKeys.LISTS, lists);
            }
        }

        return true;
    };

    const deleteFromTrashPermanently = async (itemId: string, type: 'list' | 'task') => {
        return await storageService.deleteFromTrash(itemId, type);
    };

    return {
        // Funciones de listas
        addList,
        showLists,
        updateList,
        removeList,
        
        // Funciones de tareas
        addTaskToList,
        updateTask,
        toggleTaskCompleted,
        removeTask,
        
        // Funciones de papelera
        getTrashItems,
        restoreFromTrash,
        deleteFromTrashPermanently,
    };
};