import { z } from 'zod';
export const EventFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  category: z.string(),
  participants: z.array(z.unknown()),
  isPublic: z.boolean(),
  status: z.string()
}));