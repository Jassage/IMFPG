import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateWithoutApplicationsInputObjectSchema } from './ScholarshipCreateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedCreateWithoutApplicationsInput.schema';
import { ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema } from './ScholarshipCreateOrConnectWithoutApplicationsInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema'

export const ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema: z.ZodType<Prisma.ScholarshipCreateNestedOneWithoutApplicationsInput, z.ZodTypeDef, Prisma.ScholarshipCreateNestedOneWithoutApplicationsInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).optional()
}).strict();
export const ScholarshipCreateNestedOneWithoutApplicationsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).optional()
}).strict();
