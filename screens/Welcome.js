import React from "react";
import styled from "styled-components/native";
import { Text, View, TouchableOpacity } from "react-native";
import { colors } from "../colors";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: black;
`;

const Logo = styled.Image`
    max-width: 50%;
    height: 100px;
`;

const CreateAccount = styled.View`
    background-color: ${colors.blue};
    padding: 5px 10px;
    border-radius: 5px;
`;

const CreateAccountText = styled.Text`
    color: white;
    font-weight: 600;
`;

const LoginLink = styled.Text`
    color: ${colors.blue};
    font-weight: 600;
    margin-top: 10px;
`;

export default function Welcome({ navigation }) {
    const goToCreateAccount = () => navigation.navigate("CreateAccount");
    const goToLogin = () => navigation.navigate("Login");
    return (
        <Container>
            <Logo resizeMode="contain" source={require("../assets/logo.png")} />
            <TouchableOpacity onPress={goToCreateAccount}>
                 <CreateAccount>
                     <CreateAccountText>Create Account</CreateAccountText>
                </CreateAccount>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToLogin}>
                <LoginLink>Log in</LoginLink>
            </TouchableOpacity>
        </Container>
    );
}
