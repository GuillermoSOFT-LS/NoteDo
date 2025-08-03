import { UiButtton } from '@/components/UiButtton';
import { UiCardList } from '@/components/UiCardList';
import { UiHeader } from '@/components/UiHeader';
import { UiListEmpty } from '@/components/UiListEmpty';
import { UiText } from '@/components/UiText';
import { UiView } from '@/components/UiView';
import { UiViewAdd } from '@/components/UiViewAdd';
import { useCRUD } from '@/hooks/useCRUD';
import { Task, TaskList } from '@/types/interfaces';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';


const DetailsList = () => {
    // Ahora esperamos el 'id' de la lista en lugar del 'title'
    const { listId, title } = useLocalSearchParams();

    const { showLists, removeTask, toggleTaskCompleted } = useCRUD();


    const [lists, setLists] = useState<TaskList[]>([]);
    const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Usamos useFocusEffect para cargar las listas cada vez que la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await showLists({ setList: setLists });
            };
            loadList();
        }, [])
    );

    // Recargar cuando cambie listId (para detectar navegación desde AddTask)
    useEffect(() => {
        if (listId) {
            const loadList = async () => {
                await showLists({ setList: setLists });
            };
            loadList();
        }
    }, [listId]);

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
    const handleToggleTask = useCallback(async (taskIndex: number) => {
        if (listId) {
            await toggleTaskCompleted({ listId: listId as string, taskIndex });
            // Recargar las listas después de la acción
            await showLists({ setList: setLists });
        }
    }, [listId, toggleTaskCompleted, showLists]);

    // Función para manejar la eliminación de tareas
    const handleRemoveTask = useCallback(async (taskIndex: number) => {
        if (listId) {
            await removeTask({ listId: listId as string, taskIndex });
            // Recargar las listas después de la acción
            await showLists({ setList: setLists });
        }
    }, [listId, removeTask, showLists]);

    const handleLongPress = (taskIndex: number) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedTasks([taskIndex]);
        } else {
            toggleTaskSelection(taskIndex);
        }
    };

    const toggleTaskSelection = (taskIndex: number) => {
        setSelectedTasks(prev =>
            prev.includes(taskIndex)
                ? prev.filter(index => index !== taskIndex)
                : [...prev, taskIndex]
        );
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedTasks([]);
    };

    const handleBulkDeleteTasks = async () => {
        // Ordenar índices de mayor a menor para eliminar correctamente
        const sortedIndexes = selectedTasks.sort((a, b) => b - a);
        
        if (listId) {
            for (const taskIndex of sortedIndexes) {
                await removeTask({ listId: listId as string, taskIndex });
            }
            // Recargar las listas después de eliminar todas las tareas
            await showLists({ setList: setLists });
        }
        exitSelectionMode();
    };

    return (
        <UiView bgColor>
            <UiHeader
                title={isSelectionMode ? `${selectedTasks.length} seleccionadas` : title as string}
                icon="arrow-back"
            />
            <UiView bgColor margin insetNull>
                {!isSelectionMode && (
                    <UiText color="gray" type="title" paddingB>
                        Lista de tareas
                    </UiText>
                )}

                {isSelectionMode && (
                    <>
                        <UiViewAdd justifyContent="center" flexRow paddingB="lg">
                            <UiButtton
                                color="orange"
                                bgColor="transparent"
                                border
                                icon="close"
                                text="Cancelar"
                                onPress={exitSelectionMode}
                            />
                    
                            <UiButtton
                                color="white"
                                bgColor="red"
                                icon="trash"
                                text={`Eliminar ${selectedTasks.length} tareas`}
                                onPress={handleBulkDeleteTasks}
                            />
                        </UiViewAdd>
                    </>
                )}
                <FlatList
                    data={currentTasks}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title="No hay tareas creadas" />}
                    renderItem={({ index, item }) => {
                        const isSelected = selectedTasks.includes(index);
                        return (
                            <UiCardList
                                titleList={item.title}
                                createdAt={item.createdAt}
                                showChecked={!isSelectionMode}
                                isChecked={item.isCompleted}
                                isSelected={isSelected}
                                onPressCheck={!isSelectionMode ? () => handleToggleTask(index) : undefined}
                                onLongPress={() => handleLongPress(index)}
                                onPressUpdate={!isSelectionMode ? () =>
                                    router.push({
                                        pathname: '/tabs/screens/UpdateTask',
                                        params: {
                                            title: item.title,
                                            index: index,
                                            listId: listId,
                                        },
                                    }) : undefined
                                }
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleTaskSelection(index);
                                    } else {
                                        router.push({
                                            pathname: '/tabs/screens/AddReminder',
                                            params: {
                                                taskId: item.id,
                                                taskTitle: item.title,
                                            },
                                        });
                                    }
                                }}
                            />
                        );
                    }}
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