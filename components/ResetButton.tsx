'use client';
export default function ResetButton({ reset }: { reset: () => void }) {
  return <button className="btn" onClick={() => reset()}>Thử lại</button>;
}
