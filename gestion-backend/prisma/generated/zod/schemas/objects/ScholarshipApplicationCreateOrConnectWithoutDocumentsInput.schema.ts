import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutDocumentsInput.schema'

export const ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateOrConnectWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateOrConnectWithoutDocumentsInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)])
}).strict();
export const ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)])
}).strict();
