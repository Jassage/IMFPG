import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const AnnouncementAttachmentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateManyMutationInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateManyMutationInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentUpdateManyMutationInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
