import {View, ViewProps, StyleSheet, Pressable} from "react-native";
import {UiText} from "@/app/src/components/UiText";
import {UiButtton} from "@/app/src/components/UiButtton";
import {router} from "expo-router";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {Checkbox} from "react-native-paper";
import {useState} from "react";

interface Props extends ViewProps {
    titleList: string
    onPressRemove?: () => void;
    onPressUpdate?: () => void;
}


export const UiCardList = ({titleList,onPressRemove,onPressUpdate,...rest}:Props)=> {

    const [Checked, setChecked] = useState(false)



    return (
        <View style={{paddingBottom: 10}}>
            <Pressable style={[styles.container, {opacity: Checked ? 0.6 : 1}]} {...rest}
            onPress={()=> router.push({
                pathname: '/src/screens/DetailsList',
                params: { title: titleList, index: 0 }
            })}>



                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5}}>
                    <UiText color='gray'>25/07/2025</UiText>
                    <UiViewAdd flexRow>
                        {/*<UiButtton onPress={onPressRemove} color='gray' bgColor='transparent' icon='remove' text='Elimit'/>*/}
                    </UiViewAdd>

                </View>

                <UiViewAdd flexRow justifyContent='space-between' paddingB='md'>


                    <UiViewAdd flexRow>
                        <Checkbox status={Checked ? 'checked' : 'unchecked'} onPress={()=> setChecked(!Checked)} color='orange'/>
                        <UiText style={{textDecorationLine: Checked ? 'line-through' : 'none'}} type='text' color='orange'>{titleList}</UiText>
                    </UiViewAdd>
                    <UiButtton border onPress={onPressUpdate} color='gray' bgColor='transparent' icon='create-outline' text='Editar'/>
                </UiViewAdd>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#222'
    },


})