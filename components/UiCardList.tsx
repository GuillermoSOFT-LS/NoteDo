import { View, StyleSheet, Pressable } from "react-native";
import { UiText } from "@/components/UiText";
import { UiButtton } from "@/components/UiButtton";
import { router } from "expo-router";
import { UiViewAdd } from "@/components/UiViewAdd";
import { Checkbox } from "react-native-paper";
import { useState } from "react";

interface Props {
    titleList: string;
    createdAt?: string;
    onPressRemove?: () => void;
    onPressUpdate?: () => void;
    showChecked?: boolean;
    onLongPress?: () => void;
}

export const UiCardList = ({
                               titleList,
                               createdAt,
                               onPressRemove,
                               onPressUpdate,
                               showChecked,
                               onLongPress,
                           }: Props) => {
    const [Checked, setChecked] = useState(false);
    return (
        <View style={{ paddingBottom: 10 }}>
            <Pressable
                style={[styles.container, { opacity: Checked ? 0.6 : 1 }]}
                onLongPress={onLongPress}
                onPress={() => router.push({ pathname: "/tabs/screens/DetailsList", params: { title: titleList } })}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 5 }}>
                    <UiText color="gray">
                        {createdAt ? new Date(createdAt).toLocaleDateString("es-ES") : "Fecha desconocida"}
                    </UiText>
                </View>

                <UiViewAdd flexRow justifyContent="space-between" paddingB="md">
                    <UiViewAdd flexRow>
                        {showChecked && (
                            <Checkbox
                                status={Checked ? "checked" : "unchecked"}
                                onPress={() => setChecked(!Checked)}
                                color="orange"
                            />
                        )}
                        <UiText
                            style={{ textDecorationLine: Checked ? "line-through" : "none", maxWidth: 180 }}
                            type="text"
                            color="white"
                        >
                            {titleList}
                        </UiText>
                    </UiViewAdd>
                    <UiButtton border onPress={onPressUpdate} color="orange" bgColor="transparent" icon="create-outline" text="Editar" />
                </UiViewAdd>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#222",
    },
});