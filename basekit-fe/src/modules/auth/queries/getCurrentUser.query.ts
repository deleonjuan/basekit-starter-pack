import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface GetCurrentUserData {
  me: {
    id: string;
    username: string;
    isSuperAdmin: boolean;
    roles: {
      id: string;
      permissions: {
        id: string;
        value: string;
      }[];
    }[];
  } | null;
}

export const GET_CURRENT_USER_QUERY: TypedDocumentNode<
  GetCurrentUserData,
  Record<string, never>
> = gql`
  query GetCurrentUser {
    me {
      id
      username
      isSuperAdmin
      roles {
        id
        permissions {
          id
          value
        }
      }
    }
  }
`;

export function useGetCurrentUser() {
  return useQuery(GET_CURRENT_USER_QUERY);
}
