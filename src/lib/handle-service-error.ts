import axios from "axios";
import { ZodError } from "zod";

export function handleServiceError(error: unknown, fallback: string): never {
  if (error instanceof ZodError) {
    console.error(
      "[Schema mismatch]",
      JSON.stringify(error.flatten(), null, 2),
    );
    throw new Error(`Invalid response format: ${fallback}`);
  }
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message ?? fallback);
  }
  throw error instanceof Error ? error : new Error(fallback);
}
