import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateManyAnnouncementInput.schema'

export const AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateManyAnnouncementInputEnvelope, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateManyAnnouncementInputEnvelope> = z.object({
  data: z.union([z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
