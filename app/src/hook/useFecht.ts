import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
    STORAGE_KEY: string
}

export const useFecht = ({STORAGE_KEY}:Props)=> {


    //Enviar Datos a AsynStorage
    const handleAddList = async (list: string[]):Promise<boolean> => {

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            return true
        }catch {return false}
    }


    //Leer los datos del AsyncStorage
    const handleReadList = async ():Promise<string[]> => {

        const list = await AsyncStorage.getItem(STORAGE_KEY)
        if (list) {
            return JSON.parse(list)
        }
        return []
    }



    //Editar los datos de AsyncStorage
    const handleUpdateList = async (list: string[]):Promise<boolean> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            return true
        }catch {return false}
    }


    //Eliminar Dato de AsyncStorage
    const handleRemoveList = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
            return true
        }catch {return false}
    }


    return{

        //Peticiones
        handleAddList,
        handleRemoveList,
        handleReadList,
        handleUpdateList

    }
}