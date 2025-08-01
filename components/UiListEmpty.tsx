import {UiText} from "@/components/UiText";
import {Ionicons} from "@expo/vector-icons";

interface props {
    title: string;
    type?: 'title' | 'subTitle' | 'text'
}


export const UiListEmpty = ({title,type='title'}:props)=> {
    return (

        <UiText
            type="title"
            color="gray"
            style={{
                marginTop: 100,
                padding: 75,
                textAlign: "center",
                backgroundColor: "#111",
                borderRadius: 200,
            }}
        >
            <UiText type={type}>{title}</UiText>
            <Ionicons name="albums-outline" size={100} color="white" />

        </UiText>
    )
}