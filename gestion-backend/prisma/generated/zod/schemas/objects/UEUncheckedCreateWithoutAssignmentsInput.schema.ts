import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput.schema';
import { GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutUeInput.schema';
import { RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './RetakeUncheckedCreateNestedManyWithoutUeInput.schema'

export const UEUncheckedCreateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.UEUncheckedCreateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.UEUncheckedCreateWithoutAssignmentsInput> = z.object({
  id: z.string().optional(),
  code: z.string(),
  title: z.string(),
  credits: z.number().int(),
  type: UETypeSchema,
  passingGrade: z.number().int().optional(),
  description: z.string().nullish(),
  objectives: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdById: z.string(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UEUncheckedCreateWithoutAssignmentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  code: z.string(),
  title: z.string(),
  credits: z.number().int(),
  type: UETypeSchema,
  passingGrade: z.number().int().optional(),
  description: z.string().nullish(),
  objectives: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdById: z.string(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
