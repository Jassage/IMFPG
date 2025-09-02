import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentCreateWithoutMessageInputObjectSchema } from './MessageAttachmentCreateWithoutMessageInput.schema';
import { MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedCreateWithoutMessageInput.schema'

export const MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateOrConnectWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentCreateOrConnectWithoutMessageInput> = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema)])
}).strict();
export const MessageAttachmentCreateOrConnectWithoutMessageInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema)])
}).strict();
