import React from 'react';
import { router } from 'expo-router';
import { storageService, StorageKeys } from '@/services/storageService';
import {
    Task,
    TaskList,
    AddListParams,
    ShowListParams,
    RemoveListParams,
    UpdateListParams,
    AddTaskParams
} from '@/types/interfaces';

// --- Hook principal ---
export const useCRUDList = () => {

    const AddList = async ({ title, setTitle }: AddListParams) => {
        if (title.trim() === '') {
            return alert('El campo no puede estar vacío');
        }

        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);

        // Validación de nombres de listas duplicados
        if (lists.some(list => list.title.toLowerCase() === title.toLowerCase())) {
            return alert('Ya existe una lista con este nombre.');
        }

        const newList: TaskList = {
            id: Date.now().toString(), // Generamos un ID único simple
            title,
            createdAt: new Date().toISOString(),
            tasks: [],
        };
        const updatedLists = [newList, ...lists];
        setTitle('');
        await storageService.set(StorageKeys.LISTS, updatedLists);
        router.back();
    };

    const ShowList = async ({ setList }: ShowListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        setList(lists);
    };

    const removeList = async ({ id, setList }: RemoveListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);

        // Preparando el código para la papelera:
        // Por ahora, borramos. En el próximo paso, lo movemos.
        const updatedLists = lists.filter(list => list.id !== id);

        await storageService.set(StorageKeys.LISTS, updatedLists);
        setList(updatedLists);
    };

    const UpdateList = async ({ id, newTitle }: UpdateListParams) => {
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

    const AddTaskToList = async ({ listId, taskTitle, setTaskTitle }: AddTaskParams) => {
        if (taskTitle.trim() === '') {
            return alert('El campo no puede estar vacío');
        }

        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listIndex = lists.findIndex(list => list.id === listId);

        if (listIndex !== -1) {
            const newTask: Task = {
                id: Date.now().toString(), // Agregamos ID único para las tareas
                title: taskTitle,
                isCompleted: false, // Por defecto, la tarea no está completada
                createdAt: new Date().toISOString(),
            };

            lists[listIndex].tasks.unshift(newTask);
            await storageService.set(StorageKeys.LISTS, lists);
            setTaskTitle('');
        }
    };

    return { AddList, ShowList, removeList, UpdateList, AddTaskToList };
};