import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginData {
  login: {
    user: {
      id: string;
      username: string;
    };
  };
}

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginData,
  { input: LoginInput }
> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
      }
    }
  }
`;

export function useLogin() {
  return useMutation(LOGIN_MUTATION);
}
