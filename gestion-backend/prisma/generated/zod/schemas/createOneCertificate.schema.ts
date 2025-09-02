import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateIncludeObjectSchema } from './objects/CertificateInclude.schema';
import { CertificateCreateInputObjectSchema } from './objects/CertificateCreateInput.schema';
import { CertificateUncheckedCreateInputObjectSchema } from './objects/CertificateUncheckedCreateInput.schema';

export const CertificateCreateOneSchema = z.object({ select: CertificateSelectObjectSchema.optional(), include: CertificateIncludeObjectSchema.optional(), data: z.union([CertificateCreateInputObjectSchema, CertificateUncheckedCreateInputObjectSchema])  })