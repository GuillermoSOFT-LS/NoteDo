import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
    STORAGE_KEY: string
}

// Permite que las funciones trabajen con cualquier tipo de lista (string[] o TaskList[])
export const useFecht = ({STORAGE_KEY}: Props) => {

    // Enviar datos a AsyncStorage
    const handleAddList = async <T = any>(list: T[]): Promise<boolean> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            return true;
        } catch {
            return false;
        }
    };

    // Leer los datos del AsyncStorage
    const handleReadList = async <T = any>(): Promise<T[]> => {
        const list = await AsyncStorage.getItem(STORAGE_KEY);
        if (list) {
            return JSON.parse(list);
        }
        return [];
    };

    // Editar los datos de AsyncStorage
    const handleUpdateList = async <T = any>(list: T[]): Promise<boolean> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            return true;
        } catch {
            return false;
        }
    };

    // Eliminar dato de AsyncStorage
    const handleRemoveList = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            return true;
        } catch {
            return false;
        }
    };

    return {
        handleAddList,
        handleRemoveList,
        handleReadList,
        handleUpdateList
    };
};