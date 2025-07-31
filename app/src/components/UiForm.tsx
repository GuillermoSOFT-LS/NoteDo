import { UiView } from "@/app/src/components/UiView";
import { UiViewAdd } from "@/app/src/components/UiViewAdd";
import { UiTextinput } from "@/app/src/components/UiTextinput";
import { UiButtton } from "@/app/src/components/UiButtton";
import { UiHeader } from "@/app/src/components/UiHeader";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    textBtn: string;
    onPress: () => void;
    onChangeText: (text: string) => void;
    placeholder: string;
    value: string;
    headerTitle: string;
    iconBtn: keyof typeof Ionicons.glyphMap
    marginContent?: boolean;
}

const UiForm = ({textBtn,onPress,onChangeText,placeholder,value,headerTitle,iconBtn, marginContent}:Props) => {

    return (
        <UiView bgColor>
            <UiHeader title={headerTitle} icon='arrow-back' />

            <UiView bgColor margin>
                <UiViewAdd>
                    <UiTextinput
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                    />
                    <UiButtton
                        icon={iconBtn}
                        color='white'
                        bgColor='green'
                        text={textBtn}
                        onPress={onPress}
                    />
                </UiViewAdd>
            </UiView>
        </UiView>
    );
};

export default UiForm;
