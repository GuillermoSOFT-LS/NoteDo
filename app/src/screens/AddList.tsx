import React, { useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {useCRUD} from "@/app/src/hook/useCRUD";



const AddList = () => {

    const [titleList, setTitleList] = useState("")

    const  {AddList} = useCRUD()

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
                        onPress={()=> AddList({title: titleList, setTitle: setTitleList})}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default AddList;
