import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema';
import { AcademicYearUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUpdateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutAssignmentsInput.schema'

export const AcademicYearUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateToOneWithWhereWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const AcademicYearUpdateToOneWithWhereWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
