import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentScalarWhereInputObjectSchema } from './ScholarshipDocumentScalarWhereInput.schema';
import { ScholarshipDocumentUpdateManyMutationInputObjectSchema } from './ScholarshipDocumentUpdateManyMutationInput.schema';
import { ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInput> = z.object({
  where: z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipDocumentUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
export const ScholarshipDocumentUpdateManyWithWhereWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipDocumentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipDocumentUpdateManyMutationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
