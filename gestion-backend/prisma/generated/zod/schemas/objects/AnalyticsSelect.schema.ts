import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnalyticsSelectObjectSchema: z.ZodType<Prisma.AnalyticsSelect, z.ZodTypeDef, Prisma.AnalyticsSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  data: z.boolean().optional(),
  generatedDate: z.boolean().optional(),
  parameters: z.boolean().optional()
}).strict();
export const AnalyticsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  data: z.boolean().optional(),
  generatedDate: z.boolean().optional(),
  parameters: z.boolean().optional()
}).strict();
