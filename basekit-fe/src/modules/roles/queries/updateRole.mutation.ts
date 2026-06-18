import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export interface UpdateRoleData {
  updateRole: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
  };
}

export const UPDATE_ROLE_MUTATION: TypedDocumentNode<
  UpdateRoleData,
  { id: string; input: UpdateRoleInput }
> = gql`
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      description
      createdAt
    }
  }
`;

export function useUpdateRole() {
  return useMutation(UPDATE_ROLE_MUTATION);
}
