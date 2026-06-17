import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface UpdateUserInput {
  username?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  updateUser: {
    id: string;
    username: string;
    isActive: boolean;
    createdAt: string;
  };
}

export const UPDATE_USER_MUTATION: TypedDocumentNode<
  UpdateUserData,
  { id: string; input: UpdateUserInput }
> = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      isActive
      createdAt
    }
  }
`;

export function useUpdateUser() {
  return useMutation(UPDATE_USER_MUTATION);
}
