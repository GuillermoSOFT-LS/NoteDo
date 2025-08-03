// Interfaces centralizadas para NoteDo App

export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: string;
    reminder?: Reminder;
}

export interface TaskList {
    id: string;
    title: string;
    createdAt: string;
    tasks: Task[];
}

export interface Reminder {
    id: string;
    date: string;
    time: string;
    isActive: boolean;
}

export interface TrashItem {
    id: string;
    originalId: string;
    type: 'list' | 'task';
    data: TaskList | Task;
    deletedAt: string;
    parentListId?: string; // Para tareas eliminadas, referencia a la lista padre
}

// Props para componentes
export interface UiCardListProps {
    titleList: string;
    createdAt?: string;
    onPress?: () => void;
    onPressRemove?: () => void;
    onPressUpdate?: () => void;
    onPressCheck?: () => void;
    onLongPress?: () => void;
    showChecked?: boolean;
    isChecked?: boolean;
    isSelected?: boolean;
}

// Props para hooks
export interface AddListParams {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface ShowListParams {
    setList: React.Dispatch<React.SetStateAction<TaskList[]>>;
}

export interface RemoveListParams extends ShowListParams {
    id: string;
}

export interface UpdateListParams {
    id: string;
    newTitle: string;
}

export interface AddTaskParams {
    listId: string;
    taskTitle: string;
    setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface UpdateTaskParams {
    listId: string;
    taskIndex: number;
    newTitle: string;
}

export interface ToggleTaskParams {
    listId: string;
    taskIndex: number;
}

export interface RemoveTaskParams {
    listId: string;
    taskIndex: number;
}

// Enums para estados
export enum ItemType {
    LIST = 'list',
    TASK = 'task'
}

export enum ActionType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    RESTORE = 'restore'
}