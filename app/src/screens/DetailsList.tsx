import React from 'react';
import { UiView } from "@/app/src/components/UiView";
import { UiHeader } from "@/app/src/components/UiHeader";
import { useLocalSearchParams } from "expo-router";

const DetailsList = () => {
    const { title } = useLocalSearchParams();

    return (
        <UiView bgColor>
            <UiHeader title={title as string} icon='arrow-back' />
            {/* Aquí irán las tareas de la lista */}
        </UiView>
    );
};

export default DetailsList;