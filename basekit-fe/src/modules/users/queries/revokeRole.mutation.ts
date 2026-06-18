import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

export interface RevokeRoleData {
  revokeRole: {
    id: string;
    roles: {
      id: string;
      name: string;
      description: string | null;
      createdAt: string;
    }[];
  };
}

export const REVOKE_ROLE_MUTATION: TypedDocumentNode<
  RevokeRoleData,
  { userId: string; roleId: string }
> = gql`
  mutation RevokeRole($userId: ID!, $roleId: ID!) {
    revokeRole(userId: $userId, roleId: $roleId) {
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

export function useRevokeRole() {
  return useMutation(REVOKE_ROLE_MUTATION);
}
