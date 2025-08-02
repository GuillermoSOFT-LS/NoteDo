// src/hook/useCRUDList.ts
import React from "react";
import { useFecht } from "@/hook/useFecht";
import { router } from "expo-router";

interface Task {
    title: string;
    createdAt: string;
}

export interface TaskList {
    title: string;
    createdAt: string;
    tasks: Task[];
}

interface PropsAdd {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

interface PropsShow {
    setList: React.Dispatch<React.SetStateAction<TaskList[]>>;
}

interface PropsRemove extends PropsShow {
    indice: number;
}

interface PropsUpdate {
    indice: number;
    Item: string;
}

interface PropsAddTask {
    listIndex: number;
    taskTitle: string;
    setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
    setList: React.Dispatch<React.SetStateAction<TaskList[]>>;
}

export const useCRUDList = () => {
    const { handleUpdateList, handleReadList } = useFecht({ STORAGE_KEY: 'NoteList' });

    const normalizeList = (data: any): TaskList[] => {
        if (!Array.isArray(data)) return [];
        return data.map((item: any) => ({
            title: item.title,
            createdAt: item.createdAt || new Date().toISOString(),
            tasks: (item.tasks || []).map((t: any) => ({
                title: t.title || t,
                createdAt: t.createdAt || new Date().toISOString(),
            })),
        }));
    };

    const AddList = async ({ title, setTitle }: PropsAdd) => {
        if (title.trim() === "") return alert("El campo no puede estar vacío");
        const lista: TaskList[] = normalizeList(await handleReadList());
        const nuevaLista: TaskList = {
            title,
            createdAt: new Date().toISOString(),
            tasks: [],
        };
        const updated = [nuevaLista, ...lista];
        setTitle("");
        await handleUpdateList(updated);
        router.back();
    };

    const ShowList = async ({ setList }: PropsShow) => {
        const lista: TaskList[] = normalizeList(await handleReadList());
        setList(lista);
    };

    const removeList = async ({ indice, setList }: PropsRemove) => {
        const lista: TaskList[] = normalizeList(await handleReadList());
        lista.splice(indice, 1);
        await handleUpdateList(lista);
        setList(lista);
    };

    const UpdateList = async ({ indice, Item }: PropsUpdate) => {
        const lista: TaskList[] = normalizeList(await handleReadList());
        if (lista[indice]) {
            lista[indice].title = Item;
            await handleUpdateList(lista);
        }
    };

    const AddTaskToList = async ({ listIndex, taskTitle, setTaskTitle, setList }: PropsAddTask) => {
        if (taskTitle.trim() === "") return alert("El campo no puede estar vacío");
        const lista: TaskList[] = normalizeList(await handleReadList());
        lista[listIndex].tasks.unshift({ title: taskTitle, createdAt: new Date().toISOString() });
        await handleUpdateList(lista);
        setTaskTitle("");
        setList([...lista]);
    };

    return { AddList, ShowList, removeList, UpdateList, AddTaskToList };
};