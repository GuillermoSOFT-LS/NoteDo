import { UiButtton } from "@/components/UiButtton";
import { UiText } from "@/components/UiText";
import { UiViewAdd } from "@/components/UiViewAdd";
import { UiCardListProps } from "@/types/interfaces";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Checkbox } from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";

export const UiCardList =
    ({titleList, createdAt, onPress, onPressRemove, onPressUpdate, onPressCheck, showChecked, isChecked = false, isSelected = false, onLongPress, reminder,}: UiCardListProps) => {

    const [checked, setChecked] = useState(isChecked);
    return (
        <View style={{ paddingBottom: 10 }}>
            <Pressable
                style={[
                    styles.container,
                    {
                        opacity: checked ? 0.6 : 1,
                        borderColor: isSelected ? 'red' : 'transparent',
                        borderWidth: isSelected ? 2 : 0
                    }
                ]}
                onLongPress={onLongPress}
                onPress={onPress}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 15 }}>
                    <UiText color="gray">
                        {createdAt ? new Date(createdAt).toLocaleDateString("es-ES") : "Fecha desconocida"}
                    </UiText>

                    {reminder && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10}}>
                            <Ionicons name='alarm-outline' color='orange' size={20} />
                            <UiText color="orange">
                                {new Date(`${reminder.date}T${reminder.time}`).toLocaleDateString("es-ES", {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </UiText>
                        </View>

                    ) }

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
                            style={{ textDecorationLine: checked ? "line-through" : "none", maxWidth: 140 }}
                            type="text"
                            color="white"
                        >
                            {titleList}
                        </UiText>
                    </UiViewAdd>
                    <UiViewAdd flexRow>
                        {onPressUpdate && (
                            <UiButtton
                                border
                                onPress={onPressUpdate}
                                color="orange"
                                bgColor="transparent"
                                icon="create-outline"
                                text="Editar"
                            />
                        )}
                        {onPressRemove && (
                            <UiButtton
                                border
                                onPress={onPressRemove}
                                color="orange"
                                bgColor="transparent"
                                icon="trash-outline"
                                text="Eliminar"
                            />
                        )}
                    </UiViewAdd>
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