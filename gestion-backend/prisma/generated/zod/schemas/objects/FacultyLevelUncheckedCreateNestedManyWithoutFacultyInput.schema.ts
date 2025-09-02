import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelCreateWithoutFacultyInputObjectSchema } from './FacultyLevelCreateWithoutFacultyInput.schema';
import { FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutFacultyInput.schema';
import { FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema } from './FacultyLevelCreateOrConnectWithoutFacultyInput.schema';
import { FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema } from './FacultyLevelCreateManyFacultyInputEnvelope.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './FacultyLevelWhereUniqueInput.schema'

export const FacultyLevelUncheckedCreateNestedManyWithoutFacultyInputObjectSchema: z.ZodType<Prisma.FacultyLevelUncheckedCreateNestedManyWithoutFacultyInput, z.ZodTypeDef, Prisma.FacultyLevelUncheckedCreateNestedManyWithoutFacultyInput> = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const FacultyLevelUncheckedCreateNestedManyWithoutFacultyInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateWithoutFacultyInputObjectSchema).array(), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutFacultyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema), z.lazy(() => FacultyLevelCreateOrConnectWithoutFacultyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => FacultyLevelCreateManyFacultyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema), z.lazy(() => FacultyLevelWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
