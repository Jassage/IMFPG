import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const FacultyLevelUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateManyMutationInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateManyMutationInput> = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const FacultyLevelUpdateManyMutationInputObjectZodSchema = z.object({
  level: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
