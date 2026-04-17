import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export default function StationDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <Skeleton width="24px" height="24px" rounded="md" />
        <div className="space-y-1">
          <Skeleton width="160px" height="22px" rounded="md" />
          <Skeleton width="120px" height="16px" rounded="md" />
        </div>
      </header>
      <Skeleton width="100%" height="50vh" rounded="md" />
      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col items-center justify-center py-4">
              <Skeleton width="70px" height="32px" rounded="md" />
              <Skeleton width="50px" height="14px" rounded="md" className="mt-1" />
            </Card>
          ))}
        </div>
        <Card>
          <Skeleton width="120px" height="20px" rounded="md" className="mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton width="60px" height="16px" rounded="md" />
                <Skeleton width="100px" height="16px" rounded="md" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
