import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUpdateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedUpdateWithoutScholarshipInput.schema';
import { ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationCreateWithoutScholarshipInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutScholarshipInput.schema'

export const ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
export const ScholarshipApplicationUpsertWithWhereUniqueWithoutScholarshipInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScholarshipApplicationUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema)])
}).strict();
