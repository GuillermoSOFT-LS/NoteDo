import { View, StyleSheet, Pressable } from "react-native";
import { UiText } from "@/components/UiText";
import { UiButtton } from "@/components/UiButtton";
import { UiViewAdd } from "@/components/UiViewAdd";
import { Checkbox } from "react-native-paper";
import { useState } from "react";
import { UiCardListProps } from "@/types/interfaces";

export const UiCardList = ({
                               titleList,
                               createdAt,
                               onPress,
                               onPressRemove,
                               onPressUpdate,
                               onPressCheck,
                               showChecked,
                               isChecked = false,
                               isSelected = false,
                               onLongPress,
                           }: UiCardListProps) => {
    const [checked, setChecked] = useState(isChecked);
    return (
        <View style={{ paddingBottom: 10 }}>
            <Pressable
                style={[
                    styles.container,
                    {
                        opacity: checked ? 0.6 : 1,
                        borderColor: isSelected ? 'orange' : 'transparent',
                        borderWidth: isSelected ? 2 : 0
                    }
                ]}
                onLongPress={onLongPress}
                onPress={onPress}
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
                                status={checked ? "checked" : "unchecked"}
                                onPress={() => {
                                    setChecked(!checked);
                                    onPressCheck?.();
                                }}
                                color="orange"
                            />
                        )}
                        <UiText
                            style={{ textDecorationLine: checked ? "line-through" : "none", maxWidth: 180 }}
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