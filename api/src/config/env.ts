import { z } from 'zod';

const environmentSchema = z.object({
  ALLOWED_ORIGINS: z.string().default('http://localhost:8081'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_URL: z.url().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function readEnvironment(source: Record<string, string | undefined>) {
  return environmentSchema.parse(source);
}
