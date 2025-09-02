import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.MessageCountOutputTypeSelect, z.ZodTypeDef, Prisma.MessageCountOutputTypeSelect> = z.object({
  attachments: z.boolean().optional()
}).strict();
export const MessageCountOutputTypeSelectObjectZodSchema = z.object({
  attachments: z.boolean().optional()
}).strict();
