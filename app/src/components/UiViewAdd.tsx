import {View, ViewProps} from "react-native";

interface Props extends ViewProps{
    flexRow?: boolean
}

export const UiViewAdd = ({flexRow,children, ...rest}:Props)=> {
    return (
        <View style={{
            flexDirection: flexRow ? 'row' : 'column',
            justifyContent: flexRow ? 'space-between' : 'center',
            alignItems: flexRow ? 'center' : undefined ,
            paddingBottom: 30,
            gap: 20
        }}
            {...rest}
        >
            {children}
        </View>
    )
}