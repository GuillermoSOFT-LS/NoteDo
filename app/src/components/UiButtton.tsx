import {Pressable, PressableProps, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";

interface Props extends PressableProps{
    text: string
    icon?: keyof typeof Ionicons.glyphMap;
    bgColor?:boolean;
    color?: 'white' | 'gray' | 'orange'
    type?: 'title' | 'subTitle' | 'text'
}

export const UiButtton = ({type,icon,text,bgColor,color, ...rest }:Props)=> {

  return (
      <Pressable style={[styles.boton,
          {backgroundColor: bgColor ? 'green' : 'transparent'}
      ]} {...rest}>

          <Ionicons name={icon} size={20} color={color} />
          <UiText type={type} color={color}>{text}</UiText>
      </Pressable>
  )
}


const styles = StyleSheet.create({
    boton: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,
    },
})
