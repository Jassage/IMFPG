import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementMaxAggregateInputObjectSchema: z.ZodType<Prisma.AnnouncementMaxAggregateInputType, z.ZodTypeDef, Prisma.AnnouncementMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  content: z.literal(true).optional(),
  authorId: z.literal(true).optional(),
  publishDate: z.literal(true).optional(),
  expiryDate: z.literal(true).optional(),
  targetAudience: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  isActive: z.literal(true).optional()
}).strict();
export const AnnouncementMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  content: z.literal(true).optional(),
  authorId: z.literal(true).optional(),
  publishDate: z.literal(true).optional(),
  expiryDate: z.literal(true).optional(),
  targetAudience: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  isActive: z.literal(true).optional()
}).strict();
