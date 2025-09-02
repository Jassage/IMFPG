import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const FacultyLevelUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedUpdateManyInput> = z.object({
  facultyId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const FacultyLevelUncheckedUpdateManyInputObjectZodSchema = z.object({
  facultyId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
