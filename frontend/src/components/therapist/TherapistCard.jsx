import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, CheckCircle } from 'lucide-react';
import { getDefaultAvatarPath } from '@/lib/avatar';
import { SeededImage } from '@/components/ui/SeededImage';

function normalize(therapist) {
  const user = therapist?.user || {};
  const name = therapist?.fullName || user.fullName || 'Therapist';
  return {
    id: therapist?._id || therapist?.id,
    name,
    photo: therapist?.photoUrl || user.avatarUrl || getDefaultAvatarPath(name),
    specializations: therapist?.specializations || therapist?.tags || [],
    bio: therapist?.bio || user.bio,
    rating: therapist?.rating || 0,
    totalReviews: therapist?.totalReviews || 0,
    isVerified: therapist?.isVerified || false,
    hourlyRate: therapist?.hourlyRate || 0,
    qualifications: therapist?.qualifications || 'Experienced therapist',
  };
}

export function TherapistCard({ therapist, onBook }) {
  const data = normalize(therapist);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {/* Photo */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        <SeededImage
          src={data.photo}
          seed={data.name}
          category="therapist"
          alt={data.name}
          fill
          className="object-cover"
        />
        {data.isVerified && (
          <Badge className="absolute top-3 right-3 bg-primary-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{data.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{data.qualifications}</p>

        {/* Rating */}
        {data.rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < Math.floor(data.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">
              {data.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({data.totalReviews} reviews)
            </span>
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {data.bio || 'Experienced therapist ready to help you.'}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {data.specializations.slice(0, 3).map((spec) => (
            <Badge key={spec} tone="info">
              {spec}
            </Badge>
          ))}
          {data.specializations.length > 3 && (
            <Badge tone="info">+{data.specializations.length - 3}</Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-primary-600">${data.hourlyRate}</span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/therapists/${data.id}`}>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </Link>
            {onBook && (
              <Button size="sm" onClick={() => onBook(therapist)}>
                Book
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
