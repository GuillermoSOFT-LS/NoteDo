import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";
import {router} from "expo-router";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";

interface Props {
    icon?: keyof  typeof Ionicons.glyphMap
    title: string
    icon2?: keyof  typeof Ionicons.glyphMap
    marginNull?: boolean
}

export const UiHeader = ({icon,title,icon2,marginNull}:Props)=> {

    return (
        <View style={[styles.container, {marginLeft: marginNull ? 20 : 25}]}>
                <Ionicons name={icon} size={30} color='white' onPress={()=> router.back()}/>
            <UiViewAdd flexRow>
                <Ionicons name={icon2} color='white' size={40}/>
                <UiText type='subTitle' color='white'>{title}</UiText>
            </UiViewAdd>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        gap: 0,
        alignItems: 'center',
    },
})



