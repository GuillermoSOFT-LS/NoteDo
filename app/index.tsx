import { UiText } from "@/app/src/components/UiText";
import { UiView } from "@/app/src/components/UiView";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { router, useFocusEffect } from "expo-router";
import { UiHeader } from "@/app/src/components/UiHeader";
import { useState, useCallback } from "react";
import {FlatList, View} from "react-native";
import { UiCardList } from "@/app/src/components/UiCardList";
import { useCRUDList } from "@/app/src/hook/useCRUDList";
import { Ionicons } from "@expo/vector-icons";

interface TaskList {
    title: string;
    tasks: string[];
}

export default function Index() {
    const [Listas, setListas] = useState<TaskList[]>([]);
    const { ShowList, removeList } = useCRUDList();

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [])
    );

    return (
        <UiView bgColor>
            <UiHeader title="NoteDo" />

            <UiView bgColor margin>
                <UiViewAdd flexRow paddingB="lg" paddingT="md">
                    <UiText type="title" color="white">
                        Listas
                    </UiText>
                    <UiButtton
                        color="white"
                        bgColor="green"
                        icon="add-circle"
                        text="Nueva lista"
                        onPress={() => router.push("/src/screens/AddList")}
                    />
                </UiViewAdd>

                <FlatList
                    data={Listas}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={
                        <UiText
                            type="title"
                            color="gray"
                            style={{
                                marginTop: 100,
                                padding: 75,
                                textAlign: "center",
                                justifyContent: "center",
                                backgroundColor: "gray",
                                borderRadius: 200,
                            }}
                        >
                            <UiText type='title'>No hay listas creadas</UiText>
                                <Ionicons name="albums-outline" size={100} color="white" />

                        </UiText>
                    }
                    renderItem={({ index, item }) => (
                        <UiCardList
                            titleList={item.title}
                            onPressRemove={() => removeList({ indice: index, setList: setListas })}
                            onPressUpdate={() =>
                                router.push({
                                    pathname: "/src/screens/UpdateList",
                                    params: { title: item.title, index: index },
                                })
                            }
                        />
                    )}
                />
            </UiView>
        </UiView>
    );
}