import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUpdateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput.schema'

export const ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInput> = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
export const ScholarshipDocumentUpsertWithWhereUniqueWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipDocumentUpdateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedUpdateWithoutScholarshipApplicationInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
