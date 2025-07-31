import {Text, TextProps} from "react-native";

interface Props  extends TextProps{
    type?: 'title' | 'subTitle' | 'text'
    color?: 'white' | 'gray' | 'orange'
    paddingB?: boolean
}

export const UiText = ({type,children,color,style,paddingB, ...rest}:Props)=> {
    return (
        <Text style={[style,
            {fontSize: type === 'title' ? 32 :
                type === 'subTitle' ? 25:
                type === 'text' ? 18: undefined,

             paddingBottom: paddingB ? 20 : 0,
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

