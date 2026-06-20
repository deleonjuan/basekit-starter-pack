import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

interface CurrentTenantData {
  currentTenant: {
    id: string;
    slug: string;
    name: string;
    configuration: Record<string, unknown> | null;
  } | null;
}

const GET_CURRENT_TENANT_QUERY: TypedDocumentNode<
  CurrentTenantData,
  Record<string, never>
> = gql`
  query GetCurrentTenant {
    currentTenant {
      id
      slug
      name
      configuration
    }
  }
`;

export function useGetCurrentTenant({ skip }: { skip?: boolean } = {}) {
  return useQuery(GET_CURRENT_TENANT_QUERY, { skip });
}
