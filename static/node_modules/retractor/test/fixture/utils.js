export function uuid() {
  let i;
  let result = '';

  for (i = 0; i < 32; i++) {
    const random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      result += '-';
    }
    // eslint-disable-next-line no-nested-ternary
    result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return result;
}

export function pluralize(count, word) {
  return count === 1 ? word : `${word}s`;
}

export function store(namespace, data) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  const item = localStorage.getItem(namespace);
  return (item && JSON.parse(item)) || [];
}
