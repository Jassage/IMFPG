import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUpdateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutAssignmentsInput.schema';
import { AcademicYearCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutAssignmentsInput.schema';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearUpsertWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpsertWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearUpsertWithoutAssignmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
