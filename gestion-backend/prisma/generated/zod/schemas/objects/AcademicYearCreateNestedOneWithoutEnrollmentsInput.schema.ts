import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutEnrollmentsInput.schema';
import { AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutEnrollmentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema'

export const AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateNestedOneWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateNestedOneWithoutEnrollmentsInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateNestedOneWithoutEnrollmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
