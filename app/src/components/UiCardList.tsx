import { View,ViewProps, StyleSheet} from "react-native";
import {UiText} from "@/app/src/components/UiText";
import {UiButtton} from "@/app/src/components/UiButtton";


interface Props extends ViewProps {
    titleList: string
}


export const UiCardList = ({titleList,...rest}:Props)=> {
    return (
        <View style={{paddingBottom: 20}}>
            <View style={styles.container} {...rest}>

                <UiText type='text' color='orange' style={styles.title}>{titleList}</UiText>

                <View style={styles.footer}>
                    <UiText color='gray'>25/07/2025</UiText>
                    <UiButtton color='gray' icon='time' text='27/07/2025'/>
                </View>

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 10
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: 'gray',
        borderTopWidth: 1
    },

    title: {
        paddingBottom: 18
    }


})