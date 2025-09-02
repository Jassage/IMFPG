import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteCreateManyPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateManyPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateManyPrerequisiteInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteCreateManyPrerequisiteInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
