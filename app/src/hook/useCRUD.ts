import AsyncStorage from "@react-native-async-storage/async-storage";


export const useCRUD = ()=> {

    const STORAGE_KEY = 'taskLists';

    const handleAddList = async (list: string[]):Promise<boolean> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            return true
        }catch {return false}
    }

    const handleReadList = async ():Promise<string[]> => {

        const list = await AsyncStorage.getItem(STORAGE_KEY)
        if (list) {
            return JSON.parse(list)
        }
        return []
    }

    const handleUpdateList = async (list: string[]):Promise<boolean> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            return true
        }catch {return false}
    }

    const handleRemoveList = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY)
            return true
        }catch {return false}
    }


    return{
        handleAddList,
        handleRemoveList,
        handleReadList,
        handleUpdateList
    }
}