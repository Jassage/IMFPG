import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { EnumUETypeFieldUpdateOperationsInputObjectSchema } from './EnumUETypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { UserUpdateOneRequiredWithoutCreatedUEsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutCreatedUEsNestedInput.schema';
import { UEPrerequisiteUpdateManyWithoutUeNestedInputObjectSchema } from './UEPrerequisiteUpdateManyWithoutUeNestedInput.schema';
import { CourseAssignmentUpdateManyWithoutUeNestedInputObjectSchema } from './CourseAssignmentUpdateManyWithoutUeNestedInput.schema';
import { GradeUpdateManyWithoutUeNestedInputObjectSchema } from './GradeUpdateManyWithoutUeNestedInput.schema';
import { RetakeUpdateManyWithoutUeNestedInputObjectSchema } from './RetakeUpdateManyWithoutUeNestedInput.schema'

export const UEUpdateWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UEUpdateWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UEUpdateWithoutPrerequisitesInput> = z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutCreatedUEsNestedInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
export const UEUpdateWithoutPrerequisitesInputObjectZodSchema = z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([UETypeSchema, z.lazy(() => EnumUETypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  passingGrade: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  objectives: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutCreatedUEsNestedInputObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutUeNestedInputObjectSchema).optional(),
  retakes: z.lazy(() => RetakeUpdateManyWithoutUeNestedInputObjectSchema).optional()
}).strict();
