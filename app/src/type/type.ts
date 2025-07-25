export interface List{
    id:string;
    date:string;
    title:string;
    task: Task[]
}

export interface Task{
    id:string;
    title:string;
    description:string;
    date:string;
    nitifications: string;

}