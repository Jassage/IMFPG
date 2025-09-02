import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteMinAggregateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteMinAggregateInputType, z.ZodTypeDef, Prisma.UEPrerequisiteMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const UEPrerequisiteMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
