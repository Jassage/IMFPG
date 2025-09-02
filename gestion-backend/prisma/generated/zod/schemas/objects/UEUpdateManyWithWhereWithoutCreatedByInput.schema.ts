import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEScalarWhereInputObjectSchema } from './UEScalarWhereInput.schema';
import { UEUpdateManyMutationInputObjectSchema } from './UEUpdateManyMutationInput.schema';
import { UEUncheckedUpdateManyWithoutCreatedByInputObjectSchema } from './UEUncheckedUpdateManyWithoutCreatedByInput.schema'

export const UEUpdateManyWithWhereWithoutCreatedByInputObjectSchema: z.ZodType<Prisma.UEUpdateManyWithWhereWithoutCreatedByInput, z.ZodTypeDef, Prisma.UEUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => UEScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEUpdateManyMutationInputObjectSchema), z.lazy(() => UEUncheckedUpdateManyWithoutCreatedByInputObjectSchema)])
}).strict();
export const UEUpdateManyWithWhereWithoutCreatedByInputObjectZodSchema = z.object({
  where: z.lazy(() => UEScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEUpdateManyMutationInputObjectSchema), z.lazy(() => UEUncheckedUpdateManyWithoutCreatedByInputObjectSchema)])
}).strict();
