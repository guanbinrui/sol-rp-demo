export function parseJSON<T>(raw: string): T | undefined {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.log("Failed to parse JSON:", raw, error);
    return undefined;
  }
}
