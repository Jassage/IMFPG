import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { EnumUETypeFieldUpdateOperationsInputObjectSchema } from './EnumUETypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema } from './UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInput.schema';
import { UEPrerequisiteUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './UEPrerequisiteUncheckedUpdateManyWithoutUeNestedInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutUeNestedInput.schema';
import { GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutUeNestedInput.schema';
import { RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './RetakeUncheckedUpdateManyWithoutUeNestedInput.schema'

export const UEUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.UEUncheckedUpdateInput, z.ZodTypeDef, Prisma.UEUncheckedUpdateInput> = z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdById: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
export const UEUncheckedUpdateInputObjectZodSchema = z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdById: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
