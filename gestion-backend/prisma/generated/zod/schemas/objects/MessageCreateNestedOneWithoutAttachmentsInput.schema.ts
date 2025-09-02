import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageCreateWithoutAttachmentsInputObjectSchema } from './MessageCreateWithoutAttachmentsInput.schema';
import { MessageUncheckedCreateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedCreateWithoutAttachmentsInput.schema';
import { MessageCreateOrConnectWithoutAttachmentsInputObjectSchema } from './MessageCreateOrConnectWithoutAttachmentsInput.schema';
import { MessageWhereUniqueInputObjectSchema } from './MessageWhereUniqueInput.schema'

export const MessageCreateNestedOneWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageCreateNestedOneWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageCreateNestedOneWithoutAttachmentsInput> = z.object({
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => MessageWhereUniqueInputObjectSchema).optional()
}).strict();
export const MessageCreateNestedOneWithoutAttachmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MessageCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => MessageWhereUniqueInputObjectSchema).optional()
}).strict();
