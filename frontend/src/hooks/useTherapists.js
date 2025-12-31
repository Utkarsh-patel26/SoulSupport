import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { therapistService } from '@/services/therapistService';

export function useTherapists(params) {
  const list = useQuery({ queryKey: ['therapists', params], queryFn: () => therapistService.getTherapists(params) });
  return { list };
}

export function useTherapist(id) {
  return useQuery({ queryKey: ['therapist', id], queryFn: () => therapistService.getTherapist(id), enabled: !!id });
}

export function useTherapistReviews(id) {
  return useQuery({
    queryKey: ['therapist-reviews', id],
    queryFn: () => therapistService.getReviews(id),
    enabled: !!id,
  });
}

export function useTherapistMutations() {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: ({ id, data }) => therapistService.updateProfile(id, data),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['therapist', variables.id] }),
  });

  const uploadPhoto = useMutation({
    mutationFn: ({ id, file }) => therapistService.uploadPhoto(id, file),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['therapist', variables.id] }),
  });

  return { updateProfile, uploadPhoto };
}
