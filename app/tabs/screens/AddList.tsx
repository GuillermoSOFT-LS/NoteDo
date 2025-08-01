import React, { useState } from 'react';
import {useCRUDList} from "@/hook/useCRUDList";
import {UiForm} from "@/components/UiForm";

const AddList = () => {

    const [titleList, setTitleList] = useState("")

    const  {AddList} = useCRUDList()

    return (
            <UiForm
                textBtn='Crear Lista'
                onPress={()=> AddList({title: titleList, setTitle: setTitleList})}
                onChangeText={(title) => setTitleList(title)}
                placeholder='Nombre de la nueva lista'
                value={titleList}
                headerTitle='Agregar Listas'
                iconBtn='add'
            />
);
};

export default AddList;
