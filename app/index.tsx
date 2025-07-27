import {UiText} from "@/app/src/components/UiText";
import {UiView} from "@/app/src/components/UiView";
import {UiButtton} from "@/app/src/components/UiButtton";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {router,useFocusEffect} from "expo-router";
import {UiHeader} from "@/app/src/components/UiHeader";
import {useState, useCallback} from "react";
import {FlatList} from "react-native";
import {UiCardList} from "@/app/src/components/UiCardList";
import {useCRUD} from "@/app/src/hook/useCRUD";

export default function Index() {

    const [Listas, setListas] = useState<string[]>([])
    const {ShowList} = useCRUD()



    useFocusEffect(
        useCallback(() => {
            const loadList = async () => {
                await ShowList({ setList: setListas });
            };
            loadList();
        }, [setListas])
    );


  return (
      <UiView bgColor>
          <UiHeader title='NoteDo'/>

          <UiView bgColor margin>
              <UiViewAdd flexRow>
                  <UiText type='title' color='white'>Listas</UiText>
                  <UiButtton color='white' bgColor icon='add-circle' text='Nueva lista'
                             onPress={()=> router.push('/src/screens/AddList')}/>
              </UiViewAdd>

                  <FlatList
                      data={Listas}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => (
                                <UiCardList titleList={item} />
                      )}/>

          </UiView>
      </UiView>


  );
}