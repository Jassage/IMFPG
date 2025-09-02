import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema';
import { FacultyLevelUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUpdateWithoutAssignmentsInput.schema';
import { FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyLevelUncheckedUpdateWithoutAssignmentsInput.schema'

export const FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const FacultyLevelUpdateToOneWithWhereWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyLevelWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyLevelUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyLevelUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
