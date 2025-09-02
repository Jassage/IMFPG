import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteScalarWhereInputObjectSchema } from './UEPrerequisiteScalarWhereInput.schema';
import { UEPrerequisiteUpdateManyMutationInputObjectSchema } from './UEPrerequisiteUpdateManyMutationInput.schema';
import { UEPrerequisiteUncheckedUpdateManyWithoutUeInputObjectSchema } from './UEPrerequisiteUncheckedUpdateManyWithoutUeInput.schema'

export const UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateManyWithWhereWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateManyWithWhereWithoutUeInput> = z.object({
  where: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateManyMutationInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
export const UEPrerequisiteUpdateManyWithWhereWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => UEPrerequisiteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => UEPrerequisiteUpdateManyMutationInputObjectSchema), z.lazy(() => UEPrerequisiteUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
