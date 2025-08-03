import { UiButtton } from "@/components/UiButtton";
import { UiCardList } from "@/components/UiCardList";
import { UiHeader } from "@/components/UiHeader";
import { UiListEmpty } from "@/components/UiListEmpty";
import { UiText } from "@/components/UiText";
import { UiView } from "@/components/UiView";
import { UiViewAdd } from "@/components/UiViewAdd";
import { useCRUD } from "@/hooks/useCRUD";
import { TaskList } from "@/types/interfaces";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";

export default function Home() {
    const [Listas, setListas] = useState<TaskList[]>([]);
    const [selectedLists, setSelectedLists] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const { showLists, removeList } = useCRUD();

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await showLists({ setList: setListas });
            };
            loadList();
        }, [])
    );

    const handleLongPress = (listId: string) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedLists([listId]);
        } else {
            toggleSelection(listId);
        }
    };

    const toggleSelection = (listId: string) => {
        setSelectedLists(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedLists([]);
    };

    const handleBulkDelete = () => {
        selectedLists.forEach(listId => {
            removeList({ id: listId, setList: setListas });
        });
        exitSelectionMode();
    };

    return (
        <UiView bgColor>
            <UiHeader
                title={isSelectionMode ? `${selectedLists.length} seleccionadas` : "NoteDo"}
                icon2={isSelectionMode ? undefined : "book-outline"}
                marginNull
            />
            <UiView bgColor margin insetNull>
                {!isSelectionMode && (
                    <UiViewAdd justifyContent="space-between" flexRow paddingB="lg">
                        <UiText type="title" color="white">Listas</UiText>
                        <UiButtton
                            color="white"
                            bgColor="orange"
                            icon="add-circle"
                            text="Nueva lista"
                            onPress={() => router.push("/tabs/screens/AddList")}
                        />
                    </UiViewAdd>
                )}

                {isSelectionMode && (
                    <>
                        <UiViewAdd justifyContent='center' flexRow paddingB="lg">
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
                                text={`Eliminar ${selectedLists.length} listas`}
                                onPress={handleBulkDelete}
                            />
                        </UiViewAdd>
                    </>
                )}
                <FlatList
                    data={Listas}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title="No hay listas creadas" />}
                    renderItem={({ item }) => {
                        const isSelected = selectedLists.includes(item.id);
                        return (
                            <UiCardList
                                titleList={item.title}
                                createdAt={item.createdAt}
                                isSelected={isSelected}
                                onPress={() => {
                                    if (isSelectionMode) {
                                        toggleSelection(item.id);
                                    } else {
                                        router.push({
                                            pathname: "/tabs/screens/DetailsList",
                                            params: {
                                                listId: item.id,
                                                title: item.title
                                            },
                                        });
                                    }
                                }}
                                onLongPress={() => handleLongPress(item.id)}
                                onPressUpdate={!isSelectionMode ? () =>
                                    router.push({
                                        pathname: "/tabs/screens/UpdateList",
                                        params: {
                                            id: item.id,
                                            title: item.title,
                                        },
                                    }) : undefined
                                }
                            />
                        );
                    }}
                />
            </UiView>
        </UiView>
    );
}