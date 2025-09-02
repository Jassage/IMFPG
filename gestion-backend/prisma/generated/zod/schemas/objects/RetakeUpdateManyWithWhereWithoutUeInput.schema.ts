import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeScalarWhereInputObjectSchema } from './RetakeScalarWhereInput.schema';
import { RetakeUpdateManyMutationInputObjectSchema } from './RetakeUpdateManyMutationInput.schema';
import { RetakeUncheckedUpdateManyWithoutUeInputObjectSchema } from './RetakeUncheckedUpdateManyWithoutUeInput.schema'

export const RetakeUpdateManyWithWhereWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeUpdateManyWithWhereWithoutUeInput, z.ZodTypeDef, Prisma.RetakeUpdateManyWithWhereWithoutUeInput> = z.object({
  where: z.lazy(() => RetakeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateManyMutationInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
export const RetakeUpdateManyWithWhereWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => RetakeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RetakeUpdateManyMutationInputObjectSchema), z.lazy(() => RetakeUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
