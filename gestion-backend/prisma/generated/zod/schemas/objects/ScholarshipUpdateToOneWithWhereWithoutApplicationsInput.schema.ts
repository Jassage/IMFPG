import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereInputObjectSchema } from './ScholarshipWhereInput.schema';
import { ScholarshipUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUpdateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedUpdateWithoutApplicationsInput.schema'

export const ScholarshipUpdateToOneWithWhereWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipUpdateToOneWithWhereWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipUpdateToOneWithWhereWithoutApplicationsInput> = z.object({
  where: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)])
}).strict();
export const ScholarshipUpdateToOneWithWhereWithoutApplicationsInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)])
}).strict();
