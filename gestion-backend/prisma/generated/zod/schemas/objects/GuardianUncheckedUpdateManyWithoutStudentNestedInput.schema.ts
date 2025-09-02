import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianCreateWithoutStudentInputObjectSchema } from './GuardianCreateWithoutStudentInput.schema';
import { GuardianUncheckedCreateWithoutStudentInputObjectSchema } from './GuardianUncheckedCreateWithoutStudentInput.schema';
import { GuardianCreateOrConnectWithoutStudentInputObjectSchema } from './GuardianCreateOrConnectWithoutStudentInput.schema';
import { GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './GuardianUpsertWithWhereUniqueWithoutStudentInput.schema';
import { GuardianCreateManyStudentInputEnvelopeObjectSchema } from './GuardianCreateManyStudentInputEnvelope.schema';
import { GuardianWhereUniqueInputObjectSchema } from './GuardianWhereUniqueInput.schema';
import { GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './GuardianUpdateWithWhereUniqueWithoutStudentInput.schema';
import { GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema } from './GuardianUpdateManyWithWhereWithoutStudentInput.schema';
import { GuardianScalarWhereInputObjectSchema } from './GuardianScalarWhereInput.schema'

export const GuardianUncheckedUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.GuardianUncheckedUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.GuardianUncheckedUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GuardianCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GuardianUncheckedUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => GuardianUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => GuardianCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GuardianCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GuardianWhereUniqueInputObjectSchema), z.lazy(() => GuardianWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => GuardianUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GuardianScalarWhereInputObjectSchema), z.lazy(() => GuardianScalarWhereInputObjectSchema).array()]).optional()
}).strict();
