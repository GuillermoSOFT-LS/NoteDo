import React from "react";
import {useFecht} from "@/app/src/hook/useFecht";

interface PropsAdd{
    title: string;
    setTitle:  React.Dispatch<React.SetStateAction<string>>
}

interface PropsShow {
    setList:  React.Dispatch<React.SetStateAction<string[]>>
}

interface PropsRemove extends PropsShow{
    indice: number;
}

export const useCRUD = () => {

    const {handleUpdateList, handleReadList,handleRemoveList} = useFecht()


    //Funcion de agregar Listas
    const AddList = async ({title, setTitle}:PropsAdd) => {

        if (title.trim() === ""){
                alert('El campo no puede estar vacio')
                return
        }

        const lista = await handleReadList()

        lista.push(title)

        setTitle("")
        alert(`La lista ${title} se a creado`)
        handleUpdateList(lista)
    }



    //Funcion Mostrar Listas

    const ShowList = async ({setList}:PropsShow)=> {
        const lista = await handleReadList()
            setList(lista)
    }

    //Funcion Elimar Listas
   const removeList = async ({indice, setList}:PropsRemove) => {
        const lista = await handleReadList()
        lista.splice(indice, 1)
        handleUpdateList(lista)
        setList(lista)
   }



    return{
        AddList,
        ShowList,
        removeList
    }
}