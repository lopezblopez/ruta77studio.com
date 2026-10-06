export function tokyoToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const part = type => parts.find(p => p.type === type).value;
  return part('year') + '-' + part('month') + '-' + part('day');
}

export function validateStay(values, today = tokyoToday()) {
  if (!String(values.name ?? '').trim()) return 'nameError';
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(values.arrival) || !iso.test(values.departure)) return 'dateError';
  for (const value of [values.arrival, values.departure]) {
    const parsed = new Date(value + 'T00:00:00Z');
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return 'dateError';
  }
  if (values.arrival < today) return 'pastError';
  if (values.departure <= values.arrival) return 'dateError';
  const adults = Number(values.adults), children = Number(values.children);
  if (!Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0 || adults + children > 8) return 'guestError';
  return null;
}

export function buildEnquiry(values, labels, subject) {
  return subject + '\n\n' + [
    [labels[0], values.name], [labels[1], values.arrival], [labels[2], values.departure],
    [labels[3], values.adults], [labels[4], values.children], [labels[5], values.message]
  ].filter(([, v]) => String(v ?? '').trim()).map(([k, v]) => k + ': ' + String(v).trim()).join('\n');
}

export function mailDraft(email, subject, message) {
  return 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
}
