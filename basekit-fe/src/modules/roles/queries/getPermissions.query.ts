import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface Permission {
  id: string;
  value: string;
  description: string | null;
  createdAt: string;
}

export interface GetPermissionsData {
  permissions: {
    data: Permission[];
    page: number;
    total: number;
    perPage: number;
    totalPages: number;
  };
}

export const GET_PERMISSIONS_QUERY: TypedDocumentNode<
  GetPermissionsData,
  { page: number; limit: number }
> = gql`
  query GetPermissions($page: Int!, $limit: Int!) {
    permissions(pagination: { page: $page, limit: $limit }) {
      data {
        id
        value
        description
        createdAt
      }
      page
      total
      perPage
      totalPages
    }
  }
`;

export function useGetPermissions(page = 1, limit = 20) {
  const { data, ...res } = useQuery(GET_PERMISSIONS_QUERY, {
    variables: { page, limit },
  });

  return {
    ...res,
    data: {
      permissions: data?.permissions?.data ?? [],
      page: data?.permissions?.page ?? 1,
      total: data?.permissions?.total ?? 0,
      perPage: data?.permissions?.perPage ?? limit,
      totalPages: data?.permissions?.totalPages ?? 1,
    },
  };
}
