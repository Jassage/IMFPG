import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUpdateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedUpdateWithoutApplicationsInput.schema';
import { ScholarshipCreateWithoutApplicationsInputObjectSchema } from './ScholarshipCreateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedCreateWithoutApplicationsInput.schema';
import { ScholarshipWhereInputObjectSchema } from './ScholarshipWhereInput.schema'

export const ScholarshipUpsertWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipUpsertWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipUpsertWithoutApplicationsInput> = z.object({
  update: z.union([z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]),
  where: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
export const ScholarshipUpsertWithoutApplicationsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)]),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]),
  where: z.lazy(() => ScholarshipWhereInputObjectSchema).optional()
}).strict();
