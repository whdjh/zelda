import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiRequest } from "./client";
import type {
  AdventurePayload,
  GoBackRequest,
  HintRevealMode,
  RevealHintRequest,
  SelectNextRequest,
} from "./types";

export const adventureKeys = {
  all: ["adventure"] as const,
  detail: (adventureId: string) => ["adventure", adventureId] as const,
};

export const adventureApi = {
  load: (adventureId: string, signal?: AbortSignal) =>
    apiRequest<AdventurePayload>(`/api/adventure?id=${encodeURIComponent(adventureId)}`, { signal }),

  selectNext: (body: SelectNextRequest) =>
    apiRequest<AdventurePayload, SelectNextRequest>("/api/adventure/next", {
      method: "POST",
      body,
    }),

  goBack: (body: GoBackRequest) =>
    apiRequest<AdventurePayload, GoBackRequest>("/api/adventure/back", {
      method: "POST",
      body,
    }),

  revealHint: (body: RevealHintRequest) =>
    apiRequest<AdventurePayload, RevealHintRequest>("/api/adventure/hint", {
      method: "POST",
      body,
    }),
};

export function useAdventureQuery(adventureId: string | null | undefined) {
  return useQuery({
    queryKey: adventureKeys.detail(adventureId ?? ""),
    queryFn: ({ signal }) => adventureApi.load(adventureId!, signal),
    enabled: Boolean(adventureId),
  });
}

export function useLoginAdventureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adventureId: string) => adventureApi.load(adventureId),
    onSuccess: (payload) => {
      queryClient.setQueryData(adventureKeys.detail(payload.adventureId), payload);
    },
  });
}

export function useSelectNextCardMutation(adventureId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nextCardId: string) =>
      adventureApi.selectNext({ adventureId: adventureId!, nextCardId }),
    onSuccess: (payload) => {
      queryClient.setQueryData(adventureKeys.detail(payload.adventureId), payload);
    },
  });
}

export function useGoBackCardMutation(adventureId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adventureApi.goBack({ adventureId: adventureId! }),
    onSuccess: (payload) => {
      queryClient.setQueryData(adventureKeys.detail(payload.adventureId), payload);
    },
  });
}

export function useRevealHintMutation(adventureId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mode: HintRevealMode) =>
      adventureApi.revealHint({ adventureId: adventureId!, mode }),
    onSuccess: (payload) => {
      queryClient.setQueryData(adventureKeys.detail(payload.adventureId), payload);
    },
  });
}
