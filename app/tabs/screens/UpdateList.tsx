import React, { useState } from 'react';
import {useCRUD} from "@/hooks/useCRUD";
import {useLocalSearchParams, router} from "expo-router";
import {UiForm} from "@/components/UiForm";



const UpdateList = () => {

    const {id, title} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { updateList } = useCRUD();

    const handleSave = async () => {
        await updateList({
            id: id as string,
            newTitle: newTitle
        });
        router.back();
    };

    return (

            <UiForm
                textBtn='Editar Lista'
                onPress={handleSave}
                onChangeText={setNewTitle}
                placeholder='Nuevo nombre de la lista'
                value={newTitle}
                headerTitle='Editar Lista'
                iconBtn='create-outline'
            />
    );
};

export default UpdateList
