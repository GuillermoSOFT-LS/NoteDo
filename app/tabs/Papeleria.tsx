import { UiButtton } from "@/components/UiButtton";
import { UiCardList } from "@/components/UiCardList";
import { UiHeader } from "@/components/UiHeader";
import { UiListEmpty } from "@/components/UiListEmpty";
import { UiText } from "@/components/UiText";
import { UiView } from "@/components/UiView";
import { UiViewAdd } from "@/components/UiViewAdd";
import { useCRUD } from "@/hooks/useCRUD";
import { TrashItem } from "@/types/interfaces";
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';

export default function Papeleria() {
    const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    
    const { getTrashItems, restoreFromTrash, deleteFromTrashPermanently } = useCRUD();

    // Cargar elementos de papelera al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            loadTrashItems();
        }, [])
    );

    const loadTrashItems = async () => {
        const items = await getTrashItems();
        setTrashItems(items);
    };

    const handleLongPress = (itemId: string) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedItems([itemId]);
        } else {
            toggleSelection(itemId);
        }
    };

    const toggleSelection = (itemId: string) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedItems([]);
    };

    const handleRestore = async (itemId: string, type: 'list' | 'task') => {
        const success = await restoreFromTrash(itemId, type);
        if (success) {
            Alert.alert('Éxito', 'Elemento restaurado correctamente');
            loadTrashItems();
        } else {
            Alert.alert('Error', 'No se pudo restaurar el elemento');
        }
    };

    const handleDeletePermanently = (itemId: string, type: 'list' | 'task') => {
        Alert.alert(
            'Eliminar permanentemente',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteFromTrashPermanently(itemId, type);
                        if (success) {
                            loadTrashItems();
                        }
                    }
                }
            ]
        );
    };

    const handleBulkRestore = async () => {
        for (const itemId of selectedItems) {
            const item = trashItems.find(i => i.id === itemId);
            if (item) {
                await restoreFromTrash(itemId, item.type);
            }
        }
        Alert.alert('Éxito', `${selectedItems.length} elementos restaurados`);
        exitSelectionMode();
        loadTrashItems();
    };

    const handleBulkDelete = () => {
        Alert.alert(
            'Eliminar permanentemente',
            `¿Eliminar permanentemente ${selectedItems.length} elementos? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: async () => {
                        for (const itemId of selectedItems) {
                            const item = trashItems.find(i => i.id === itemId);
                            if (item) {
                                await deleteFromTrashPermanently(itemId, item.type);
                            }
                        }
                        Alert.alert('Eliminados', `${selectedItems.length} elementos eliminados permanentemente`);
                        exitSelectionMode();
                        loadTrashItems();
                    }
                }
            ]
        );
    };

    const renderTrashItem = ({ item }: { item: TrashItem }) => {
        const data = item.data as any;
        const isSelected = selectedItems.includes(item.id);
        
        return (
            <UiCardList
                titleList={data.title}
                createdAt={`Eliminado: ${new Date(item.deletedAt).toLocaleDateString('es-ES')}`}
                isSelected={isSelected}
                onPress={() => isSelectionMode ? toggleSelection(item.id) : undefined}
                onLongPress={() => handleLongPress(item.id)}
                onPressRemove={() => handleDeletePermanently(item.id, item.type)}
            />
        );
    };

    return (
        <UiView bgColor>
            <UiHeader
                title={isSelectionMode ? `${selectedItems.length} seleccionados` : 'Papelería'}
                icon={isSelectionMode ? 'close' : 'arrow-back'}
            />

            <UiView margin bgColor insetNull>
                {!isSelectionMode && (
                    <UiViewAdd paddingB="lg">
                        <UiText type="title" color="white">Elementos eliminados</UiText>
                        <UiText type="text" color="gray">
                             elementos: {trashItems.length}
                        </UiText>
                    </UiViewAdd>
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
                                bgColor="orange"
                                icon="refresh"
                                text="Restaurar"
                                onPress={handleBulkRestore}
                            />
                            <UiButtton
                                color="orange"
                                bgColor="red"
                                icon="trash"
                                text="Eliminar"
                                onPress={handleBulkDelete}
                            />
                        </UiViewAdd>
                    </>
                )}

                <FlatList
                    data={trashItems}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <UiListEmpty title="No hay elementos en la papelería" />
                    }
                    renderItem={renderTrashItem}
                />
            </UiView>
        </UiView>
    );
}