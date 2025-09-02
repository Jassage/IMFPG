import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageCreateWithoutAttachmentsInputObjectSchema } from './MessageCreateWithoutAttachmentsInput.schema';
import { MessageUncheckedCreateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedCreateWithoutAttachmentsInput.schema';
import { MessageCreateOrConnectWithoutAttachmentsInputObjectSchema } from './MessageCreateOrConnectWithoutAttachmentsInput.schema';
import { MessageUpsertWithoutAttachmentsInputObjectSchema } from './MessageUpsertWithoutAttachmentsInput.schema';
import { MessageWhereUniqueInputObjectSchema } from './MessageWhereUniqueInput.schema';
import { MessageUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema } from './MessageUpdateToOneWithWhereWithoutAttachmentsInput.schema';
import { MessageUpdateWithoutAttachmentsInputObjectSchema } from './MessageUpdateWithoutAttachmentsInput.schema';
import { MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedUpdateWithoutAttachmentsInput.schema'

export const MessageUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema: z.ZodType<Prisma.MessageUpdateOneRequiredWithoutAttachmentsNestedInput, z.ZodTypeDef, Prisma.MessageUpdateOneRequiredWithoutAttachmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => MessageUpsertWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => MessageWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MessageUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)]).optional()
}).strict();
export const MessageUpdateOneRequiredWithoutAttachmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => MessageUpsertWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => MessageWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MessageUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)]).optional()
}).strict();
