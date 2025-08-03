import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { UiView } from '@/components/UiView';
import { UiHeader } from '@/components/UiHeader';
import { UiText } from '@/components/UiText';
import { UiButtton } from '@/components/UiButtton';
import { UiViewAdd } from '@/components/UiViewAdd';
import { TextInput } from 'react-native-paper';
import { useReminders } from '@/hooks/useReminders';
import { notificationService } from '@/services/notificationService';
import { validationService } from '@/services/validationService';

const AddReminder = () => {
    const { taskId, taskTitle } = useLocalSearchParams();
    const [date, setDate] = useState(notificationService.getCurrentDate());
    const [time, setTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { createReminder } = useReminders();

    const handleCreateReminder = async () => {
        // Validar que los campos no estén vacíos
        if (!date || !time) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        // Validar fecha y hora usando el servicio de validaciones
        const dateTimeValidation = validationService.validateReminderDateTime(date, time);
        if (!dateTimeValidation.isValid) {
            Alert.alert('Error', dateTimeValidation.error);
            return;
        }

        // Validar ID de tarea
        const taskIdValidation = validationService.validateId(taskId as string);
        if (!taskIdValidation.isValid) {
            Alert.alert('Error', 'ID de tarea inválido');
            return;
        }

        setIsLoading(true);
        
        try {
            const success = await createReminder(
                taskId as string,
                taskTitle as string,
                date,
                time
            );

            if (success) {
                Alert.alert(
                    'Recordatorio creado',
                    `Se ha programado un recordatorio para "${taskTitle}" el ${notificationService.formatDateTime(date, time)}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back()
                        }
                    ]
                );
            } else {
                Alert.alert('Error', 'No se pudo crear el recordatorio');
            }
        } catch (error) {
            console.error('Error creando recordatorio:', error);
            Alert.alert('Error', 'Ocurrió un error al crear el recordatorio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (text: string) => {
        // Formatear automáticamente la fecha (YYYY-MM-DD)
        let formatted = text.replace(/\D/g, '');
        if (formatted.length >= 4) {
            formatted = formatted.substring(0, 4) + '-' + formatted.substring(4);
        }
        if (formatted.length >= 7) {
            formatted = formatted.substring(0, 7) + '-' + formatted.substring(7, 9);
        }
        setDate(formatted);
    };

    const handleTimeChange = (text: string) => {
        // Formatear automáticamente la hora (HH:MM)
        let formatted = text.replace(/\D/g, '');
        if (formatted.length >= 2) {
            formatted = formatted.substring(0, 2) + ':' + formatted.substring(2, 4);
        }
        setTime(formatted);
    };

    const setCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Agregar 5 minutos para que sea futuro
        
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        setDate(currentDate);
        setTime(currentTime);
    };

    return (
        <UiView bgColor>
            <UiHeader title="Agregar Recordatorio" icon="arrow-back" />
            
            <UiView bgColor margin insetNull>
                <UiViewAdd paddingB="lg">
                    <UiText type="title" color="white" paddingB>
                        Configurar Recordatorio
                    </UiText>
                    <UiText type="text" color="gray" paddingB>
                        Para la tarea: "{taskTitle}"
                    </UiText>
                </UiViewAdd>

                <UiViewAdd paddingB="lg">
                    <TextInput
                        mode="outlined"
                        label="Fecha (YYYY-MM-DD)"
                        value={date}
                        onChangeText={handleDateChange}
                        placeholder="2024-12-25"
                        maxLength={10}
                        textColor="#D8D8D8"
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: 'orange',
                            },
                        }}
                    />
                </UiViewAdd>

                <UiViewAdd paddingB="lg">
                    <TextInput
                        mode="outlined"
                        label="Hora (HH:MM)"
                        value={time}
                        onChangeText={handleTimeChange}
                        placeholder="14:30"
                        maxLength={5}
                        textColor="#D8D8D8"
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: 'orange',
                            },
                        }}
                    />
                </UiViewAdd>

                <UiViewAdd paddingB="lg">
                    <UiButtton
                        color="orange"
                        bgColor="transparent"
                        border
                        icon="time"
                        text="Usar fecha y hora actual (+5 min)"
                        onPress={setCurrentDateTime}
                    />
                </UiViewAdd>

                {date && time && (
                    <UiViewAdd paddingB="lg">
                        <UiText type="text" color="gray">
                            Recordatorio programado para:
                        </UiText>
                        <UiText type="text" color="orange">
                            {notificationService.formatDateTime(date, time)}
                        </UiText>
                    </UiViewAdd>
                )}

                <UiViewAdd justifyContent="space-between" flexRow>
                    <UiButtton
                        color="gray"
                        bgColor="transparent"
                        border
                        icon="close"
                        text="Cancelar"
                        onPress={() => router.back()}
                    />
                    <UiButtton
                        color="white"
                        bgColor="orange"
                        icon="alarm"
                        text={isLoading ? "Creando..." : "Crear Recordatorio"}
                        onPress={handleCreateReminder}
                        disabled={isLoading}
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

export default AddReminder;