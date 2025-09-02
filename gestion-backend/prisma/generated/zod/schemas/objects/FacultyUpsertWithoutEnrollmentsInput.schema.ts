import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUpdateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutEnrollmentsInput.schema';
import { FacultyCreateWithoutEnrollmentsInputObjectSchema } from './FacultyCreateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutEnrollmentsInput.schema';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema'

export const FacultyUpsertWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.FacultyUpsertWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.FacultyUpsertWithoutEnrollmentsInput> = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
export const FacultyUpsertWithoutEnrollmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]),
  where: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
