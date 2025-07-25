import {TextInput,TextInputProps, StyleSheet} from "react-native";


interface Props extends TextInputProps {
    placeholder: string;
    color?: string;
}

export const UiTextinput = ({placeholder, color,...rest}:Props)=> {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor='#D8D8D8'
            autoFocus={true}
         {...rest}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#1E1E1E',
        color: '#FFF',
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,

    }
})

