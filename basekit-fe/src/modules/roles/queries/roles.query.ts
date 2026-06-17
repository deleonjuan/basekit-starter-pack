import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface Role {
  id: string;
  name: string;
  createdAt: string;
}

export interface GetRolesData {
  roles: {
    data: Role[];
    page: number;
    total: number;
    perPage: number;
    totalPages: number;
  };
}

export const GET_ROLES_QUERY: TypedDocumentNode<
  GetRolesData,
  Record<string, never>
> = gql`
  query GetRoles {
    roles(pagination: { page: 1, limit: 20 }) {
      data {
        id
        name
        createdAt
      }
      page
      total
      perPage
      totalPages
    }
  }
`;

export function useGetRoles() {
  const { data, ...res } = useQuery(GET_ROLES_QUERY);

  return {
    ...res,
    data: {
      ...data?.roles,
      roles: data?.roles.data,
    },
  };
}
