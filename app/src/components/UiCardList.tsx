import {View, ViewProps, StyleSheet, Pressable} from "react-native";
import {UiText} from "@/app/src/components/UiText";
import {UiButtton} from "@/app/src/components/UiButtton";
import {router} from "expo-router";


interface Props extends ViewProps {
    titleList: string
    onPressAdd?: () => void;
    onPressUpdate?: () => void;
}


export const UiCardList = ({titleList,onPressAdd,onPressUpdate,...rest}:Props)=> {
    return (
        <View style={{paddingBottom: 20}}>
            <Pressable style={styles.container} {...rest}
            onPress={()=> router.push({
                pathname: '/src/screens/UpdateList',
                params: { title: titleList, index: 0 } // Assuming index is 0 for simplicity
            })}>

                <UiText type='text' color='orange' style={styles.title}>{titleList}</UiText>

                <View style={styles.footer}>
                    <UiText color='gray'>25/07/2025</UiText>
                    <UiButtton color='gray' icon='time' text='27/07/2025'/>
                </View>
                <UiButtton onPress={onPressAdd} color='white' bgColor='red' icon='remove' text='Eliminar'/>
                <UiButtton onPress={onPressUpdate} color='white' bgColor='green' icon='create' text='Editar'/>

            </Pressable>
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