import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function LogIn({ navigation }) {
    return (
        <View>
            <Text>LogIn</Text>
            <TouchableOpacity>
                <Text onPress={() => navigation.navigate("CreateAccount")}>
                    Go to Create ACcount
                </Text>
            </TouchableOpacity>
        </View>
    );
}
