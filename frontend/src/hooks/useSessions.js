import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';

export function useSessions(params, queryOptions = {}) {
  const list = useQuery({
    queryKey: ['sessions', params],
    queryFn: () => sessionService.getSessions(params),
    ...queryOptions,
  });
  return { list };
}

export function useSessionMutations() {
  const queryClient = useQueryClient();

  const createSession = useMutation({
    mutationFn: sessionService.createSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const createSlotHold = useMutation({
    mutationFn: sessionService.createSlotHold,
  });

  const confirmSlotHold = useMutation({
    mutationFn: ({ holdId, data }) => sessionService.confirmSlotHold(holdId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, data }) => sessionService.updateSessionStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const cancelSession = useMutation({
    mutationFn: ({ id, reason }) => sessionService.cancelSession(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  const updateCompletionStatus = useMutation({
    mutationFn: ({ id, data }) => sessionService.updateCompletionStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  });

  return {
    createSession,
    createSlotHold,
    confirmSlotHold,
    updateStatus,
    cancelSession,
    updateCompletionStatus,
  };
}
