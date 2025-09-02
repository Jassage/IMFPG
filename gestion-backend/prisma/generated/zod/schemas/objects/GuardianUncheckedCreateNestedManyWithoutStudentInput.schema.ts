import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianCreateWithoutStudentInputObjectSchema } from './GuardianCreateWithoutStudentInput.schema';
import { GuardianUncheckedCreateWithoutStudentInputObjectSchema } from './GuardianUncheckedCreateWithoutStudentInput.schema';
import { GuardianCreateOrConnectWithoutStudentInputObjectSchema } from './GuardianCreateOrConnectWithoutStudentInput.schema';
import { GuardianCreateManyStudentInputEnvelopeObjectSchema } from './GuardianCreateManyStudentInputEnvelope.schema';
import { GuardianWhereUniqueInputObjectSchema } from './GuardianWhereUniqueInput.schema'

export const GuardianUncheckedCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianUncheckedCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianUncheckedCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GuardianCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GuardianUncheckedCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GuardianCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
