import {View,ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface Props extends ViewProps {
    margin?: boolean
    bgColor?: boolean
}

export const UiView = ({margin,bgColor,children}:Props)=> {

    const inset = useSafeAreaInsets();

    return (
        <View style={{
            paddingBottom: inset.bottom,
            paddingTop: inset.top,
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