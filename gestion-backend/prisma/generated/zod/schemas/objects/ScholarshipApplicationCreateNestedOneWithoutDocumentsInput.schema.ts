import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutDocumentsInput.schema';
import { ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateOrConnectWithoutDocumentsInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema'

export const ScholarshipApplicationCreateNestedOneWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateNestedOneWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateNestedOneWithoutDocumentsInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationCreateNestedOneWithoutDocumentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipApplicationCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema).optional()
}).strict();
