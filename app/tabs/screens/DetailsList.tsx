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
import { useCRUDTask } from '@/hook/useCRUDTask';
import { TaskList, Task } from '@/types/interfaces';

const DetailsList = () => {
    // Ahora esperamos el 'id' de la lista en lugar del 'title'
    const { listId, title } = useLocalSearchParams();

    const { ShowList } = useCRUDList();
    const { removeTask, ToggleTaskCompleted } = useCRUDTask(); // Usamos las funciones del nuevo hook de tareas

    const [lists, setLists] = useState<TaskList[]>([]);
    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);

    // Usamos useFocusEffect para cargar las listas cada vez que la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setLists });
            };
            loadList();
        }, [ShowList])
    );

    // useEffect para actualizar las tareas cuando las listas cambian
    useEffect(() => {
        if (listId) {
            const list = lists.find((l) => l.id === listId);
            if (list) {
                setCurrentTasks(list.tasks);
            }
        }
    }, [lists, listId]);

    // Función para manejar el estado del checkbox
    const handleToggleTask = (taskIndex: number) => {
        if (listId) {
            ToggleTaskCompleted({ listId: listId as string, taskIndex });
        }
    };

    // Función para manejar la eliminación de tareas
    const handleRemoveTask = (taskIndex: number) => {
        if (listId) {
            removeTask({ listId: listId as string, taskIndex });
        }
    };

    return (
        <UiView bgColor>
            <UiHeader title={title as string} icon="arrow-back" />
            <UiView bgColor margin insetNull>
                <UiText color="gray" type="title" paddingB>
                    Lista de tareas
                </UiText>
                <FlatList
                    data={currentTasks}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title="No hay tareas creadas" />}
                    renderItem={({ index, item }) => (
                        <UiCardList
                            titleList={item.title}
                            createdAt={item.createdAt}
                            showChecked={true}
                            isChecked={item.isCompleted}
                            onPressCheck={() => handleToggleTask(index)}
                            onPressRemove={() => handleRemoveTask(index)}
                            onLongPress={() => {
                                console.log(`Tarea ${index} seleccionada`);
                            }}
                            onPressUpdate={() =>
                                router.push({
                                    pathname: '/tabs/screens/UpdateTask',
                                    params: {
                                        title: item.title,
                                        index: index,
                                        listId: listId,
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
                    text="Agregar tarea"
                    radius
                    onPress={() =>
                        router.push({
                            pathname: '/tabs/screens/AddTask',
                            params: {
                                listId: listId,
                            },
                        })
                    }
                />
            </UiView>
        </UiView>
    );
};

export default DetailsList;