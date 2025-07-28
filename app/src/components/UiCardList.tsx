import {View, ViewProps, StyleSheet, Pressable} from "react-native";
import {UiText} from "@/app/src/components/UiText";
import {UiButtton} from "@/app/src/components/UiButtton";
import {router} from "expo-router";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";


interface Props extends ViewProps {
    titleList: string
    onPressRemove?: () => void;
    onPressUpdate?: () => void;
}


export const UiCardList = ({titleList,onPressRemove,onPressUpdate,...rest}:Props)=> {
    return (
        <View style={{paddingBottom: 10}}>
            <Pressable style={styles.container} {...rest}
            onPress={()=> router.push({
                pathname: '/src/screens/DetailsList',
                params: { title: titleList, index: 0 }
            })}>


                <UiText color='gray'>25/07/2025</UiText>
                <UiViewAdd flexRow>
                   <UiText type='text' color='orange'>{titleList}</UiText>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <UiButtton onPress={onPressUpdate} color='white' bgColor='transparent' icon='create-outline' text=''/>
                        <UiButtton onPress={onPressRemove} color='white' bgColor='transparent' icon='remove' text=''/>
                    </View>

                </UiViewAdd>

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

})