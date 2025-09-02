import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUpdateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutDocumentsInput.schema';
import { ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './ScholarshipApplicationWhereInput.schema'

export const ScholarshipApplicationUpsertWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpsertWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpsertWithoutDocumentsInput> = z.object({
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]),
  where: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUpsertWithoutDocumentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]),
  where: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional()
}).strict();
