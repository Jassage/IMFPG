import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateWithoutAnnouncementInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
