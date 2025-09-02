import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutEnrollmentsInputObjectSchema } from './FacultyCreateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutEnrollmentsInput.schema';
import { FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './FacultyCreateOrConnectWithoutEnrollmentsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema'

export const FacultyCreateNestedOneWithoutEnrollmentsInputObjectSchema: z.ZodType<Prisma.FacultyCreateNestedOneWithoutEnrollmentsInput, z.ZodTypeDef, Prisma.FacultyCreateNestedOneWithoutEnrollmentsInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
export const FacultyCreateNestedOneWithoutEnrollmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional()
}).strict();
