import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementCreateManyInputObjectSchema: z.ZodType<Prisma.AnnouncementCreateManyInput, z.ZodTypeDef, Prisma.AnnouncementCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional()
}).strict();
export const AnnouncementCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  publishDate: z.date(),
  expiryDate: z.date().nullish(),
  targetAudience: z.string(),
  priority: z.string(),
  isActive: z.boolean().optional()
}).strict();
