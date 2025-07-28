import {Text, TextProps} from "react-native";


interface Props  extends TextProps{
    type?: 'title' | 'subTitle' | 'text'
    color?: 'white' | 'gray' | 'orange'
}

export const UiText = ({type,children,color,style, ...rest}:Props)=> {
    return (
        <Text style={[style,
            {fontSize: type === 'title' ? 35 :
             type === 'subTitle' ? 25:
             type === 'text' ? 18:undefined
            },

            {color: color === 'white' ? 'white':
              color === 'gray' ? '#D8D8D8':
              color === 'orange' ? 'orange': undefined
            },

        ]} {...rest}>
                {children}
        </Text>
    )
}

