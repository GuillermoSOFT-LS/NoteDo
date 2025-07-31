import {UiText} from "@/app/src/components/UiText";
import {Ionicons} from "@expo/vector-icons";

interface props {
    title: string;
}


export const UiListEmpty = ({title}:props)=> {
    return (

        <UiText
            type="title"
            color="gray"
            style={{
                marginTop: 100,
                padding: 75,
                textAlign: "center",
                justifyContent: "center",
                backgroundColor: "#111",
                borderRadius: 200,
            }}
        >
            <UiText type='title'>{title}</UiText>
            <Ionicons name="albums-outline" size={100} color="white" />

        </UiText>
    )
}