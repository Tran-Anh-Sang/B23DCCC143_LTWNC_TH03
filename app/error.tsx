'use client';
import ResetButton from '@/components/ResetButton';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container page center">
      <h1>Có lỗi xảy ra</h1>
      <p className="muted">{error.message}</p>
      <ResetButton reset={reset} />
    </div>
  );
}
