import {UiView} from "@/components/UiView";
import {UiHeader} from "@/components/UiHeader";
import {UiText} from "@/components/UiText";

export default function Papeleria(){
    return (

            <UiView bgColor>
                <UiHeader title='Papeleria' icon='arrow-back' />

                <UiView margin bgColor>
                        <UiText type='title' color='orange'>Papeleria</UiText>
                </UiView>

            </UiView>
    )
}