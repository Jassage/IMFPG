import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianScalarWhereInputObjectSchema } from './GuardianScalarWhereInput.schema';
import { GuardianUpdateManyMutationInputObjectSchema } from './GuardianUpdateManyMutationInput.schema';
import { GuardianUncheckedUpdateManyWithoutStudentInputObjectSchema } from './GuardianUncheckedUpdateManyWithoutStudentInput.schema'

export const GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => GuardianScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GuardianUpdateManyMutationInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const GuardianUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GuardianScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GuardianUpdateManyMutationInputObjectSchema), z.lazy(() => GuardianUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
