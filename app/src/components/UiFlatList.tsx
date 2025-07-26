import {FlatList, Text} from "react-native";
import {UiCardList} from "@/app/src/components/UiCardList";

interface Props {
    data: string[]
}

export const UiFlatList = ({data}:Props)=> {
    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <Text></Text>
                )


            }
        />
    )
}