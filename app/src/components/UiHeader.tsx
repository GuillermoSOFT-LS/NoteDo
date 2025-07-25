import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";

interface Props {
    icon?: keyof  typeof Ionicons.glyphMap
}

export const UiHeader = ({icon}:Props)=> {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={22} color='orange' />
            <UiText type='subTitle' color='orange'>NoteDo</UiText>
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
        padding: 10
    },
    title: {
        fontSize: 50,
        color: 'orange',
    }
})

