import React, { useState } from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {useCRUDList} from "@/app/src/hook/useCRUDList";



const AddList = () => {

    const [titleList, setTitleList] = useState("")

    const  {AddList} = useCRUDList()

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
                        bgColor='green'
                        text='Crear nueva lista'
                        onPress={()=> AddList({title: titleList, setTitle: setTitleList})}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default AddList;
