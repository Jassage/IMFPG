import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateWithoutApplicationsInputObjectSchema } from './ScholarshipCreateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedCreateWithoutApplicationsInput.schema';
import { ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema } from './ScholarshipCreateOrConnectWithoutApplicationsInput.schema';
import { ScholarshipUpsertWithoutApplicationsInputObjectSchema } from './ScholarshipUpsertWithoutApplicationsInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './ScholarshipWhereUniqueInput.schema';
import { ScholarshipUpdateToOneWithWhereWithoutApplicationsInputObjectSchema } from './ScholarshipUpdateToOneWithWhereWithoutApplicationsInput.schema';
import { ScholarshipUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUpdateWithoutApplicationsInput.schema';
import { ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema } from './ScholarshipUncheckedUpdateWithoutApplicationsInput.schema'

export const ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectSchema: z.ZodType<Prisma.ScholarshipUpdateOneRequiredWithoutApplicationsNestedInput, z.ZodTypeDef, Prisma.ScholarshipUpdateOneRequiredWithoutApplicationsNestedInput> = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema).optional(),
  upsert: z.lazy(() => ScholarshipUpsertWithoutApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScholarshipUpdateToOneWithWhereWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)]).optional()
}).strict();
export const ScholarshipUpdateOneRequiredWithoutApplicationsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScholarshipCreateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedCreateWithoutApplicationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScholarshipCreateOrConnectWithoutApplicationsInputObjectSchema).optional(),
  upsert: z.lazy(() => ScholarshipUpsertWithoutApplicationsInputObjectSchema).optional(),
  connect: z.lazy(() => ScholarshipWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScholarshipUpdateToOneWithWhereWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUpdateWithoutApplicationsInputObjectSchema), z.lazy(() => ScholarshipUncheckedUpdateWithoutApplicationsInputObjectSchema)]).optional()
}).strict();
