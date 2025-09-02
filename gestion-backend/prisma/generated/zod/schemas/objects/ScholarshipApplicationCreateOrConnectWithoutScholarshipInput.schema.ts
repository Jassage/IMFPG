import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutScholarshipInput.schema'

export const ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateOrConnectWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateOrConnectWithoutScholarshipInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
export const ScholarshipApplicationCreateOrConnectWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
