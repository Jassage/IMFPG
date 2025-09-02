import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUpdateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutSchedulesInput.schema';
import { ProfesseurCreateWithoutSchedulesInputObjectSchema } from './ProfesseurCreateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutSchedulesInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurUpsertWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurUpsertWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurUpsertWithoutSchedulesInput> = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
export const ProfesseurUpsertWithoutSchedulesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => ProfesseurUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutSchedulesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]),
  where: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
