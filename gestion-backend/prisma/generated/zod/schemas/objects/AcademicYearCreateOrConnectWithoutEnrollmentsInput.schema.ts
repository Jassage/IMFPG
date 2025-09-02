import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutEnrollmentsInput.schema'

export const AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateOrConnectWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateOrConnectWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
