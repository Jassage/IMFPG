import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutPrerequisitesInputObjectSchema } from './UECreateWithoutPrerequisitesInput.schema';
import { UEUncheckedCreateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedCreateWithoutPrerequisitesInput.schema';
import { UECreateOrConnectWithoutPrerequisitesInputObjectSchema } from './UECreateOrConnectWithoutPrerequisitesInput.schema';
import { UEUpsertWithoutPrerequisitesInputObjectSchema } from './UEUpsertWithoutPrerequisitesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema';
import { UEUpdateToOneWithWhereWithoutPrerequisitesInputObjectSchema } from './UEUpdateToOneWithWhereWithoutPrerequisitesInput.schema';
import { UEUpdateWithoutPrerequisitesInputObjectSchema } from './UEUpdateWithoutPrerequisitesInput.schema';
import { UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedUpdateWithoutPrerequisitesInput.schema'

export const UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema: z.ZodType<Prisma.UEUpdateOneRequiredWithoutPrerequisitesNestedInput, z.ZodTypeDef, Prisma.UEUpdateOneRequiredWithoutPrerequisitesNestedInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutPrerequisitesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutPrerequisitesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)]).optional()
}).strict();
export const UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutPrerequisitesInputObjectSchema).optional(),
  upsert: z.lazy(() => UEUpsertWithoutPrerequisitesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UEUpdateToOneWithWhereWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUpdateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedUpdateWithoutPrerequisitesInputObjectSchema)]).optional()
}).strict();
