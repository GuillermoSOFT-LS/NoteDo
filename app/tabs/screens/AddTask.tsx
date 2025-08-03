import React, { useEffect,useCallback, useState } from 'react';
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import { useCRUDList } from "@/hook/useCRUDList";
import {UiForm} from "@/components/UiForm";
import { TaskList } from "@/types/interfaces";

const AddTask = () => {
    const { listId } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const { AddTaskToList } = useCRUDList();

    const handleAddTask = () => {
        if (!listId) return;
        AddTaskToList({
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