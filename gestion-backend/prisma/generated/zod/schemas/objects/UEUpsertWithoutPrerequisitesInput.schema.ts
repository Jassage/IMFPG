import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateWithoutPrerequisitesInputObjectSchema } from './UEUpdateWithoutPrerequisitesInput.schema';
import { UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedUpdateWithoutPrerequisitesInput.schema';
import { UECreateWithoutPrerequisitesInputObjectSchema } from './UECreateWithoutPrerequisitesInput.schema';
import { UEUncheckedCreateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedCreateWithoutPrerequisitesInput.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEUpsertWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UEUpsertWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UEUpsertWithoutPrerequisitesInput> = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEUpsertWithoutPrerequisitesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)]),
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]),
  where: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
