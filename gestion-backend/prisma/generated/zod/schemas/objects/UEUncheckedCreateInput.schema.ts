import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutPrerequisiteInput.schema';
import { UEPrerequisiteUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedCreateNestedManyWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateNestedManyWithoutUeInput.schema';
import { GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutUeInput.schema';
import { RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema } from './RetakeUncheckedCreateNestedManyWithoutUeInput.schema'

export const UEUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UEUncheckedCreateInput, z.ZodTypeDef, Prisma.UEUncheckedCreateInput> = z.object({
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
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UEUncheckedCreateInputObjectZodSchema = z.object({
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
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
