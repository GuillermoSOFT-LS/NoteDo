import React, { useState } from 'react';
import {router, useLocalSearchParams} from "expo-router";
import { useCRUD } from "@/hooks/useCRUD";
import {UiForm} from "@/components/UiForm";

const AddTask = () => {
    const { listId } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const { addTaskToList } = useCRUD();

    const handleAddTask = () => {
        if (!listId) return;
        addTaskToList({
            listId: listId as string,
            taskTitle: titleTask,
            setTaskTitle: setTitleTask
        });
        router.back();
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