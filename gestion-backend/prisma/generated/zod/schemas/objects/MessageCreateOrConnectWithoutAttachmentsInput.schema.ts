import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageWhereUniqueInputObjectSchema } from './MessageWhereUniqueInput.schema';
import { MessageCreateWithoutAttachmentsInputObjectSchema } from './MessageCreateWithoutAttachmentsInput.schema';
import { MessageUncheckedCreateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedCreateWithoutAttachmentsInput.schema'

export const MessageCreateOrConnectWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageCreateOrConnectWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)])
}).strict();
export const MessageCreateOrConnectWithoutAttachmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)])
}).strict();
