import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface PersonalSetting {
  key: string;
  value: unknown;
  isDefault: boolean;
}

interface GetPersonalSettingsData {
  personalSettings: PersonalSetting[];
}

const GET_PERSONAL_SETTINGS_QUERY: TypedDocumentNode<
  GetPersonalSettingsData,
  Record<string, never>
> = gql`
  query GetPersonalSettings {
    personalSettings {
      key
      value
      isDefault
    }
  }
`;

export function useGetPersonalSettings({ skip }: { skip?: boolean } = {}) {
  return useQuery(GET_PERSONAL_SETTINGS_QUERY, { skip });
}
