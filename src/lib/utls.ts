export function eLog<T = unknown>(logs: T) {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
  ) {
    console.log(logs);
  }
}

export function toJSON<T = unknown>(data: T) {
  if (data) return JSON.parse(JSON.stringify(data)) as T;
  return data;
}

export function formatBalance(balance: number, decimal = 3) {
  const multiplier = Math.pow(10, decimal);
  return Math.trunc(balance * multiplier) / multiplier;
}

export function isDev(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
  );
}
