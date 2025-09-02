import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutGradesInputObjectSchema } from './AcademicYearCreateWithoutGradesInput.schema';
import { AcademicYearUncheckedCreateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedCreateWithoutGradesInput.schema';
import { AcademicYearCreateOrConnectWithoutGradesInputObjectSchema } from './AcademicYearCreateOrConnectWithoutGradesInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema'

export const AcademicYearCreateNestedOneWithoutGradesInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateNestedOneWithoutGradesInput, z.ZodTypeDef, Prisma.AcademicYearCreateNestedOneWithoutGradesInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateNestedOneWithoutGradesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
