import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereInputObjectSchema } from './ScholarshipApplicationWhereInput.schema';
import { ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUpdateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutDocumentsInput.schema'

export const ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)])
}).strict();
