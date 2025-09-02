import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyCreateWithoutEnrollmentsInputObjectSchema } from './FacultyCreateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutEnrollmentsInput.schema'

export const FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateOrConnectWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.FacultyCreateOrConnectWithoutEnrollmentsInput> = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
export const FacultyCreateOrConnectWithoutEnrollmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => FacultyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)])
}).strict();
