import {View,ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface Props extends ViewProps {
    margin?: boolean
    bgColor?: boolean
    insetNull?: boolean
}

export const UiView = ({margin,bgColor,children,insetNull}:Props)=> {

    const inset = useSafeAreaInsets();

    return (
        <View style={{
            paddingBottom: insetNull ? null : inset.bottom,
            paddingTop: insetNull ? null : inset.top,
            flex: 1,
            backgroundColor: bgColor ? '#000' : '#fff'
        }}>
            <View style={{
                flex: 1,
                marginHorizontal: margin ? 20 : 0,
                paddingTop: 10
            }}>{children}</View>

        </View>
    )
}