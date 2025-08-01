import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {Ionicons} from "@expo/vector-icons";
import {TextInput} from "react-native-paper";
import React from "react";

interface Props {
    textBtn: string;
    onPress: () => void;
    onChangeText: (text: string) => void;
    placeholder: string;
    value: string;
    headerTitle: string;
    iconBtn: keyof typeof Ionicons.glyphMap
}

const UiForm = ({textBtn,onPress,onChangeText,value,headerTitle,iconBtn,placeholder}:Props) => {

    return (
        <UiView bgColor>
            <UiHeader title={headerTitle} icon='arrow-back' />

            <UiView bgColor margin insetNull>
                <UiViewAdd>

                    <TextInput
                        mode="outlined"
                        label={placeholder}
                        right={<TextInput.Affix text="/100" />}
                        value={value}
                        onChangeText={onChangeText}
                        textColor='#D8D8D8'
                        style={{
                            backgroundColor: '#000',
                        }}
                        theme={{
                            colors: {
                                primary: 'orange',
                            },
                        }}
                    />

                    <UiButtton
                        icon={iconBtn}
                        color='white'
                        bgColor='orange'
                        text={textBtn}
                        onPress={onPress}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default UiForm;
