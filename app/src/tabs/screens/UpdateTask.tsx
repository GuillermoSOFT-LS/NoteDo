import React, { useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {useLocalSearchParams, router} from "expo-router";
import {useCRUDTask} from "@/app/src/hook/useCRUDTask";



const UpdateTask = () => {

    const {index, title} = useLocalSearchParams()
    const [newTitle, setNewTitle] = useState(title as string);

    const { UpdateTask } = useCRUDTask();

    const handleSave = async () => {
        await UpdateTask({
            indice: Number(index),
            Item: newTitle
        });
        router.dismiss();
    };

    return (
        <UiView bgColor>
            <UiHeader title='Editar Tarea' icon='arrow-back' />

            <UiView bgColor margin>
                <UiViewAdd>
                    <UiTextinput
                        placeholder='Nuevo nombre de la tarea'
                        value={newTitle}
                        onChangeText={setNewTitle}
                    />
                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor='green'
                        text='Editar'
                        onPress={handleSave}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default UpdateTask
