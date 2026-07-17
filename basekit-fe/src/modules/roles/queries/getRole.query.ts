import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface RolePermission {
  id: string;
  value: string;
  description: string | null;
  createdAt: string;
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  permissions: RolePermission[];
}

export interface GetRoleData {
  role: RoleDetail;
}

export const GET_ROLE_QUERY: TypedDocumentNode<GetRoleData, { id: string }> =
  gql`
    query GetRole($id: ID!) {
      role(id: $id) {
        id
        name
        description
        isActive
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

export function useGetRole(id: string) {
  const { data, ...res } = useQuery(GET_ROLE_QUERY, {
    variables: { id },
  });

  return {
    ...res,
    role: data?.role ?? null,
  };
}
