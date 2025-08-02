import React, { useEffect, useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { UiView } from '@/components/UiView';
import { UiHeader } from '@/components/UiHeader';
import { UiText } from '@/components/UiText';
import { UiButtton } from '@/components/UiButtton';
import { UiCardList } from '@/components/UiCardList';
import { UiListEmpty } from '@/components/UiListEmpty';
import { useCRUDList } from '@/hook/useCRUDList';

// Actualizamos la estructura para que las tareas tengan fecha
interface Task {
    title: string;
    createdAt: string;
}

interface TaskList {
    title: string;
    createdAt: string;
    tasks: Task[];
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
        }, [ShowList])
    );

    useEffect(() => {
        const idx = listas.findIndex((l) => l.title === title);
        setListIndex(idx);
    }, [listas, title,listIndex]);

    const currentTasks = listIndex !== -1 ? listas[listIndex].tasks : [];

    return (
        <UiView bgColor>
            <UiHeader title={title as string} icon="arrow-back" />
            <UiView bgColor margin insetNull>
                <UiText color="gray" type="title" paddingB>
                    Lista de Tareas
                </UiText>

                <FlatList
                    data={currentTasks}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title="No hay tareas creadas" />}
                    renderItem={({ index, item }) => (
                        <UiCardList
                            showChecked
                            titleList={item.title}
                            createdAt={item.createdAt}
                            onPressUpdate={() =>
                                router.push({
                                    pathname: '/tabs/screens/UpdateTask',
                                    params: {
                                        title: item.title,
                                        index: index,
                                        listIndex: listIndex,
                                    },
                                })
                            }
                        />
                    )}
                />

                <UiButtton
                    bgColor="orange"
                    color="white"
                    icon="add"
                    text="Agregar Tarea"
                    radius
                    onPress={() =>
                        router.push({
                            pathname: '/tabs/screens/AddTask',
                            params: { title: title as string },
                        })
                    }
                />
            </UiView>
        </UiView>
    );
};

export default DetailsList;
