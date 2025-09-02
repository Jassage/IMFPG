import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateWithoutPaymentsInputObjectSchema } from './AcademicYearCreateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutPaymentsInput.schema'

export const AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateOrConnectWithoutPaymentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateOrConnectWithoutPaymentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
export const AcademicYearCreateOrConnectWithoutPaymentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)])
}).strict();
