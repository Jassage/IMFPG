import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema';
import { UEUpdateWithoutPrerequisitesInputObjectSchema } from './UEUpdateWithoutPrerequisitesInput.schema';
import { UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedUpdateWithoutPrerequisitesInput.schema'

export const UEUpdateToOneWithWhereWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UEUpdateToOneWithWhereWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UEUpdateToOneWithWhereWithoutPrerequisitesInput> = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)])
}).strict();
export const UEUpdateToOneWithWhereWithoutPrerequisitesInputObjectZodSchema = z.object({
  where: z.lazy(() => UEWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)])
}).strict();
