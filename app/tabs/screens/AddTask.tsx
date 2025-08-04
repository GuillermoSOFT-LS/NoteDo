import { UiButtton } from "@/components/UiButtton";
import { UiHeader } from "@/components/UiHeader";
import { UiView } from "@/components/UiView";
import { UiViewAdd } from "@/components/UiViewAdd";
import { useCRUD } from "@/hooks/useCRUD";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from "react-native-paper";

const AddTask = () => {
    const { listId } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const [descriptionTask, setDescriptionTask] = useState("");
    const { addTaskToList } = useCRUD();

    const handleAddTask = async () => {
        if (!listId) return;
        await addTaskToList({
            listId: listId as string,
            taskTitle: titleTask,
            taskDescription: descriptionTask,
            setTaskTitle: setTitleTask,
            setTaskDescription: setDescriptionTask
        });
        
        router.replace({
            pathname: "/tabs/screens/DetailsList",
            params: {
                listId: listId as string,
            },
        });
    };

    return (
        <UiView bgColor>
            <UiHeader title="Crear Tarea" icon='arrow-back' />

            <UiView bgColor margin insetNull>
                <UiViewAdd>
                    <TextInput
                        mode="outlined"
                        label="Nombre de la tarea"
                        right={<TextInput.Affix text="/100" />}
                        value={titleTask}
                        onChangeText={setTitleTask}
                        textColor='#D8D8D8'
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: 'orange',
                            },
                        }}
                    />

                    <TextInput
                        mode="outlined"
                        label="Descripción (opcional)"
                        value={descriptionTask}
                        onChangeText={setDescriptionTask}
                        textColor='#D8D8D8'
                        style={styles.input}
                        multiline
                        numberOfLines={10}
                        theme={{
                            colors: {
                                primary: 'orange',
                            },
                        }}
                    />

                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor='orange'
                        text='Crear Tarea'
                        onPress={handleAddTask}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#000',
        marginBottom: 10,
    },
});

export default AddTask;