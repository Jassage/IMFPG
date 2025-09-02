import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteMaxAggregateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteMaxAggregateInputType, z.ZodTypeDef, Prisma.UEPrerequisiteMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const UEPrerequisiteMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
