import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
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
    tokenVar(null);
    isLoggedInVar(false);
    await AsyncStorage.removeItem(TOKEN);
    cache.reset();
};

const uploadHttpLink = createUploadLink({
    // uri: "http://localhost:4000/graphql",
    uri: "https://fresh-donkey-18.loca.lt/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        token: tokenVar(),
      },
    };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});

export const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
            // seeFeed: {
            //     keyArgs: false,
            //     merge(existing = [], incoming = []) {
            //         return [...existing, ...incoming];
            //     },
            // },
            seeFeed: offsetLimitPagination(),
        },
      },
    },
});

const client = new ApolloClient({
    link: authLink.concat(onErrorLink).concat(uploadHttpLink),
    cache,
});

export default client;