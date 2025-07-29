import {View, ViewProps} from "react-native";

interface Props extends ViewProps{
    flexRow?: boolean
    paddingB?: 'sm' | 'md' | 'lg'
    paddingT?: 'sm' | 'md' | 'lg'
    justifyContent?: 'center' | 'space-between' | 'flex-start' | 'flex-end'

}

export const UiViewAdd = ({flexRow,children,paddingB,paddingT,style,justifyContent, ...rest}:Props)=> {
    return (
        <View style={[style,{
            flexDirection: flexRow ? 'row' : 'column',

            justifyContent: justifyContent === 'space-between' ? 'space-between' :
                justifyContent === 'flex-start' ? 'flex-start' :
                justifyContent === 'flex-end' ? 'flex-end' :
                justifyContent === 'center' ? 'center' : undefined,

            alignItems: flexRow ? 'center' : undefined ,
            paddingBottom: flexRow ? 0 : 10,
            gap: flexRow ? 0 : 20
        }, {
            paddingBottom: paddingB === 'sm' ? 0 :
                            paddingB === 'md' ? 10 :
                            paddingB === 'lg' ? 25 : undefined,
        }, {
            paddingTop: paddingT === 'sm' ? 0 :
                paddingT === 'md' ? 10 :
                    paddingT === 'lg' ? 35 : undefined
        }]}
            {...rest}
        >
            {children}
        </View>
    )
}