import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutAssignmentsInput.schema'

export const AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateOrConnectWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateOrConnectWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const AcademicYearCreateOrConnectWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)])
}).strict();
