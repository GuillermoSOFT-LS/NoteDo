import React, { useState } from 'react';
import {useLocalSearchParams, router} from "expo-router";
import {useCRUDTask} from "@/hook/useCRUDTask";
import {UiForm} from "@/components/UiForm";

const UpdateTask = () => {

    const {index, title, listId} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { UpdateTask } = useCRUDTask();

    const handleSave = async () => {
        await UpdateTask({
            listId: listId as string,
            taskIndex: Number(index),
            newTitle: newTitle
        });
        router.back();
    };

    return (
            <UiForm
                textBtn='Editar Tarea'
                onPress={handleSave}
                onChangeText={setNewTitle}
                placeholder='Nuevo nombre de la tarea'
                value={newTitle}
                headerTitle='Editar Tarea'
                iconBtn='create-outline'
            />
    );
};

export default UpdateTask;