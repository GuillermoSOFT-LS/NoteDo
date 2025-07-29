import {Pressable, PressableProps, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";

interface Props extends PressableProps{
    text: string
    icon?: keyof typeof Ionicons.glyphMap;
    bgColor?: 'green' | 'transparent' | 'red' | 'white' | 'gray'
    color?: 'white' | 'gray' | 'orange'
    type?: 'title' | 'subTitle' | 'text'
    border?: boolean
}

export const UiButtton = ({type,icon,text,bgColor,color, border,...rest }:Props)=> {

  return (
      <Pressable style={[styles.boton,
          {backgroundColor:
                bgColor === 'green' ? 'green' :
                bgColor === 'red' ? 'red' :
                bgColor === 'transparent' ? 'transparent':
                bgColor === 'white'  ? 'white':
                bgColor === 'gray'  ? 'gray' : undefined,

          borderWidth: border ? 1 : undefined, borderColor: border ? 'gray' : undefined,
          }
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
