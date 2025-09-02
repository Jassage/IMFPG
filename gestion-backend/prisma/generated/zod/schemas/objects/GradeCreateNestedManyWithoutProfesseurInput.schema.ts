import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutProfesseurInputObjectSchema } from './GradeCreateWithoutProfesseurInput.schema';
import { GradeUncheckedCreateWithoutProfesseurInputObjectSchema } from './GradeUncheckedCreateWithoutProfesseurInput.schema';
import { GradeCreateOrConnectWithoutProfesseurInputObjectSchema } from './GradeCreateOrConnectWithoutProfesseurInput.schema';
import { GradeCreateManyProfesseurInputEnvelopeObjectSchema } from './GradeCreateManyProfesseurInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema'

export const GradeCreateNestedManyWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeCreateNestedManyWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeCreateNestedManyWithoutProfesseurInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GradeCreateNestedManyWithoutProfesseurInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutProfesseurInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyProfesseurInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
