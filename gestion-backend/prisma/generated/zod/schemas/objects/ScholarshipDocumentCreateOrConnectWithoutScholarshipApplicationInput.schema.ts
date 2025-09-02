import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentWhereUniqueInputObjectSchema } from './ScholarshipDocumentWhereUniqueInput.schema';
import { ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateWithoutScholarshipApplicationInput.schema';
import { ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInput.schema'

export const ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInput> = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
export const ScholarshipDocumentCreateOrConnectWithoutScholarshipApplicationInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipDocumentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipDocumentCreateWithoutScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentUncheckedCreateWithoutScholarshipApplicationInputObjectSchema)])
}).strict();
