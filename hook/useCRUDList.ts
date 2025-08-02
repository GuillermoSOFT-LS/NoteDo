import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { NoteList } from '../types';
import { StorageKeys, storageService } from '../services/storageService';

export const useCRUDList = () => {
    const [lists, setLists] = useState<NoteList[]>([]);

    useEffect(() => {
        const fetchLists = async () => {
            const data = await storageService.get<NoteList>(StorageKeys.LISTS);
            setLists(data);
        };

        fetchLists();
    }, []);

    const createList = async (newList: NoteList) => {
        const updatedLists = [...lists, newList];
        await storageService.set(StorageKeys.LISTS, updatedLists);
        setLists(updatedLists);
    };

    const deleteList = async (id: string) => {
        Alert.alert(
            '¿Estás seguro?',
            'Esta acción no se puede deshacer',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedLists = lists.filter((list) => list.id !== id);
                        await storageService.set(StorageKeys.LISTS, updatedLists);
                        setLists(updatedLists);
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const updateList = async (updatedList: NoteList) => {
        const updatedLists = lists.map((list) =>
            list.id === updatedList.id ? updatedList : list
        );
        await storageService.set(StorageKeys.LISTS, updatedLists);
        setLists(updatedLists);
    };

    return {
        lists,
        createList,
        deleteList,
        updateList,
    };
};
