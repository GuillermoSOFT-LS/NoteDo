import { UiText } from "@/components/UiText";
import { UiView } from "@/components/UiView";
import { UiButtton } from "@/components/UiButtton";
import { UiViewAdd } from "@/components/UiViewAdd";
import { router, useFocusEffect } from "expo-router";
import { UiHeader } from "@/components/UiHeader";
import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { UiCardList } from "@/components/UiCardList";
import { useCRUD } from "@/hooks/useCRUD";
import { UiListEmpty } from "@/components/UiListEmpty";
import { TaskList } from "@/types/interfaces";

export default function Home() {
    const [Listas, setListas] = useState<TaskList[]>([]);
    const { showLists, removeList } = useCRUD();

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await showLists({ setList: setListas });
            };
            loadList();
        }, [])
    );

    return (
        <UiView bgColor>
            <UiHeader title="NoteDo" icon2="book-outline" marginNull />
            <UiView bgColor margin insetNull>
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
                <FlatList
                    data={Listas}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title="No hay listas creadas" />}
                    renderItem={({ item }) => (
                        <UiCardList
                            titleList={item.title}
                            createdAt={item.createdAt}
                            onPress={() =>
                                router.push({
                                    pathname: "/tabs/screens/DetailsList",
                                    params: {
                                        listId: item.id,
                                        title: item.title
                                    },
                                })
                            }
                            onPressRemove={() => removeList({ id: item.id, setList: setListas })}
                            onPressUpdate={() =>
                                router.push({
                                    pathname: "/tabs/screens/UpdateList",
                                    params: {
                                        id: item.id,
                                        title: item.title,
                                    },
                                })
                            }
                        />
                    )}
                />
            </UiView>
        </UiView>
    );
}