import React from 'react';
import { router } from 'expo-router';
import { storageService, StorageKeys } from '@/services/storageService';

// --- Interfaces y Tipos (centralizaremos esto más adelante) ---
export interface Task {
    title: string;
    isCompleted: boolean; // Agregamos el estado de completado
    createdAt: string;
}

export interface TaskList {
    id: string; // Agregamos un ID único para cada lista
    title: string;
    createdAt: string;
    tasks: Task[];
}

// --- Interfaces de Props para las funciones del hook ---
interface PropsAdd {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

interface PropsShow {
    setList: React.Dispatch<React.SetStateAction<TaskList[]>>;
}

interface PropsRemove extends PropsShow {
    id: string; // Usaremos el ID para eliminar, no el índice
}

interface PropsUpdate {
    id: string;
    newTitle: string;
}

interface PropsAddTask {
    listId: string;
    taskTitle: string;
    setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
}

// --- Hook principal ---
export const useCRUDList = () => {

    const AddList = async ({ title, setTitle }: PropsAdd) => {
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

    const ShowList = async ({ setList }: PropsShow) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        setList(lists);
    };

    const removeList = async ({ id, setList }: PropsRemove) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);

        // Preparando el código para la papelera:
        // Por ahora, borramos. En el próximo paso, lo movemos.
        const updatedLists = lists.filter(list => list.id !== id);

        await storageService.set(StorageKeys.LISTS, updatedLists);
        setList(updatedLists);
    };

    const UpdateList = async ({ id, newTitle }: PropsUpdate) => {
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

    const AddTaskToList = async ({ listId, taskTitle, setTaskTitle }: PropsAddTask) => {
        if (taskTitle.trim() === '') {
            return alert('El campo no puede estar vacío');
        }

        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listIndex = lists.findIndex(list => list.id === listId);

        if (listIndex !== -1) {
            const newTask: Task = {
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