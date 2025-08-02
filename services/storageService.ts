import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    LISTS: 'NoteList',
    TRASH: 'NoteTrash',
};

export const storageService = {
    async get<T>(key: string): Promise<T[]> {
        const value = await AsyncStorage.getItem(key);
        if (!value) return [];
        return JSON.parse(value);
    },

    async set<T>(key: string, data: T[]): Promise<void> {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    },

    async clear(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    },
};
