import React from "react";
import { useFecht } from "@/hook/useFecht";
import { router } from "expo-router";

interface TaskList {
    title: string;
    tasks: string[];
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

    // Normaliza los datos leídos para asegurar TaskList[]
    const normalizeList = (data: any): TaskList[] => {
        if (!Array.isArray(data)) return [];
        if (data.length > 0 && typeof data[0] === "string") {
            // Migrar de string[] a TaskList[]
            return data.map((title: string) => ({ title, tasks: [] }));
        }
        return data as TaskList[];
    };

    const AddList = async ({ title, setTitle }: PropsAdd) => {
        if (title.trim() === "") {
            alert('El campo no puede estar vacio');
            return;
        }
        let lista: TaskList[] = normalizeList(await handleReadList());
        lista =[{ title, tasks: [] }, ...lista];
        setTitle("");
        handleUpdateList(lista);
        router.back();
    };

    const ShowList = async ({ setList }: PropsShow) => {
        const lista: TaskList[] = normalizeList(await handleReadList());
        setList(lista);
    };

    const removeList = async ({ indice, setList }: PropsRemove) => {
        let lista: TaskList[] = normalizeList(await handleReadList());
        lista.splice(indice, 1);
        handleUpdateList(lista);
        setList(lista);
    };

    const UpdateList = async ({ indice, Item }: PropsUpdate) => {
        let lista: TaskList[] = normalizeList(await handleReadList());
        lista[indice].title = Item;
        await handleUpdateList(lista);
    };

    const AddTaskToList = async ({ listIndex, taskTitle, setTaskTitle, setList }: PropsAddTask) => {
        if (taskTitle.trim() === "") {
            alert('El campo no puede estar vacio');
            return;
        }
        let lista: TaskList[] = normalizeList(await handleReadList());
        lista[listIndex].tasks.push(taskTitle);
        setTaskTitle("");
        await handleUpdateList(lista);
        setList([...lista]);
    };

    return {
        AddList,
        ShowList,
        removeList,
        UpdateList,
        AddTaskToList
    };
};