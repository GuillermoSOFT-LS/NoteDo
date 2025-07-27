import React from "react";
import {useFecht} from "@/app/src/hook/useFecht";

interface PropsAdd{
    title: string;
    setTitle:  React.Dispatch<React.SetStateAction<string>>
}

interface PropsShow {
    setList:  React.Dispatch<React.SetStateAction<string[]>>
}


export const useCRUD = () => {

    const {handleUpdateList, handleReadList} = useFecht()


    //Funcion de agregar tarea
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



    //Funcion Mostrar Tareas

    const ShowList = async ({setList}:PropsShow)=> {
        const lista = await handleReadList()
            setList(lista)
    }




    return{
        AddList,
        ShowList
    }
}