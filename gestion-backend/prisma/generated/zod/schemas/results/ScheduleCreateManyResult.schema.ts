import { z } from 'zod';
export const ScheduleCreateManyResultSchema = z.object({
  count: z.number()
});