import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedCreateWithoutPrerequisiteInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UEPrerequisiteUncheckedCreateWithoutPrerequisiteInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
