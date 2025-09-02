import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutEnrollmentsInput.schema';
import { AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutEnrollmentsInput.schema';
import { AcademicYearUpsertWithoutEnrollmentsInputObjectSchema } from './AcademicYearUpsertWithoutEnrollmentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema } from './AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInput.schema';
import { AcademicYearUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUpdateWithoutEnrollmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutEnrollmentsInput.schema'

export const AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInput, z.ZodTypeDef, Prisma.AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
export const AcademicYearUpdateOneRequiredWithoutEnrollmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
