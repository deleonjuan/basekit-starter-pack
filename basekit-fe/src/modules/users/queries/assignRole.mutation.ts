import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface AssignRoleData {
  assignRole: {
    id: string;
    roles: {
      id: string;
      name: string;
      description: string | null;
      createdAt: string;
    }[];
  };
}

export const ASSIGN_ROLE_MUTATION: TypedDocumentNode<
  AssignRoleData,
  { userId: string; roleId: string }
> = gql`
  mutation AssignRole($userId: ID!, $roleId: ID!) {
    assignRole(userId: $userId, roleId: $roleId) {
      id
      roles {
        id
        name
        description
        createdAt
      }
    }
  }
`;

export function useAssignRole() {
  return useMutation(ASSIGN_ROLE_MUTATION);
}
