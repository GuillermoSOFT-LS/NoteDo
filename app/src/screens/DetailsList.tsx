import React, { useCallback, useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiHeader } from "@/app/src/components/UiHeader";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UiText } from "@/app/src/components/UiText";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiCardList } from "@/app/src/components/UiCardList";
import { FlatList } from "react-native";
import { useCRUDList } from "@/app/src/hook/useCRUDList";
import {UiListEmpty} from "@/app/src/components/UiListEmpty";

interface TaskList {
    title: string;
    tasks: string[];
}

const DetailsList = () => {
    const { title } = useLocalSearchParams();
    const [titleTask, setTitleTask] = useState("");
    const { ShowList, AddTaskToList } = useCRUDList();
    const [listas, setListas] = useState<TaskList[]>([]);
    const [listIndex, setListIndex] = useState<number>(-1);

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [])
    );

    // Encuentra el índice de la lista actual por título
    React.useEffect(() => {
        const idx = listas.findIndex(l => l.title === title);
        setListIndex(idx);
    }, [listas, title]);

    const handleAddTask = () => {
        if (listIndex === -1) return;
        AddTaskToList({
            listIndex,
            taskTitle: titleTask,
            setTaskTitle: setTitleTask,
            setList: setListas
        });
    };

    const currentTasks = listIndex !== -1 ? listas[listIndex].tasks : [];

    return (
        <UiView bgColor>
            <UiHeader title={title as string} icon='arrow-back' />
            <UiView bgColor margin>
                <UiViewAdd style={{ paddingBottom: 10 }}>
                    <UiTextinput
                        placeholder='Nombre de la tarea'
                        value={titleTask}
                        onChangeText={setTitleTask}
                    />

                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor='green'
                        text='Crear Tarea'
                        onPress={handleAddTask}
                    />
                </UiViewAdd>
                <UiText color='gray' type='subTitle' style={{ paddingBottom: 30, paddingTop: 20 }}>Lista de Tareas</UiText>
                <FlatList
                    data={currentTasks}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title='No hay tareas creadas'/>}
                    renderItem={({ index, item }) => (
                        <UiCardList
                            titleList={item}
                            onPressUpdate={() => router.push({
                                pathname: '/src/screens/UpdateTask',
                                params: { title: item, index: index }
                            })}
                        />
                    )}
                />
            </UiView>
        </UiView>
    );
};

export default DetailsList;