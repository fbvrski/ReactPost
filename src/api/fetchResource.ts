import { apiClient } from "./apiClient";
import axios from "axios";

export async function fetchResource<T>(path: string): Promise<T[]> {
  try {
    const { data } = await apiClient.get<T[]>(path);
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) throw new Error(err.message);
    throw new Error(`Unexpected error fetching ${path}`);
  }
}
