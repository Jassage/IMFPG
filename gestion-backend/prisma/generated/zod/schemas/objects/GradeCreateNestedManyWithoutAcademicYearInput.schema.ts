import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateWithoutAcademicYearInputObjectSchema } from './GradeCreateWithoutAcademicYearInput.schema';
import { GradeUncheckedCreateWithoutAcademicYearInputObjectSchema } from './GradeUncheckedCreateWithoutAcademicYearInput.schema';
import { GradeCreateOrConnectWithoutAcademicYearInputObjectSchema } from './GradeCreateOrConnectWithoutAcademicYearInput.schema';
import { GradeCreateManyAcademicYearInputEnvelopeObjectSchema } from './GradeCreateManyAcademicYearInputEnvelope.schema';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema'

export const GradeCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const GradeCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => GradeCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => GradeCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => GradeWhereUniqueInputObjectSchema), z.lazy(() => GradeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
