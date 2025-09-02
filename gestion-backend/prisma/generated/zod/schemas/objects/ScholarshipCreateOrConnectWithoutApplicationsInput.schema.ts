import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipCreateWithoutApplicationsInputObjectSchema } from './ScholarshipCreateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedCreateWithoutApplicationsInput.schema'

export const ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateOrConnectWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipCreateOrConnectWithoutApplicationsInput> = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)])
}).strict();
export const ScholarshipCreateOrConnectWithoutApplicationsInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)])
}).strict();
