import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_ROLE_QUERY } from "./getRole.query";
import type { RoleDetail } from "./getRole.query";

interface RevokePermissionData {
  revokePermission: RoleDetail;
}

const REVOKE_PERMISSION_MUTATION: TypedDocumentNode<
  RevokePermissionData,
  { roleId: string; permissionId: string }
> = gql`
  mutation RevokePermission($roleId: ID!, $permissionId: ID!) {
    revokePermission(roleId: $roleId, permissionId: $permissionId) {
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

export function useRevokePermission(roleId: string) {
  return useMutation(REVOKE_PERMISSION_MUTATION, {
    refetchQueries: [{ query: GET_ROLE_QUERY, variables: { id: roleId } }],
  });
}
