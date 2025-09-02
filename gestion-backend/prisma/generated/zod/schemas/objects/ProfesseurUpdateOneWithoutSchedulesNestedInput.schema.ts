import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutSchedulesInputObjectSchema } from './ProfesseurCreateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutSchedulesInput.schema';
import { ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema } from './ProfesseurCreateOrConnectWithoutSchedulesInput.schema';
import { ProfesseurUpsertWithoutSchedulesInputObjectSchema } from './ProfesseurUpsertWithoutSchedulesInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurUpdateToOneWithWhereWithoutSchedulesInputObjectSchema } from './ProfesseurUpdateToOneWithWhereWithoutSchedulesInput.schema';
import { ProfesseurUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUpdateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutSchedulesInput.schema'

export const ProfesseurUpdateOneWithoutSchedulesNestedInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateOneWithoutSchedulesNestedInput, z.ZodTypeDef, Prisma.ProfesseurUpdateOneWithoutSchedulesNestedInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutSchedulesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)]).optional()
}).strict();
export const ProfesseurUpdateOneWithoutSchedulesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutSchedulesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)]).optional()
}).strict();
