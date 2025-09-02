import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteScalarWhereInputObjectSchema } from './UEPrerequisiteScalarWhereInput.schema';
import { UEPrerequisiteUpdateManyMutationInputObjectSchema } from './UEPrerequisiteUpdateManyMutationInput.schema';
import { UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInputObjectSchema } from './UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInput.schema'

export const UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInput> = z.object({
  where: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateManyMutationInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpdateManyWithWhereWithoutPrerequisiteInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateManyMutationInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInputObjectSchema)])
}).strict();
