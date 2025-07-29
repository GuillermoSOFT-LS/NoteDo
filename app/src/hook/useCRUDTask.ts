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

interface PropsUpdate{
    indice: number;
    Item: string;
}

export const useCRUDTask = () => {

    const {handleUpdateList, handleReadList} = useFecht({STORAGE_KEY: 'NoteTask'})


    //Funcion de agregar Listas
    const AddTask = async ({title, setTitle}:PropsAdd) => {

        if (title.trim() === ""){
            alert('El campo no puede estar vacio')
            return
        }

        const lista = await handleReadList()

        lista.push(title)

        setTitle("")
        handleUpdateList(lista)
    }


    //Funcion Mostrar Listas

    const ShowTask = async ({setList}:PropsShow)=> {
        const lista = await handleReadList()
        setList(lista)
    }

    //Funcion Elimar Listas
    const removeTask = async ({indice, setList}:PropsRemove) => {
        const lista = await handleReadList()
        lista.splice(indice, 1)
        handleUpdateList(lista)
        setList(lista)
    }

    //Funcion de editar Listas

    const UpdateTask = async({indice,Item}:PropsUpdate) => {
        const lista = await handleReadList()
        lista[indice] = Item
        await handleUpdateList(lista)
    }

    return{
        AddTask,
        ShowTask,
        removeTask,
        UpdateTask
    }
}

export default useCRUDTask