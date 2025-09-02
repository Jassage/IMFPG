import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateWithoutPrerequisitesInputObjectSchema } from './UECreateWithoutPrerequisitesInput.schema';
import { UEUncheckedCreateWithoutPrerequisitesInputObjectSchema } from './UEUncheckedCreateWithoutPrerequisitesInput.schema';
import { UECreateOrConnectWithoutPrerequisitesInputObjectSchema } from './UECreateOrConnectWithoutPrerequisitesInput.schema';
import { UEWhereUniqueInputObjectSchema } from './UEWhereUniqueInput.schema'

export const UECreateNestedOneWithoutPrerequisitesInputObjectSchema: z.ZodType<Prisma.UECreateNestedOneWithoutPrerequisitesInput, z.ZodTypeDef, Prisma.UECreateNestedOneWithoutPrerequisitesInput> = z.object({
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutPrerequisitesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
export const UECreateNestedOneWithoutPrerequisitesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => UECreateWithoutPrerequisitesInputObjectSchema), z.lazy(() => UEUncheckedCreateWithoutPrerequisitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UECreateOrConnectWithoutPrerequisitesInputObjectSchema).optional(),
  connect: z.lazy(() => UEWhereUniqueInputObjectSchema).optional()
}).strict();
