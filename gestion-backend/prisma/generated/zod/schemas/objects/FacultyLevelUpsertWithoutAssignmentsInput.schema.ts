import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUpdateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedUpdateWithoutAssignmentsInput.schema';
import { FacultyLevelCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedCreateWithoutAssignmentsInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema'

export const FacultyLevelUpsertWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpsertWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelUpsertWithoutAssignmentsInput> = z.object({
  update: z.union([z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional()
}).strict();
export const FacultyLevelUpsertWithoutAssignmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyLevelCreateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedCreateWithoutAssignmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional()
}).strict();
