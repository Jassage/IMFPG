import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteCountAggregateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCountAggregateInputType, z.ZodTypeDef, Prisma.UEPrerequisiteCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const UEPrerequisiteCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  prerequisiteId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
