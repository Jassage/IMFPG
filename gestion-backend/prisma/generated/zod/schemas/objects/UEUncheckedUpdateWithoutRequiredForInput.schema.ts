import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { EnumUETypeFieldUpdateOperationsInputObjectSchema } from './EnumUETypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema } from './UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutUeNestedInput.schema';
import { GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './GradeUncheckedUpdateManyWithoutUeNestedInput.schema';
import { RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema } from './RetakeUncheckedUpdateManyWithoutUeNestedInput.schema'

export const UEUncheckedUpdateWithoutRequiredForInputObjectSchema: z.ZodType<Prisma.UEUncheckedUpdateWithoutRequiredForInput, z.ZodTypeDef, Prisma.UEUncheckedUpdateWithoutRequiredForInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdById: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
export const UEUncheckedUpdateWithoutRequiredForInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdById: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUncheckedUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
