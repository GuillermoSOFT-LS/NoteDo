import React, {useState} from "react";
import {useFecht} from "@/app/src/hook/useFecht";
import {router} from "expo-router";
import {isTemplateElement} from "@babel/types";


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

export const useCRUD = () => {

    const {handleUpdateList, handleReadList} = useFecht()


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

   //Funcion de editar Listas

    const UpdateList = async({indice,Item}:PropsUpdate) => {
        const lista = await handleReadList()
        lista[indice] = Item
        await handleUpdateList(lista)
    }



    return{
        AddList,
        ShowList,
        removeList,
        UpdateList
    }
}