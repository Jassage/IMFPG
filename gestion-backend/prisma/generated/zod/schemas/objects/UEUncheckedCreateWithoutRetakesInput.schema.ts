import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutUeInput.schema';
import { GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutUeInput.schema'

export const UEUncheckedCreateWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UEUncheckedCreateWithoutRetakesInput, z.ZodTypeDef, Prisma.UEUncheckedCreateWithoutRetakesInput> = z.object({
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
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UEUncheckedCreateWithoutRetakesInputObjectZodSchema = z.object({
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
  assignments: z.lazy(() => CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
