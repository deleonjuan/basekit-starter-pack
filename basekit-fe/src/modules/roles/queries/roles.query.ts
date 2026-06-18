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
  { page: number; limit: number }
> = gql`
  query GetRoles($page: Int!, $limit: Int!) {
    roles(pagination: { page: $page, limit: $limit }) {
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

export function useGetRoles(page = 1, limit = 20) {
  const { data, ...res } = useQuery(GET_ROLES_QUERY, {
    variables: { page, limit },
  });

  return {
    ...res,
    data: {
      ...data?.roles,
      roles: data?.roles.data,
    },
  };
}
