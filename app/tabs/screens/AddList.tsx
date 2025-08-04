import React, { useState } from 'react';
import {useCRUD} from "@/hooks/useCRUD";
import {UiForm} from "@/components/UiForm";

const AddList = () => {

    const [titleList, setTitleList] = useState("")

    const  {addList} = useCRUD()

    return (
            <UiForm
                textBtn='Crear Lista'
                onPress={()=> addList({title: titleList, setTitle: setTitleList})}
                onChangeText={(title) => setTitleList(title)}
                placeholder='Nombre de la nueva lista'
                value={titleList}
                headerTitle='Agregar Listas'
                iconBtn='add'
            />
);
};

export default AddList;
