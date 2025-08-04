import { StorageKeys, storageService } from '@/services/storageService';
import { validationService } from '@/services/validationService';
import {
    AddListParams,
    AddTaskParams,
    ItemType,
    RemoveListParams,
    RemoveTaskParams,
    ShowListParams,
    Task,
    TaskList,
    ToggleTaskParams,
    TrashItem,
    UpdateListParams,
    UpdateTaskParams
} from '@/types/interfaces';
import { generateId } from '@/utils/generateId';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useCRUD = () => {
    
    // ========== FUNCIONES DE LISTAS ==========
    
    const addList = async ({ title, setTitle }: AddListParams) => {
        try {
            // Sanitizar título
            const sanitizedTitle = validationService.sanitizeText(title);
            
            // Validar título
            const titleValidation = validationService.validateListTitle(sanitizedTitle);
            if (!titleValidation.isValid) {
                Alert.alert('Error', titleValidation.error);
                return;
            }

            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const existingTitles = lists.map(list => list.title);

            // Validar duplicados
            const duplicateValidation = validationService.validateDuplicateTitle(
                sanitizedTitle,
                existingTitles
            );
            if (!duplicateValidation.isValid) {
                Alert.alert('Error', duplicateValidation.error);
                return;
            }

            const newList: TaskList = {
                id: generateId(),
                title: sanitizedTitle,
                createdAt: new Date().toISOString(),
                tasks: [],
            };
            
            const updatedLists = [newList, ...lists];
            setTitle('');
            await storageService.set(StorageKeys.LISTS, updatedLists);
            router.back();
        } catch (error) {
            console.error('Error creando lista:', error);
            Alert.alert('Error', 'No se pudo crear la lista');
        }
    };

    const showLists = async ({ setList }: ShowListParams) => {
        try {
            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            setList(lists);
        } catch (error) {
            console.error('Error cargando listas:', error);
            Alert.alert('Error', 'No se pudieron cargar las listas');
            setList([]);
        }
    };

    const updateList = async ({ id, newTitle }: UpdateListParams) => {
        try {
            // Validar ID
            const idValidation = validationService.validateId(id);
            if (!idValidation.isValid) {
                Alert.alert('Error', idValidation.error);
                return;
            }

            // Sanitizar título
            const sanitizedTitle = validationService.sanitizeText(newTitle);
            
            // Validar título
            const titleValidation = validationService.validateListTitle(sanitizedTitle);
            if (!titleValidation.isValid) {
                Alert.alert('Error', titleValidation.error);
                return;
            }

            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const listToUpdate = lists.find(list => list.id === id);

            if (!listToUpdate) {
                Alert.alert('Error', 'Lista no encontrada');
                return;
            }

            const existingTitles = lists.map(list => list.title);
            
            // Validar duplicados
            const duplicateValidation = validationService.validateDuplicateTitle(
                sanitizedTitle,
                existingTitles,
                listToUpdate.title
            );
            if (!duplicateValidation.isValid) {
                Alert.alert('Error', duplicateValidation.error);
                return;
            }

            listToUpdate.title = sanitizedTitle;
            await storageService.set(StorageKeys.LISTS, lists);
        } catch (error) {
            console.error('Error actualizando lista:', error);
            Alert.alert('Error', 'No se pudo actualizar la lista');
        }
    };

    const removeList = async ({ id, setList }: RemoveListParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToRemove = lists.find(list => list.id === id);
        
        if (!listToRemove) return;

        // Crear item de papelera
        const trashItem: TrashItem = {
            id: generateId(),
            originalId: listToRemove.id,
            type: ItemType.LIST,
            data: listToRemove,
            deletedAt: new Date().toISOString(),
        };

        // Mover a papelera
        await storageService.moveToTrash(trashItem);

        // Remover de listas activas
        const updatedLists = lists.filter(list => list.id !== id);
        await storageService.set(StorageKeys.LISTS, updatedLists);
        setList(updatedLists);
    };

    // ========== FUNCIONES DE TAREAS ==========

    const addTaskToList = async ({ listId, taskTitle, taskDescription, setTaskTitle, setTaskDescription }: AddTaskParams) => {
        try {
            // Validar ID de lista
            const idValidation = validationService.validateId(listId);
            if (!idValidation.isValid) {
                Alert.alert('Error', idValidation.error);
                return;
            }

            // Sanitizar título
            const sanitizedTitle = validationService.sanitizeText(taskTitle);
            
            // Validar título
            const titleValidation = validationService.validateTaskTitle(sanitizedTitle);
            if (!titleValidation.isValid) {
                Alert.alert('Error', titleValidation.error);
                return;
            }

            // Sanitizar descripción si existe
            const sanitizedDescription = taskDescription ? validationService.sanitizeText(taskDescription) : undefined;

            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const listIndex = lists.findIndex(list => list.id === listId);

            if (listIndex === -1) {
                Alert.alert('Error', 'Lista no encontrada');
                return;
            }

            const newTask: Task = {
                id: generateId(),
                title: sanitizedTitle,
                description: sanitizedDescription,
                isCompleted: false,
                createdAt: new Date().toISOString(),
            };

            lists[listIndex].tasks.unshift(newTask);
            await storageService.set(StorageKeys.LISTS, lists);
            setTaskTitle('');
            if (setTaskDescription) setTaskDescription('');
        } catch (error) {
            console.error('Error agregando tarea:', error);
            Alert.alert('Error', 'No se pudo agregar la tarea');
        }
    };

    const updateTask = async ({ listId, taskIndex, newTitle, newDescription }: UpdateTaskParams) => {
        try {
            // Validar ID de lista
            const idValidation = validationService.validateId(listId);
            if (!idValidation.isValid) {
                Alert.alert('Error', idValidation.error);
                return;
            }

            // Sanitizar título
            const sanitizedTitle = validationService.sanitizeText(newTitle);
            
            // Validar título
            const titleValidation = validationService.validateTaskTitle(sanitizedTitle);
            if (!titleValidation.isValid) {
                Alert.alert('Error', titleValidation.error);
                return;
            }

            // Sanitizar descripción si existe
            const sanitizedDescription = newDescription ? validationService.sanitizeText(newDescription) : undefined;

            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const listToUpdate = lists.find(list => list.id === listId);

            if (!listToUpdate) {
                Alert.alert('Error', 'Lista no encontrada');
                return;
            }

            if (!listToUpdate.tasks[taskIndex]) {
                Alert.alert('Error', 'Tarea no encontrada');
                return;
            }

            listToUpdate.tasks[taskIndex].title = sanitizedTitle;
            listToUpdate.tasks[taskIndex].description = sanitizedDescription;
            await storageService.set(StorageKeys.LISTS, lists);
        } catch (error) {
            console.error('Error actualizando tarea:', error);
            Alert.alert('Error', 'No se pudo actualizar la tarea');
        }
    };

    const toggleTaskCompleted = async ({ listId, taskIndex }: ToggleTaskParams) => {
        try {
            // Validar ID de lista
            const idValidation = validationService.validateId(listId);
            if (!idValidation.isValid) {
                Alert.alert('Error', idValidation.error);
                return;
            }

            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const listToUpdate = lists.find(list => list.id === listId);

            if (!listToUpdate) {
                Alert.alert('Error', 'Lista no encontrada');
                return;
            }

            if (!listToUpdate.tasks[taskIndex]) {
                Alert.alert('Error', 'Tarea no encontrada');
                return;
            }

            const currentStatus = listToUpdate.tasks[taskIndex].isCompleted;
            listToUpdate.tasks[taskIndex].isCompleted = !currentStatus;
            await storageService.set(StorageKeys.LISTS, lists);
        } catch (error) {
            console.error('Error alternando estado de tarea:', error);
            Alert.alert('Error', 'No se pudo cambiar el estado de la tarea');
        }
    };

    const removeTask = async ({ listId, taskIndex }: RemoveTaskParams) => {
        const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
        const listToUpdate = lists.find(list => list.id === listId);

        if (listToUpdate && listToUpdate.tasks[taskIndex]) {
            const taskToRemove = listToUpdate.tasks[taskIndex];

            // Crear item de papelera
            const trashItem: TrashItem = {
                id: generateId(),
                originalId: taskToRemove.id,
                type: ItemType.TASK,
                data: taskToRemove,
                deletedAt: new Date().toISOString(),
                parentListId: listId,
            };

            // Mover a papelera
            await storageService.moveToTrash(trashItem);

            // Remover de la lista
            listToUpdate.tasks.splice(taskIndex, 1);
            await storageService.set(StorageKeys.LISTS, lists);
        }
    };

    // ========== FUNCIONES DE PAPELERA ==========

    const getTrashItems = async (type?: 'list' | 'task') => {
        if (type === 'list') {
            return await storageService.get<TrashItem>(StorageKeys.TRASH_LISTS);
        } else if (type === 'task') {
            return await storageService.get<TrashItem>(StorageKeys.TRASH_TASKS);
        } else {
            const trashLists = await storageService.get<TrashItem>(StorageKeys.TRASH_LISTS);
            const trashTasks = await storageService.get<TrashItem>(StorageKeys.TRASH_TASKS);
            return [...trashLists, ...trashTasks].sort((a, b) => 
                new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
            );
        }
    };

    const restoreFromTrash = async (itemId: string, type: 'list' | 'task') => {
        const restoredItem = await storageService.restoreFromTrash(itemId, type);
        
        if (!restoredItem) return false;

        if (type === 'list') {
            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            lists.unshift(restoredItem.data as TaskList);
            await storageService.set(StorageKeys.LISTS, lists);
        } else if (type === 'task' && restoredItem.parentListId) {
            const lists: TaskList[] = await storageService.get(StorageKeys.LISTS);
            const parentList = lists.find(list => list.id === restoredItem.parentListId);
            
            if (parentList) {
                parentList.tasks.unshift(restoredItem.data as Task);
                await storageService.set(StorageKeys.LISTS, lists);
            }
        }

        return true;
    };

    const deleteFromTrashPermanently = async (itemId: string, type: 'list' | 'task') => {
        return await storageService.deleteFromTrash(itemId, type);
    };

    return {
        // Funciones de listas
        addList,
        showLists,
        updateList,
        removeList,
        
        // Funciones de tareas
        addTaskToList,
        updateTask,
        toggleTaskCompleted,
        removeTask,
        
        // Funciones de papelera
        getTrashItems,
        restoreFromTrash,
        deleteFromTrashPermanently,
    };
};