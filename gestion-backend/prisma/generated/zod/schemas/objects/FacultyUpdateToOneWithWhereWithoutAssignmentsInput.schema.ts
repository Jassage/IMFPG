import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { FacultyUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUpdateWithoutAssignmentsInput.schema';
import { FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutAssignmentsInput.schema'

export const FacultyUpdateToOneWithWhereWithoutAssignmentsInputObjectSchema: z.ZodType<Prisma.FacultyUpdateToOneWithWhereWithoutAssignmentsInput, z.ZodTypeDef, Prisma.FacultyUpdateToOneWithWhereWithoutAssignmentsInput> = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
export const FacultyUpdateToOneWithWhereWithoutAssignmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutAssignmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutAssignmentsInputObjectSchema)])
}).strict();
