import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface PersonalSettingResult {
  updatePersonalSetting: {
    key: string;
    value: unknown;
    isDefault: boolean;
  };
}

interface UpdatePersonalSettingVars {
  input: { key: string; value: unknown };
}

const UPDATE_PERSONAL_SETTING_MUTATION: TypedDocumentNode<
  PersonalSettingResult,
  UpdatePersonalSettingVars
> = gql`
  mutation UpdatePersonalSetting($input: UpdateSettingInput!) {
    updatePersonalSetting(input: $input) {
      key
      value
      isDefault
    }
  }
`;

export function useUpdatePersonalSetting() {
  return useMutation(UPDATE_PERSONAL_SETTING_MUTATION);
}
