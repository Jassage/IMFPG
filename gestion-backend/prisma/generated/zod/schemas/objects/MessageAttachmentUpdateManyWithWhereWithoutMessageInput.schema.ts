import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentScalarWhereInputObjectSchema } from './MessageAttachmentScalarWhereInput.schema';
import { MessageAttachmentUpdateManyMutationInputObjectSchema } from './MessageAttachmentUpdateManyMutationInput.schema';
import { MessageAttachmentUncheckedUpdateManyWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedUpdateManyWithoutMessageInput.schema'

export const MessageAttachmentUpdateManyWithWhereWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpdateManyWithWhereWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUpdateManyWithWhereWithoutMessageInput> = z.object({
  where: z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MessageAttachmentUpdateManyMutationInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateManyWithoutMessageInputObjectSchema)])
}).strict();
export const MessageAttachmentUpdateManyWithWhereWithoutMessageInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MessageAttachmentUpdateManyMutationInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateManyWithoutMessageInputObjectSchema)])
}).strict();
