import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUpdateWithoutAssignmentsInput.schema';
import { FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutAssignmentsInput.schema';
import { FacultyCreateWithoutAssignmentsInputObjectSchema } from './FacultyCreateWithoutAssignmentsInput.schema';
import { FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema'

export const FacultyUpsertWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyUpsertWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
export const FacultyUpsertWithoutAssignmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
