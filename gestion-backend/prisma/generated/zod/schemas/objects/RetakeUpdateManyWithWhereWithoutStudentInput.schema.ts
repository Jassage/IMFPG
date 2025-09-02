import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeScalarWhereInputObjectSchema } from './RetakeScalarWhereInput.schema';
import { RetakeUpdateManyMutationInputObjectSchema } from './RetakeUpdateManyMutationInput.schema';
import { RetakeUncheckedUpdateManyWithoutStudentInputObjectSchema } from './RetakeUncheckedUpdateManyWithoutStudentInput.schema'

export const RetakeUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => RetakeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateManyMutationInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const RetakeUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateManyMutationInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
