import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutProfesseurInputObjectSchema } from './GradeCreateWithoutProfesseurInput.schema';
import { GradeUncheckedCreateWithoutProfesseurInputObjectSchema } from './GradeUncheckedCreateWithoutProfesseurInput.schema';
import { GradeCreateOrConnectWithoutProfesseurInputObjectSchema } from './GradeCreateOrConnectWithoutProfesseurInput.schema';
import { GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema } from './GradeUpsertWithWhereUniqueWithoutProfesseurInput.schema';
import { GradeCreateManyProfesseurInputEnvelopeObjectSchema } from './GradeCreateManyProfesseurInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema } from './GradeUpdateWithWhereUniqueWithoutProfesseurInput.schema';
import { GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema } from './GradeUpdateManyWithWhereWithoutProfesseurInput.schema';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema'

export const GradeUpdateManyWithoutProfesseurNestedInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithoutProfesseurNestedInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithoutProfesseurNestedInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const GradeUpdateManyWithoutProfesseurNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GradeScalarWhereInputObjectSchema), z.lazy(() => GradeScalarWhereInputObjectSchema).array()]).optional()
}).strict();
