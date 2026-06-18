import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_ROLE_QUERY } from "./getRole.query";
import type { RoleDetail } from "./getRole.query";

interface SyncPermissionsData {
  syncPermissions: RoleDetail;
}

const SYNC_PERMISSIONS_MUTATION: TypedDocumentNode<
  SyncPermissionsData,
  { roleId: string; assign: string[]; revoke: string[] }
> = gql`
  mutation SyncPermissions($roleId: ID!, $assign: [ID!]!, $revoke: [ID!]!) {
    syncPermissions(roleId: $roleId, assign: $assign, revoke: $revoke) {
      id
      name
      description
      createdAt
      permissions {
        id
        value
        description
        createdAt
      }
    }
  }
`;

export function useSyncPermissions(roleId: string) {
  return useMutation(SYNC_PERMISSIONS_MUTATION, {
    refetchQueries: [{ query: GET_ROLE_QUERY, variables: { id: roleId } }],
  });
}
