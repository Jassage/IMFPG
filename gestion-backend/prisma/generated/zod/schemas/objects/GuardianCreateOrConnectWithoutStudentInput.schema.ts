import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianWhereUniqueInputObjectSchema } from './GuardianWhereUniqueInput.schema';
import { GuardianCreateWithoutStudentInputObjectSchema } from './GuardianCreateWithoutStudentInput.schema';
import { GuardianUncheckedCreateWithoutStudentInputObjectSchema } from './GuardianUncheckedCreateWithoutStudentInput.schema'

export const GuardianCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const GuardianCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GuardianWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
