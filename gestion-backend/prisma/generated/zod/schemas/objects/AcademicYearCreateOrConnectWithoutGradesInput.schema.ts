import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateWithoutGradesInputObjectSchema } from './AcademicYearCreateWithoutGradesInput.schema';
import { AcademicYearUncheckedCreateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedCreateWithoutGradesInput.schema'

export const AcademicYearCreateOrConnectWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateOrConnectWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearCreateOrConnectWithoutGradesInput> = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
export const AcademicYearCreateOrConnectWithoutGradesInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)])
}).strict();
