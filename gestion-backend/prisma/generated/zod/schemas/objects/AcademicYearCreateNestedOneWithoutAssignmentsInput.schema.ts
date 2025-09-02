import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutAssignmentsInput.schema';
import { AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutAssignmentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema'

export const AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.AcademicYearCreateNestedOneWithoutAssignmentsInput, z.ZodTypeDef, Prisma.AcademicYearCreateNestedOneWithoutAssignmentsInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
export const AcademicYearCreateNestedOneWithoutAssignmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional()
}).strict();
