import React from "react";
import { useFecht } from "@/hook/useFecht";

interface Task {
    title: string;
    createdAt: string;
}

interface TaskList {
    title: string;
    createdAt: string;
    tasks: Task[];
}

interface PropsAdd {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

interface PropsShow {
    setList: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface PropsRemove extends PropsShow {
    indice: number;
}

interface PropsUpdate {
    listIndex: number;
    taskIndex: number;
    Newtitle: string;
}

export const useCRUDTask = () => {
    const { handleUpdateList, handleReadList } = useFecht({ STORAGE_KEY: "NoteList" });

    // Agregar una nueva tarea a la última lista (si decides usarlo)
    const AddTask = async ({ title, setTitle }: PropsAdd) => {
        if (title.trim() === "") {
            alert("El campo no puede estar vacío");
            return;
        }

        const listas: TaskList[] = await handleReadList();

        if (listas.length === 0) return;

        listas[listas.length - 1].tasks = [
            { title, createdAt: new Date().toISOString() },
            ...listas[listas.length - 1].tasks,
        ];

        setTitle("");
        await handleUpdateList(listas);
    };

    // Mostrar tareas (array plano)
    const ShowTask = async ({ setList }: PropsShow) => {
        const listas: TaskList[] = await handleReadList();
        const allTasks = listas.flatMap((l) => l.tasks);
        setList(allTasks);
    };

    // Eliminar una tarea por índice (en la última lista)
    const removeTask = async ({ indice, setList }: PropsRemove) => {
        const listas: TaskList[] = await handleReadList();

        if (listas.length === 0) return;

        listas[listas.length - 1].tasks.splice(indice, 1);

        await handleUpdateList(listas);
        setList(listas[listas.length - 1].tasks);
    };

    // Actualizar el título de una tarea
    const UpdateTask = async ({ listIndex, taskIndex, Newtitle }: PropsUpdate) => {
        const listas: TaskList[] = await handleReadList();

        if (!listas[listIndex]) return;
        if (!listas[listIndex].tasks[taskIndex]) return;

        listas[listIndex].tasks[taskIndex].title = Newtitle;

        await handleUpdateList(listas);
    };

    return {
        AddTask,
        ShowTask,
        removeTask,
        UpdateTask,
    };
};

export default useCRUDTask;
