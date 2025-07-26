import React from "react";
import {useFecht} from "@/app/src/hook/useFecht";

interface PropsAdd {
    title: string;
    setTitle:  React.Dispatch<React.SetStateAction<string>>
}


export const useCRUD = () => {

    const {handleUpdateList, handleReadList} = useFecht()

    const AddList = async ({title, setTitle}:PropsAdd) => {
        if (title.trim() === ''){
            alert('El campo no puede estar vacio')
            return
        }

        const lista = await handleReadList()
        lista.push(title)
        setTitle("")
        handleUpdateList(lista)

    }



    return{
        AddList
    }
}