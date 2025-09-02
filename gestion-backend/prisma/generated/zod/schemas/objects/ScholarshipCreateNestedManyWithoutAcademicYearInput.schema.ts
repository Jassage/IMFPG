import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateWithoutAcademicYearInput.schema';
import { ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema } from './ScholarshipUncheckedCreateWithoutAcademicYearInput.schema';
import { ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema } from './ScholarshipCreateOrConnectWithoutAcademicYearInput.schema';
import { ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema } from './ScholarshipCreateManyAcademicYearInputEnvelope.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema'

export const ScholarshipCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.ScholarshipCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ScholarshipCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => ScholarshipCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScholarshipCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ScholarshipWhereUniqueInputObjectSchema), z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
