import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export function StationListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height="20px" rounded="md" />
              <Skeleton width="80%" height="16px" rounded="md" />
              <Skeleton width="70%" height="16px" rounded="md" />
            </div>
            <div className="space-y-1">
              <Skeleton width="80px" height="32px" rounded="md" />
              <Skeleton width="50px" height="14px" rounded="md" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Skeleton width="60px" height="22px" rounded="full" />
            <Skeleton width="80px" height="22px" rounded="full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
