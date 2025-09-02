import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutLevelsNestedInput.schema'

export const FacultyLevelUpdateWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateWithoutAssignmentsInput> = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema).optional()
}).strict();
export const FacultyLevelUpdateWithoutAssignmentsInputObjectZodSchema = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutLevelsNestedInputObjectSchema).optional()
}).strict();
