import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { User } from "./users.query";

export interface GetUserData {
  user: User;
}

export const GET_USER_QUERY: TypedDocumentNode<GetUserData, { id: string }> =
  gql`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        username
        isActive
        createdAt
      }
    }
  `;

export function useGetUser(id: string) {
  const { data, ...res } = useQuery(GET_USER_QUERY, {
    variables: { id },
  });

  return {
    ...res,
    user: data?.user ?? null,
  };
}
