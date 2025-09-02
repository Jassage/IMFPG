import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteUncheckedCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedCreateWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteUncheckedCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  prerequisiteId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
