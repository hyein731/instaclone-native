import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import { gql, useLazyQuery } from "@apollo/client";
import DismissKeyboard from "../components/DismissKeyboard";

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MessageText = styled.Text`
  margin-top: 15px;
  color: white;
  font-weight: 600;
`;

const Input = styled.TextInput`
  background-color: rgba(255, 255, 255, 1);
  color: black;
  width: ${(props) => props.width / 1.5}px;
  padding: 5px 10px;
  border-radius: 7px;
`;

export default function Search({ navigation }) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
  // useQuery는 mount 될 때 바로 실행됨. useLazyQuery는 startQueryFn 호출할 때 실행됨
  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
        // keyword: watch("keyword"), // => 이렇게 하면 키 입력할 때 마다 검색
      },
    });
  };

  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="rgba(0, 0, 0, 0.8)"
      placeholder="Search photos"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onValid)}
      // onSubmitEditing={startQueryFn} // => 이렇게 하면 키 입력할 때 마다 검색
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      required: true,
      minLength: 3,
    });
  }, []);

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Photo", {
          photoId: photo.id,
        })
      }
    >
      <Image
        source={{ uri: photo.file }}
        style={{ width: width / numColumns, height: 100 }}
      />
    </TouchableOpacity>
  );

  return (
    <DismissKeyboard>
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
        }}
      >
        { loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null }
        { !called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null }
        { data?.searchPhotos !== undefined ? (
          data?.searchPhotos?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null }
      </View>
    </DismissKeyboard>
  );
}