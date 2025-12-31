import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';

export function useNotifications() {
  const list = useQuery({ queryKey: ['notifications'], queryFn: notificationService.list });
  return { list };
}
