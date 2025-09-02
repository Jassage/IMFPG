import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedCreateWithoutAssignmentsInput.schema';
import { AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateOrConnectWithoutAssignmentsInput.schema';
import { AcademicYearUpsertWithoutAssignmentsInputObjectSchema } from './AcademicYearUpsertWithoutAssignmentsInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema } from './AcademicYearUpdateToOneWithWhereWithoutAssignmentsInput.schema';
import { AcademicYearUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUpdateWithoutAssignmentsInput.schema';
import { AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutAssignmentsInput.schema'

export const AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInput, z.ZodTypeDef, Prisma.AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
export const AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutAssignmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutAssignmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutAssignmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutAssignmentsInputObjectSchema)]).optional()
}).strict();
