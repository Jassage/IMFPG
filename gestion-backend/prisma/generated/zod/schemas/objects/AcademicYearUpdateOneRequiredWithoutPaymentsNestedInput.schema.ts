import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutPaymentsInputObjectSchema } from './AcademicYearCreateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutPaymentsInput.schema';
import { AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutPaymentsInput.schema';
import { AcademicYearUpsertWithoutPaymentsInputObjectSchema } from './AcademicYearUpsertWithoutPaymentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearUpdateToOneWithWhereWithoutPaymentsInputObjectSchema } from './AcademicYearUpdateToOneWithWhereWithoutPaymentsInput.schema';
import { AcademicYearUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUpdateWithoutPaymentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutPaymentsInput.schema'

export const AcademicYearUpdateOneRequiredWithoutPaymentsNestedInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateOneRequiredWithoutPaymentsNestedInput, z.ZodTypeDef, Prisma.AcademicYearUpdateOneRequiredWithoutPaymentsNestedInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
export const AcademicYearUpdateOneRequiredWithoutPaymentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutPaymentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutPaymentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutPaymentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutPaymentsInputObjectSchema)]).optional()
}).strict();
