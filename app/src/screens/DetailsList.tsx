import React, {useCallback, useState} from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiHeader } from "@/app/src/components/UiHeader";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {UiText} from "@/app/src/components/UiText";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {UiTextinput} from "@/app/src/components/UiTextinput";
import {UiButtton} from "@/app/src/components/UiButtton";
import {UiCardList} from "@/app/src/components/UiCardList";
import {FlatList} from "react-native";
import {useCRUDList} from "@/app/src/hook/useCRUDList";

const DetailsList = () => {
    const { title } = useLocalSearchParams();

    const [titleList, setTitleList] = useState("")

    const  {AddList,ShowList} = useCRUDList()

    const [Listas, setListas] = useState<string[]>([])

    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [setListas])
    );



    return (
        <UiView bgColor>
            <UiHeader title={title as string} icon='arrow-back' />

            <UiView bgColor margin>
                <UiViewAdd>
                    <UiTextinput
                        placeholder='Nombre de la tarea'
                        value={titleList}
                        onChangeText={(title) => setTitleList(title)}
                    />
                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor='green'
                        text='Crear Tarea'
                        onPress={()=> AddList({title: titleList, setTitle: setTitleList})}
                    />
                </UiViewAdd>


                <UiText color='gray' type='subTitle' style={{paddingBottom: 10}}>Lista de Tareas</UiText>

                <FlatList
                    data={Listas}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({index, item}) => (

                        <>
                            <UiCardList
                                titleList={item}
                                onPressUpdate={()=> router.push({
                                    pathname: '/src/screens/UpdateList',
                                    params: { title: item, index: index}
                                })}
                            />
                        </>

                    )}/>



            </UiView>

        </UiView>
    );
};

export default DetailsList;