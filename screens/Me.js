import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import useMe from "../hooks/useMe";
import { logUserOut } from "../apollo";
import { colors } from "../colors";

const LogoutText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
`;

export default function Me({ navigation }) {
  const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, [data]);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Me</Text>
      <TouchableOpacity onPress={logUserOut}>
        <LogoutText>Logout</LogoutText>
      </TouchableOpacity>
    </View>
  );
}