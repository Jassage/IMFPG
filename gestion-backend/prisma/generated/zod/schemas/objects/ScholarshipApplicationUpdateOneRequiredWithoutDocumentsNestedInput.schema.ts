import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutDocumentsInput.schema';
import { ScholarshipApplicationUpsertWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUpsertWithoutDocumentsInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInput.schema';
import { ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUpdateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutDocumentsInput.schema'

export const ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  upsert: z.lazy(() => ScholarshipApplicationUpsertWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipApplicationUpdateOneRequiredWithoutDocumentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  upsert: z.lazy(() => ScholarshipApplicationUpsertWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateToOneWithWhereWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutDocumentsInputObjectSchema)]).optional()
}).strict();
