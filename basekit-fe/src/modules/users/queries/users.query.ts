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
  { page: number; limit: number }
> = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(pagination: { page: $page, limit: $limit }) {
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

export function useGetUsers(page = 1, limit = 20) {
  const { data, ...res } = useQuery(GET_USERS_QUERY, {
    variables: { page, limit },
  });

  return {
    ...res,
    data: {
      ...data?.users,
      users: data?.users.data,
    },
  };
}
