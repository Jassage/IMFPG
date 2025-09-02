import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutPaymentsInputObjectSchema } from './AcademicYearCreateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutPaymentsInput.schema';
import { AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutPaymentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema'

export const AcademicYearCreateNestedOneWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateNestedOneWithoutPaymentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateNestedOneWithoutPaymentsInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateNestedOneWithoutPaymentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
