import {UiView} from "@/app/src/components/UiView";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {UiTextinput} from "@/app/src/components/UiTextinput";
import {UiButtton} from "@/app/src/components/UiButtton";

const AddList = () => {
    return (
        <UiView bgColor margin>

            <UiViewAdd>
                <UiTextinput placeholder='Nombre de la nueva lista' />
                <UiButtton icon='add' color='white' bgColor text='Crear nueva lista'/>
            </UiViewAdd>

        </UiView>
    )
}

export default AddList;