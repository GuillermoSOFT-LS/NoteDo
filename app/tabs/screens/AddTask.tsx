import React, { useEffect,useCallback, useState } from 'react';
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import { useCRUDList } from "@/hook/useCRUDList";
import {UiForm} from "@/components/UiForm";

interface TaskList {
    title: string;
    tasks: string[];
}

const AddTask = () => {
    const { title } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const { ShowList, AddTaskToList } = useCRUDList();
    const [listas, setListas] = useState<TaskList[]>([]);
    const [listIndex, setListIndex] = useState<number>(-1);

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [])
    );

    // Encuentra el índice de la lista actual por título
    useEffect(() => {
        const idx = listas.findIndex(l => l.title === title);
        setListIndex(idx);
    }, [listas, title]);

    const handleAddTask = () => {
        if (listIndex === -1) return;
        AddTaskToList({
            listIndex,
            taskTitle: titleTask,
            setTaskTitle: setTitleTask,
            setList: setListas
        });
        router.back()
    };

    return (
                    <UiForm
                        textBtn='Crear Tarea'
                        onPress={handleAddTask}
                        onChangeText={setTitleTask}
                        placeholder='Nombre de la tarea'
                        value={titleTask}
                        headerTitle='Crear Tarea'
                        iconBtn='add'/>


    );
};

export default AddTask;