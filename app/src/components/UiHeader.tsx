import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";
import {router} from "expo-router";

interface Props {
    icon?: keyof  typeof Ionicons.glyphMap
    title: string
}

export const UiHeader = ({icon,title}:Props)=> {

    return (
        <View style={styles.container}>
                <Ionicons name={icon} size={22} color='orange' onPress={()=> router.dismiss()}/>
                <UiText type='subTitle' color='orange'>{title}</UiText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        backgroundColor: '#000',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        paddingLeft: 15
    },
})



