import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      id
      username
    }
  }
`;

export function useGetCurrentUser() {
  return useQuery(GET_CURRENT_USER_QUERY);
}
