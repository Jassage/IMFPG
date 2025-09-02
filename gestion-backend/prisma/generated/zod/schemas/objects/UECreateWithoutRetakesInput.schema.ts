import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { UserCreateNestedOneWithoutCreatedUEsInputObjectSchema } from './UserCreateNestedOneWithoutCreatedUEsInput.schema';
import { UEPrerequisiteCreateNestedManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateNestedManyWithoutPrerequisiteInput.schema';
import { UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema } from './UEPrerequisiteCreateNestedManyWithoutUeInput.schema';
import { CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema } from './CourseAssignmentCreateNestedManyWithoutUeInput.schema';
import { GradeCreateNestedManyWithoutUeInputObjectSchema } from './GradeCreateNestedManyWithoutUeInput.schema'

export const UECreateWithoutRetakesInputObjectSchema: z.ZodType<Prisma.UECreateWithoutRetakesInput, z.ZodTypeDef, Prisma.UECreateWithoutRetakesInput> = z.object({
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
  requiredFor: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
export const UECreateWithoutRetakesInputObjectZodSchema = z.object({
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
  requiredFor: z.lazy(() => UEPrerequisiteCreateNestedManyWithoutUeInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentCreateNestedManyWithoutUeInputObjectSchema).optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutUeInputObjectSchema).optional()
}).strict();
