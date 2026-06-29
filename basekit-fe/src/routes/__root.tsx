import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";

import type { ApolloClientIntegration } from "@apollo/client-integration-tanstack-start";
import { NotFoundScreen } from "#/components/screens/NotFoundScreen";
import { ErrorScreen } from "#/components/screens/ErrorScreen";
import { ThemeProvider, useTheme } from "#/lib/universal-layout";
import { ApolloProvider } from "@apollo/client/react";
import { AppDataLoader } from "#/modules/tenant/TenantInitializer";
import "#/lib/i18n";
import NavigationController from "#/modules/auth/components/NavigationController";

interface MyRouterContext extends ApolloClientIntegration.RouterContext {}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Basekit Starter" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  notFoundComponent: NotFoundScreen,
  errorComponent: ErrorScreen,
  shellComponent: RootComponent,
});

function RootComponent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { apolloClient } = Route.useRouteContext();

  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <RootDocument>
          <AppDataLoader>
            <NavigationController>{children}</NavigationController>
          </AppDataLoader>
        </RootDocument>
      </ApolloProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <html lang="en" className={resolvedTheme} data-theme={resolvedTheme}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
