import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
    // await AsyncStorage.multiSet([
    //     ["token", token],
    //     ["loggedIn", "yes"],
    // ]);
    await AsyncStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
    tokenVar(token);
};

export const logUserOut = async () => {
    await AsyncStorage.removeItem(TOKEN);
    isLoggedInVar(false);
    tokenVar(null);
};

const httpLink = createHttpLink({
    // uri: "http://localhost:4000/graphql",
    uri: "https://moody-fox-43.loca.lt/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        token: tokenVar(),
      },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;