import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UserCreateNestedOneWithoutCreatedUEsInputObjectSchema } from './UserCreateNestedOneWithoutCreatedUEsInput.schema';
import { UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteCreateNestedManyWithoutUeInput.schema';
import { CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutUeInput.schema';
import { GradeCreateNestedManyWithoutUeInputObjectSchema } from './GradeCreateNestedManyWithoutUeInput.schema';
import { RetakeCreateNestedManyWithoutUeInputObjectSchema } from './RetakeCreateNestedManyWithoutUeInput.schema'

export const UECreateWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UECreateWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UECreateWithoutPrerequisitesInput> = z.object({
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
  requiredFor: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UECreateWithoutPrerequisitesInputObjectZodSchema = z.object({
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
  requiredFor: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
