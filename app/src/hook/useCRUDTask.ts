import React from "react";
import { useFecht } from "@/app/src/hook/useFecht";

// La estructura de cada lista
interface TaskList {
    title: string;
    tasks: string[];
}

interface PropsAdd {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

interface PropsShow {
    setList: React.Dispatch<React.SetStateAction<string[]>>;
}

interface PropsRemove extends PropsShow {
    indice: number;
}

interface PropsUpdate {
    listIndex: number;     // índice de la lista principal (TaskList[])
    taskIndex: number;     // índice de la tarea dentro de esa lista
    Newtitle: string;      // nuevo nombre de la tarea
}

export const useCRUDTask = () => {
    // ATENCIÓN: usamos el mismo STORAGE_KEY que useCRUDList
    const { handleUpdateList, handleReadList } = useFecht({ STORAGE_KEY: "NoteList" });

    // Agregar una nueva tarea a una lista
    const AddTask = async ({ title, setTitle }: PropsAdd) => {
        if (title.trim() === "") {
            alert("El campo no puede estar vacío");
            return;
        }

        const listas: TaskList[] = await handleReadList();

        // Suponemos que se quiere agregar a la última lista (esto deberías adaptar según tu lógica)
        if (listas.length === 0) return;

        listas[listas.length - 1].tasks.push(title);

        setTitle("");
        await handleUpdateList(listas);
    };

    // Mostrar tareas (como array plano)
    const ShowTask = async ({ setList }: PropsShow) => {
        const listas: TaskList[] = await handleReadList();
        const allTasks = listas.flatMap((l) => l.tasks);
        setList(allTasks);
    };

    // Eliminar una tarea por índice
    const removeTask = async ({ indice, setList }: PropsRemove) => {
        const listas: TaskList[] = await handleReadList();

        // Aquí también deberías especificar en qué lista se está borrando
        if (listas.length === 0) return;

        listas[listas.length - 1].tasks.splice(indice, 1); // <- adáptalo según sea necesario

        await handleUpdateList(listas);
        setList(listas[listas.length - 1].tasks);
    };

    // Actualizar el nombre de una tarea
    const UpdateTask = async ({ listIndex, taskIndex, Newtitle }: PropsUpdate) => {
        const listas: TaskList[] = await handleReadList();

        if (!listas[listIndex]) return;
        if (!listas[listIndex].tasks[taskIndex]) return;

        listas[listIndex].tasks[taskIndex] = Newtitle;

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
