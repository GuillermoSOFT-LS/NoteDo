import { UiForm } from "@/components/UiForm";
import { useCRUD } from "@/hooks/useCRUD";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';

const AddTask = () => {
    const { listId } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const { addTaskToList } = useCRUD();

    const handleAddTask = async () => {
        if (!listId) return;
        await addTaskToList({
            listId: listId as string,
            taskTitle: titleTask,
            setTaskTitle: setTitleTask
        });
        
        router.replace({
            pathname: "/tabs/screens/DetailsList",
            params: {
                listId: listId as string,
            },
        });
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