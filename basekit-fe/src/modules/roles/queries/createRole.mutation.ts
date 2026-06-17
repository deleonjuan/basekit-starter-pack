import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_ROLES_QUERY } from "./roles.query";

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface CreateRoleData {
  createRole: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export const CREATE_ROLE_MUTATION: TypedDocumentNode<
  CreateRoleData,
  { input: CreateRoleInput }
> = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      createdAt
    }
  }
`;

export function useCreateRole() {
  return useMutation(CREATE_ROLE_MUTATION, {
    refetchQueries: [{ query: GET_ROLES_QUERY }],
  });
}
