import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema';
import { FacultyUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUpdateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutEnrollmentsInput.schema'

export const FacultyUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.FacultyUpdateToOneWithWhereWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.FacultyUpdateToOneWithWhereWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const FacultyUpdateToOneWithWhereWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)])
}).strict();
