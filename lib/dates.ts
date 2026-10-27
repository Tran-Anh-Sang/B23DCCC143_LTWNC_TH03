export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'medium', timeStyle: 'short' });

// Số ngày còn lại (âm = quá hạn)
export const daysLeft = (iso: string, now = Date.now()) =>
  Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
