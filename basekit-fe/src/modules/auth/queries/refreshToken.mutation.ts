import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

interface RefreshTokenData {
  refreshToken: {
    user: {
      id: string;
      username: string;
    };
  };
}

const REFRESH_TOKEN_MUTATION: TypedDocumentNode<
  RefreshTokenData,
  Record<string, never>
> = gql`
  mutation RefreshToken {
    refreshToken {
      user {
        id
        username
      }
    }
  }
`;

export function useRefreshToken() {
  return useMutation(REFRESH_TOKEN_MUTATION);
}
