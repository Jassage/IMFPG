import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutUeInput.schema';
import { GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutUeInput.schema';
import { RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './RetakeUncheckedCreateNestedManyWithoutUeInput.schema'

export const UEUncheckedCreateWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UEUncheckedCreateWithoutCreatedByInput, z.ZodTypeDef, Prisma.UEUncheckedCreateWithoutCreatedByInput> = z.object({
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
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UEUncheckedCreateWithoutCreatedByInputObjectZodSchema = z.object({
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
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
