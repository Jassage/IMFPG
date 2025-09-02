import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateIncludeObjectSchema } from './objects/CertificateInclude.schema';
import { CertificateUpdateInputObjectSchema } from './objects/CertificateUpdateInput.schema';
import { CertificateUncheckedUpdateInputObjectSchema } from './objects/CertificateUncheckedUpdateInput.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';

export const CertificateUpdateOneSchema = z.object({ select: CertificateSelectObjectSchema.optional(), include: CertificateIncludeObjectSchema.optional(), data: z.union([CertificateUpdateInputObjectSchema, CertificateUncheckedUpdateInputObjectSchema]), where: CertificateWhereUniqueInputObjectSchema  })