import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token) => {
    // await AsyncStorage.setItem("token", JSON.stringify(token));
    await AsyncStorage.multiSet([
        ["token", token],
        ["loggedIn", "yes"],
    ]);
    isLoggedInVar(true);
    tokenVar(token);
};

const client = new ApolloClient({
    // uri: "http://localhost:4000/graphql",
    uri: "https://moody-fox-43.loca.lt/graphql",
    cache: new InMemoryCache(),
});

export default client;