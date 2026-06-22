import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

interface GlobalSetting {
  key: string;
  value: unknown;
}

interface GetGlobalSettingsData {
  globalSettings: GlobalSetting[];
}

const GET_GLOBAL_SETTINGS_QUERY: TypedDocumentNode<
  GetGlobalSettingsData,
  Record<string, never>
> = gql`
  query GetGlobalSettings {
    globalSettings {
      key
      value
    }
  }
`;

export function useGetGlobalSettings() {
  return useQuery(GET_GLOBAL_SETTINGS_QUERY);
}
