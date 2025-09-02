import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UserCreateNestedOneWithoutCreatedUEsInputObjectSchema } from './UserCreateNestedOneWithoutCreatedUEsInput.schema';
import { UEPrerequisiteCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateNestedManyWithoutPrerequisiteInput.schema';
import { CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutUeInput.schema';
import { GradeCreateNestedManyWithoutUeInputObjectSchema } from './GradeCreateNestedManyWithoutUeInput.schema';
import { RetakeCreateNestedManyWithoutUeInputObjectSchema } from './RetakeCreateNestedManyWithoutUeInput.schema'

export const UECreateWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UECreateWithoutRequiredForInput, z.ZodTypeDef, Prisma.UECreateWithoutRequiredForInput> = z.object({
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
  createdBy: z.lazy(() => UserCreateNestedOneWithoutCreatedUEsInputObjectSchema),
  prerequisites: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UECreateWithoutRequiredForInputObjectZodSchema = z.object({
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
  createdBy: z.lazy(() => UserCreateNestedOneWithoutCreatedUEsInputObjectSchema),
  prerequisites: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutPrerequisiteInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
