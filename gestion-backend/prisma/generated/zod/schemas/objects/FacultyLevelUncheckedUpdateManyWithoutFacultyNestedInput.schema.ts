import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateWithoutFacultyInputObjectSchema } from './FacultyLevelCreateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutFacultyInput.schema';
import { FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema } from './FacultyLevelCreateOrConnectWithoutFacultyInput.schema';
import { FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema } from './FacultyLevelUpsertWithWhereUniqueWithoutFacultyInput.schema';
import { FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema } from './FacultyLevelCreateManyFacultyInputEnvelope.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema } from './FacultyLevelUpdateWithWhereUniqueWithoutFacultyInput.schema';
import { FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema } from './FacultyLevelUpdateManyWithWhereWithoutFacultyInput.schema';
import { FacultyLevelScalarWhereInputObjectSchema } from './FacultyLevelScalarWhereInput.schema'

export const FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInput> = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const FacultyLevelUncheckedUpdateManyWithoutFacultyNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpsertWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpdateWithWhereUniqueWithoutFacultyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUpdateManyWithWhereWithoutFacultyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => FacultyLevelScalarWhereInputObjectSchema), z.lazy(() => FacultyLevelScalarWhereInputObjectSchema).array()]).optional()
}).strict();
