import {View, ViewProps} from "react-native";

interface Props extends ViewProps{
    flexRow?: boolean
    paddingB?: 'sm' | 'md' | 'lg'
    paddingT?: 'sm' | 'md' | 'lg'

}

export const UiViewAdd = ({flexRow,children,paddingB,paddingT, ...rest}:Props)=> {
    return (
        <View style={[{
            flexDirection: flexRow ? 'row' : 'column',
            justifyContent: flexRow ? 'space-between' : 'center',
            alignItems: flexRow ? 'center' : undefined ,
            paddingBottom: flexRow ? 0 : 30,
            gap: 20
        }, {
            paddingBottom: paddingB === 'sm' ? 0 :
                            paddingB === 'md' ? 10 :
                            paddingB === 'lg' ? 25 : undefined
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