export interface TaskList {
    title: string;
    tasks: string[];
}

export interface PropsAdd {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export interface PropsShow {
    setList: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface PropsRemove extends PropsShow {
    indice: number;
}

export interface PropsUpdate {
    listIndex: number;
    taskIndex: number;
    Newtitle: string;
}

export interface PropsAddTask {
    listIndex: number;
    taskTitle: string;
    setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
    setList: React.Dispatch<React.SetStateAction<TaskList[]>>;
}