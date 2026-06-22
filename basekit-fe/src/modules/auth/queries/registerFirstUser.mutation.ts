import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface RegisterFirstUserData {
  registerFirstUser: { id: string; username: string };
}

interface RegisterFirstUserVars {
  input: { username: string; password: string };
}

const REGISTER_FIRST_USER_MUTATION: TypedDocumentNode<
  RegisterFirstUserData,
  RegisterFirstUserVars
> = gql`
  mutation RegisterFirstUser($input: CreateUserInput!) {
    registerFirstUser(input: $input) {
      id
      username
    }
  }
`;

export function useRegisterFirstUser() {
  return useMutation(REGISTER_FIRST_USER_MUTATION);
}
