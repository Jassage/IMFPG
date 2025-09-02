import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUpdateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInput.schema'

export const ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInput> = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
export const ScholarshipDocumentUpdateWithWhereUniqueWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
