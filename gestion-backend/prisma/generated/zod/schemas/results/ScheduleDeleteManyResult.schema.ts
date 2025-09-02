import { z } from 'zod';
export const ScheduleDeleteManyResultSchema = z.object({
  count: z.number()
});