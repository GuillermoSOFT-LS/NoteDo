import React, {useEffect, useCallback, useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiHeader } from "@/app/src/components/UiHeader";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UiText } from "@/app/src/components/UiText";
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
    const { ShowList } = useCRUDList();
    const [listas, setListas] = useState<TaskList[]>([]);
    const [listIndex, setListIndex] = useState<number>(-1);

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [ShowList] )
    );

    // Encuentra el índice de la lista actual por título
    useEffect(() => {
        const idx = listas.findIndex(l => l.title === title);
        if (idx !== listIndex) {
            setListIndex(idx);
        }
    }, [listas, title]);

    const currentTasks = listIndex !== -1 ? listas[listIndex].tasks : [];

    return (

        <>
            <UiView bgColor>
                <UiHeader title={title as string} icon='arrow-back' />
                <UiView bgColor margin>

                    <UiText color='gray' type='title' paddingB>Lista de Tareas</UiText>
                    <FlatList
                        data={currentTasks}
                        keyExtractor={(_, index) => index.toString()}
                        ListEmptyComponent={<UiListEmpty title='No hay tareas creadas'/>}
                        renderItem={({ index, item }) => (
                            <UiCardList
                                showChecked
                                titleList={item}
                                onPressUpdate={() => router.push({
                                    pathname: '/src/screens/UpdateTask',
                                    params: { title: item, index: index }
                                })}
                            />
                        )}
                    />

                    <UiButtton
                        bgColor='green'
                        color='white'
                        icon='add'
                        text='Add Task'
                        radius
                        onPress={()=> router.push({
                                pathname: '/src/screens/AddTask',
                                params: { title: title as string }
                            })}/>
                </UiView>
            </UiView>
        </>

    );
};

export default DetailsList;