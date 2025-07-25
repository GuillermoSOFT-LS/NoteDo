import React, { useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const STORAGE_KEY = 'taskLists'; // 🔑 Clave para AsyncStorage

const AddList = () => {
    const [listName, setListName] = useState('');

    const handleAddList = async () => {
        if (!listName.trim()) {
            Alert.alert('Nombre requerido', 'Por favor ingresa un nombre para la lista');
            return;
        }

        try {
            const existingLists = await AsyncStorage.getItem(STORAGE_KEY);
            const parsedLists = existingLists ? JSON.parse(existingLists) : [];

            const newList = {
                id: Date.now().toString(),
                name: listName.trim(),
            };

            const updatedLists = [...parsedLists, newList];

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));

            setListName('');
            Alert.alert('Éxito', 'Lista agregada correctamente');
        } catch (error) {
            console.error('Error al guardar la lista:', error);
            Alert.alert('Error', 'No se pudo guardar la lista');
        }
    };

    return (
        <UiView bgColor>
            <UiHeader title='Agregar Listas' icon='arrow-back' />

            <UiView bgColor margin>
                <UiViewAdd>
                    <UiTextinput
                        placeholder='Nombre de la nueva lista'
                        value={listName}
                        onChangeText={setListName}
                    />
                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor
                        text='Crear nueva lista'
                        onPress={handleAddList}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default AddList;
