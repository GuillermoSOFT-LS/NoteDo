import React, { useState } from 'react';
import {useCRUDList} from "@/hook/useCRUDList";
import {useLocalSearchParams, router} from "expo-router";
import {UiForm} from "@/components/UiForm";



const UpdateList = () => {

    const {index, title} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { UpdateList } = useCRUDList();

    const handleSave = async () => {
        await UpdateList({
            indice: Number(index),
            Item: newTitle
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
