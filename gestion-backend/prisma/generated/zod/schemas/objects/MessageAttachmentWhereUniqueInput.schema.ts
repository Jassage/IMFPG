import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.MessageAttachmentWhereUniqueInput, z.ZodTypeDef, Prisma.MessageAttachmentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const MessageAttachmentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
