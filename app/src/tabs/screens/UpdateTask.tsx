import React, { useState } from 'react';
import {useLocalSearchParams, router} from "expo-router";
import {useCRUDTask} from "@/app/src/hook/useCRUDTask";
import UiForm from "@/app/src/components/UiForm";

const UpdateTask = () => {

    const {index, title,listIndex} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { UpdateTask } = useCRUDTask();

    const handleSave = async () => {
        await UpdateTask({
            listIndex: Number(listIndex),
            taskIndex: Number(index),
            Newtitle: newTitle
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