import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface CreateUserInput {
  username: string;
  password: string;
}

export interface CreateUserData {
  createUser: {
    id: string;
    username: string;
    isActive: boolean;
    createdAt: string;
  };
}

export const CREATE_USER_MUTATION: TypedDocumentNode<
  CreateUserData,
  { input: CreateUserInput }
> = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      isActive
      createdAt
    }
  }
`;

export function useCreateUser() {
  return useMutation(CREATE_USER_MUTATION);
}
