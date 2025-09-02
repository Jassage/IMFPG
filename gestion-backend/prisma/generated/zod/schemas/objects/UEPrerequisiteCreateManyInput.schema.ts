import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteCreateManyInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateManyInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateManyInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
