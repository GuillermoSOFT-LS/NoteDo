import { UiButtton } from '@/components/UiButtton';
import { UiHeader } from '@/components/UiHeader';
import { UiText } from '@/components/UiText';
import { UiView } from '@/components/UiView';
import { UiViewAdd } from '@/components/UiViewAdd';
import { useCRUD } from '@/hooks/useCRUD';
import { Task, TaskList } from '@/types/interfaces';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Portal, FAB, Provider as PaperProvider} from 'react-native-paper';
import banner from "react-native-paper/src/components/Banner";

const TaskDetails = () => {
    const { listId, taskIndex } = useLocalSearchParams();
    const { showLists, updateTask } = useCRUD();

    const [lists, setLists] = useState<TaskList[]>([]);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // FAB.Group
    const [open, setOpen] = useState(false);
    const onStateChange = ({ open }: { open: boolean }) => setOpen(open);

    // Cargar datos cuando la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                await showLists({ setList: setLists });
            };
            loadData();
        }, [])
    );

    // Encontrar la tarea actual cuando las listas cambian
    React.useEffect(() => {
        if (listId && taskIndex !== undefined && lists.length > 0) {
            const list = lists.find(l => l.id === listId);
            if (list && list.tasks[Number(taskIndex)]) {
                const task = list.tasks[Number(taskIndex)];
                setCurrentTask(task);
                setEditTitle(task.title);
                setEditDescription(task.description || '');
            }
        }
    }, [lists, listId, taskIndex]);

    const handleSaveChanges = async () => {
        if (!listId || taskIndex === undefined || !currentTask) return;

        try {
            await updateTask({
                listId: listId as string,
                taskIndex: Number(taskIndex),
                newTitle: editTitle,
                newDescription: editDescription,
            });

            await showLists({ setList: setLists });
            setIsEditing(false);
            Alert.alert('Éxito', 'Tarea actualizada correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la tarea');
        }
    };

    const handleCancelEdit = () => {
        if (currentTask) {
            setEditTitle(currentTask.title);
            setEditDescription(currentTask.description || '');
        }
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatReminderDate = (dateStr: string, timeStr: string) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!currentTask) {
        return (
            <UiView bgColor>
                <UiHeader title="Cargando..." icon="arrow-back" />
                <UiView bgColor margin insetNull>
                    <UiText color="gray">Cargando detalles de la tarea...</UiText>
                </UiView>
            </UiView>
        );
    }

    return (
        <UiView bgColor style={{ flex: 1 }}>
            <PaperProvider>
            <UiHeader
                title={isEditing ? 'Editando Tarea' : 'Detalles de Tarea'}
                icon="arrow-back"
            />

            <ScrollView style={{ flex: 1 }}>
                <UiView bgColor margin insetNull>
                    {/* Título */}
                    <UiViewAdd paddingB="lg">
                        <UiViewAdd flexRow justifyContent="space-between">
                            <UiText type="subTitle" color="orange">
                                Título
                            </UiText>

                        </UiViewAdd>

                        {isEditing ? (
                            <TextInput
                                mode="outlined"
                                value={editTitle}
                                onChangeText={setEditTitle}
                                textColor="#D8D8D8"
                                style={styles.input}
                                theme={{
                                    colors: {
                                        primary: 'orange',
                                    },
                                }}
                            />
                        ) : (
                            <UiText type="text" color="white">
                                {currentTask.title}
                            </UiText>
                        )}
                    </UiViewAdd>

                    {/* Descripción */}
                    <UiViewAdd paddingB="lg">
                        <UiText type="subTitle" color="orange">
                            Descripción
                        </UiText>
                        {isEditing ? (
                            <TextInput
                                mode="outlined"
                                value={editDescription}
                                onChangeText={setEditDescription}
                                textColor="#D8D8D8"
                                style={styles.input}
                                multiline
                                numberOfLines={4}
                                placeholder="Agregar descripción..."
                                theme={{
                                    colors: {
                                        primary: 'orange',
                                    },
                                }}
                            />
                        ) : (
                            <UiText type="text" color="white">
                                {currentTask.description || 'Sin descripción'}
                            </UiText>
                        )}
                    </UiViewAdd>

                    {/* Recordatorio */}
                    <UiViewAdd paddingB="lg">
                        <UiText type="text" color="orange">
                            Recordatorio
                        </UiText>
                        {currentTask.reminder ? (
                            <UiText type="text" color="gray">
                                {formatReminderDate(currentTask.reminder.date, currentTask.reminder.time)}
                            </UiText>
                        ) : (
                            <UiText type="text" color="gray">
                                Sin recordatorio
                            </UiText>
                        )}
                    </UiViewAdd>

                    {/* Fecha de creación */}
                    <UiViewAdd paddingB="lg">
                        <UiText type="text" color="orange">
                            Fecha de creación:
                        </UiText>
                        <UiText type="text" color="gray">
                            {formatDate(currentTask.createdAt)}
                        </UiText>
                    </UiViewAdd>

                    {/* Botones de acción en modo edición */}
                    {isEditing && (
                        <UiViewAdd paddingB="lg">
                            <UiViewAdd flexRow justifyContent="space-between">
                                <UiButtton
                                    color="orange"
                                    bgColor="transparent"
                                    border
                                    icon="close"
                                    text="Cancelar"
                                    onPress={handleCancelEdit}
                                />
                                <UiButtton
                                    color="white"
                                    bgColor="orange"
                                    icon="checkmark"
                                    text="Guardar"
                                    onPress={handleSaveChanges}
                                />
                            </UiViewAdd>
                        </UiViewAdd>
                    )}
                </UiView>
            </ScrollView>

            {/* FAB fijo en la pantalla */}

            {!isEditing && (
                <Portal>
                    <FAB.Group
                        open={open}
                        visible
                        icon={open ? 'close' : 'plus'}
                        color="white"
                        backdropColor="rgba(0, 0, 0, 0.5)"
                        fabStyle={{
                            backgroundColor: 'orange',
                            elevation: 4,
                            borderRadius: 28,
                        }}
                        style={{
                            position: 'absolute',
                            right: 16,
                            bottom: 100,
                        }}
                        actions={[
                            {
                                icon: 'pencil',
                                label: 'Editar Tarea',
                                onPress: () => setIsEditing(true),
                                color: 'black',
                                style: { backgroundColor: '#fff' },
                            },
                            {
                                icon: 'alarm',
                                label: 'Recordatorio',
                                onPress: () => {
                                    router.push({
                                        pathname: '/tabs/screens/AddReminder',
                                        params: {
                                            taskId: currentTask.id,
                                            taskTitle: currentTask.title,
                                        },
                                    });
                                },
                                color: 'black',
                                style: { backgroundColor: '#fff' },
                            },
                        ]}
                        onStateChange={onStateChange}
                        onPress={() => {
                            if (open) {

                            }
                        }}
                    />
                </Portal>

            )}
    </PaperProvider>
        </UiView>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#000',
        marginBottom: 10,
    },
    fabGroup: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default TaskDetails;
