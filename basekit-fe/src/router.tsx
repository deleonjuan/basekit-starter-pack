import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  ApolloClient,
  InMemoryCache,
  routerWithApolloClient,
} from "@apollo/client-integration-tanstack-start";
import { HttpLink } from "@apollo/client";

export function getRouter() {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
    link: new HttpLink({
      uri: `${import.meta.env.VITE_API_BASE_URL}/api/graphql`,
      credentials: "include",
      headers: {
        "x-tenant": import.meta.env.VITE_TENANT_SLUG,
      },
    }),
  });

  const router = createTanStackRouter({
    routeTree,
    context: {
      ...routerWithApolloClient.defaultContext,
    } as any,
    scrollRestoration: true,
    scrollRestorationBehavior: "smooth",
    defaultPreload: false,
  });

  return routerWithApolloClient(router, apolloClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
