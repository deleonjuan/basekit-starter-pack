import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_ROLE_QUERY } from "./getRole.query";
import type { RoleDetail } from "./getRole.query";

interface AssignPermissionData {
  assignPermission: RoleDetail;
}

const ASSIGN_PERMISSION_MUTATION: TypedDocumentNode<
  AssignPermissionData,
  { roleId: string; permissionId: string }
> = gql`
  mutation AssignPermission($roleId: ID!, $permissionId: ID!) {
    assignPermission(roleId: $roleId, permissionId: $permissionId) {
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

export function useAssignPermission(roleId: string) {
  return useMutation(ASSIGN_PERMISSION_MUTATION, {
    refetchQueries: [{ query: GET_ROLE_QUERY, variables: { id: roleId } }],
  });
}
