import React, { useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {useCRUD} from "@/app/src/hook/useCRUD";
import {Redirect, router} from "expo-router";



const AddList = () => {

    const [titleList, setTitleList] = useState("")

    const {handleReadList, handleUpdateList} = useCRUD();

    async function AddList() {
           if(titleList?.trim() === ""){
            alert("El nombre de la lista no puede estar vacío");
            return;
           }

           const  list = await handleReadList()
           list.push(titleList)
           setTitleList("")
           handleUpdateList(list)
    }


    return (
        <UiView bgColor>
            <UiHeader title='Agregar Listas' icon='arrow-back' />

            <UiView bgColor margin>
                <UiViewAdd>
                    <UiTextinput
                        placeholder='Nombre de la nueva lista'
                        value={titleList}
                        onChangeText={(title) => setTitleList(title)}
                    />
                    <UiButtton
                        icon='add'
                        color='white'
                        bgColor
                        text='Crear nueva lista'
                        onPress={AddList}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default AddList;
