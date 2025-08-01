import { UiText } from "@/app/src/components/UiText";
import { UiView } from "@/app/src/components/UiView";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { router, useFocusEffect } from "expo-router";
import { UiHeader } from "@/app/src/components/UiHeader";
import { useState, useCallback } from "react";
import {FlatList} from "react-native";
import { UiCardList } from "@/app/src/components/UiCardList";
import { useCRUDList } from "@/app/src/hook/useCRUDList";
import {UiListEmpty} from "@/app/src/components/UiListEmpty";

interface TaskList {
    title: string;
    tasks: string[];
}

export default function Home() {
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
                <UiHeader title="NoteDo" icon2='book-outline' marginNull/>

            <UiView bgColor margin insetNull>
                <UiViewAdd justifyContent='space-between' flexRow paddingB="lg">
                    <UiText type="title" color="white">Listas</UiText>
                    <UiButtton color="white" bgColor="orange" icon="add-circle" text="Nueva lista"
                        onPress={() => router.push("/src/tabs/screens/AddList")}
                    />
                </UiViewAdd>

                <FlatList
                    data={Listas}
                    keyExtractor={(_, index) => index.toString()}
                    ListEmptyComponent={<UiListEmpty title='No hay listas creadas'/>}
                    renderItem={({ index, item }) => (
                        <UiCardList
                            titleList={item.title}
                            onPressRemove={() => removeList({ indice: index, setList: setListas })}
                            onPressUpdate={() =>
                                router.push({
                                    pathname: "/src/tabs/screens/UpdateList",
                                    params: { title: item.title, index: index },
                                })}/>
                     )}/>
            </UiView>
        </UiView>
    );
}