import {UiView} from "@/app/src/components/UiView";
import {UiHeader} from "@/app/src/components/UiHeader";
import {UiText} from "@/app/src/components/UiText";

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