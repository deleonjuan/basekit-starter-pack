import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface User {
  id: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetUsersData {
  users: {
    data: User[];
    page: number;
    total: number;
    perPage: number;
    totalPages: number;
  };
}

export const GET_USERS_QUERY: TypedDocumentNode<
  GetUsersData,
  { page: number; search: string; limit: number }
> = gql`
  query GetUsers($page: Int!, $limit: Int!, $search: String!) {
    users(pagination: { page: $page, limit: $limit }, search: $search) {
      data {
        id
        username
        isActive
        createdAt
      }
      page
      total
      perPage
      totalPages
    }
  }
`;

export function useGetUsers(page = 1, search = "", limit = 20) {
  const { data, ...res } = useQuery(GET_USERS_QUERY, {
    variables: { page, limit, search },
  });

  return {
    ...res,
    data: {
      ...data?.users,
      users: data?.users.data,
    },
  };
}
