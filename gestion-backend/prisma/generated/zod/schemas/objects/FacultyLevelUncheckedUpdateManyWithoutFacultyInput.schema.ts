import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const FacultyLevelUncheckedUpdateManyWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedUpdateManyWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedUpdateManyWithoutFacultyInput> = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const FacultyLevelUncheckedUpdateManyWithoutFacultyInputObjectZodSchema = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
