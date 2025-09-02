import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema'

export const UECreateManyCreatedByInputObjectSchema: z.ZodType<Prisma.UECreateManyCreatedByInput, z.ZodTypeDef, Prisma.UECreateManyCreatedByInput> = z.object({
  id: z.string().optional(),
  code: z.string(),
  title: z.string(),
  credits: z.number().int(),
  type: UETypeSchema,
  passingGrade: z.number().int().optional(),
  description: z.string().nullish(),
  objectives: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const UECreateManyCreatedByInputObjectZodSchema = z.object({
  id: z.string().optional(),
  code: z.string(),
  title: z.string(),
  credits: z.number().int(),
  type: UETypeSchema,
  passingGrade: z.number().int().optional(),
  description: z.string().nullish(),
  objectives: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
