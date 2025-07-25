import {UiText} from "@/app/src/components/UiText";
import {UiView} from "@/app/src/components/UiView";
import {UiButtton} from "@/app/src/components/UiButtton";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {UiCardList} from "@/app/src/components/UiCardList";
import {router} from "expo-router";
import {UiHeader} from "@/app/src/components/UiHeader";

export default function Index() {
  return (
      <UiView>

          <UiHeader title='NoteDo'/>

          <UiView bgColor margin>
              <UiViewAdd flexRow>
                  <UiText type='title' color='white'>Listas</UiText>
                  <UiButtton color='white' bgColor icon='add-circle' text='Nueva lista'
                             onPress={()=> router.push('/src/screens/AddList')}/>
              </UiViewAdd>

              <UiCardList titleList='Compras'/>
          </UiView>
      </UiView>


  );
}