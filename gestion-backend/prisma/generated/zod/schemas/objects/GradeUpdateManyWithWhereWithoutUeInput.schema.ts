import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './GradeUpdateManyMutationInput.schema';
import { GradeUncheckedUpdateManyWithoutUeInputObjectSchema } from './GradeUncheckedUpdateManyWithoutUeInput.schema'

export const GradeUpdateManyWithWhereWithoutUeInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithWhereWithoutUeInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithWhereWithoutUeInput> = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
export const GradeUpdateManyWithWhereWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
