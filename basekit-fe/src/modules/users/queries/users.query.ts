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
  users: User[];
}

export const GET_USERS_QUERY: TypedDocumentNode<
  GetUsersData,
  Record<string, never>
> = gql`
  query GetUsers {
    users {
      id
      username
      isActive
      createdAt
    }
  }
`;

export function useGetUsers() {
  return useQuery(GET_USERS_QUERY);
}
