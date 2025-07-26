import {UiText} from "@/app/src/components/UiText";
import {UiView} from "@/app/src/components/UiView";
import {UiButtton} from "@/app/src/components/UiButtton";
import {UiViewAdd} from "@/app/src/components/UiViewAdd";
import {router} from "expo-router";
import {UiHeader} from "@/app/src/components/UiHeader";
import {useState, useEffect} from "react";
import {useCRUD} from "@/app/src/hook/useCRUD";
import {FlatList} from "react-native";

export default function Index() {

    const [Listas, setListas] = useState<string[]>([])
    const {handleReadList} = useCRUD()


    async function fetchLists() {
        const lists = await handleReadList()
        setListas(lists)
    }
    useEffect(() => {
        fetchLists()
    }, []);


  return (
      <UiView>

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
                      <UiText type='subTitle' color='white'>{item}</UiText>
                  )}
                  />
          </UiView>
      </UiView>


  );
}