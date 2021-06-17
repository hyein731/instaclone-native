import { ApolloClient, InMemoryCache, makeVar, createHttpLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition, offsetLimitPagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebSocketLink } from "@apollo/client/link/ws";

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

const uploadHttpLink = createUploadLink({
    // uri: "http://localhost:4000/graphql",
    uri: "https://instaclone-backend-ini.herokuapp.com/graphql",
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

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const wsLink = new WebSocketLink({
  // uri: "ws://localhost:4000/graphql",
  uri: "ws://instaclone-backend-ini.herokuapp.com/graphql",
  options: {
    // reconnect: true,
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
    link: splitLink,
    cache,
});

export default client;