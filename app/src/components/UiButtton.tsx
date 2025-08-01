import {Pressable, PressableProps, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {UiText} from "@/app/src/components/UiText";

interface Props extends PressableProps{
    text: string
    icon?: keyof typeof Ionicons.glyphMap;
    bgColor?: 'orange' | 'transparent' | 'red' | 'white' | 'gray'
    color?: 'white' | 'gray' | 'orange'
    type?: 'title' | 'subTitle' | 'text'
    border?: boolean
    radius?: boolean
}

export const UiButtton = ({type,icon,text,bgColor,color, border,radius,...rest }:Props)=> {

  return (
      <Pressable style={[styles.boton,
          {backgroundColor:
                bgColor === 'orange' ? 'orange' :
                bgColor === 'red' ? 'red' :
                bgColor === 'transparent' ? 'transparent':
                bgColor === 'white'  ? 'white':
                bgColor === 'gray'  ? 'gray' : undefined,

          borderWidth: border ? 1 : undefined, borderColor: border ? 'orange' : undefined,

          borderRadius: radius ? 20 : 10,
          padding: radius ? 20 : 10,
          width: radius ?'40%' : undefined,
          position: radius ? 'absolute' : undefined,
          bottom: radius ? 80 : undefined,
          right: radius ? '3%' : undefined,
          elevation: radius ? 5 : 0,

          }
      ]} {...rest}>

          <Ionicons name={icon} size={20} color={color} />
          <UiText type={type} color={color}>{text}</UiText>
      </Pressable>
  )
}


const styles = StyleSheet.create({
    boton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
})
