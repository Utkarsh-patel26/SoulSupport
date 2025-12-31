import { TherapistCard } from './TherapistCard';
import { EmptyState } from '@/components/common/EmptyState';
import { AnimatedCard } from '@/components/common/AnimatedCard';

export function TherapistGrid({ therapists = [], onBook }) {
  if (!therapists.length) {
    return <EmptyState title="No therapists found" description="Try adjusting filters or check back soon." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {therapists.map((therapist, idx) => (
        <AnimatedCard key={therapist._id} delay={0.05 * idx} className="h-full">
          <TherapistCard therapist={therapist} onBook={onBook} />
        </AnimatedCard>
      ))}
    </div>
  );
}
