import React, { useState } from 'react';
import {useLocalSearchParams, router} from "expo-router";
import {useCRUD} from "@/hooks/useCRUD";
import {UiForm} from "@/components/UiForm";

const UpdateTask = () => {

    const {index, title, listId} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { updateTask } = useCRUD();

    const handleSave = async () => {
        await updateTask({
            listId: listId as string,
            taskIndex: Number(index),
            newTitle: newTitle
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