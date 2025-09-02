import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyCreateWithoutEnrollmentsInputObjectSchema } from './FacultyCreateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedCreateWithoutEnrollmentsInput.schema';
import { FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema } from './FacultyCreateOrConnectWithoutEnrollmentsInput.schema';
import { FacultyUpsertWithoutEnrollmentsInputObjectSchema } from './FacultyUpsertWithoutEnrollmentsInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './FacultyWhereUniqueInput.schema';
import { FacultyUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema } from './FacultyUpdateToOneWithWhereWithoutEnrollmentsInput.schema';
import { FacultyUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUpdateWithoutEnrollmentsInput.schema';
import { FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema } from './FacultyUncheckedUpdateWithoutEnrollmentsInput.schema'

export const FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectSchema: z.ZodType<Prisma.FacultyUpdateOneRequiredWithoutEnrollmentsNestedInput, z.ZodTypeDef, Prisma.FacultyUpdateOneRequiredWithoutEnrollmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
export const FacultyUpdateOneRequiredWithoutEnrollmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => FacultyCreateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedCreateWithoutEnrollmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => FacultyCreateOrConnectWithoutEnrollmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => FacultyUpsertWithoutEnrollmentsInputObjectSchema).optional(),
  connect: z.lazy(() => FacultyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => FacultyUpdateToOneWithWhereWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUpdateWithoutEnrollmentsInputObjectSchema), z.lazy(() => FacultyUncheckedUpdateWithoutEnrollmentsInputObjectSchema)]).optional()
}).strict();
