import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteCreateManyUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateManyUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateManyUeInput> = z.object({
  id: z.string().optional(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteCreateManyUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
