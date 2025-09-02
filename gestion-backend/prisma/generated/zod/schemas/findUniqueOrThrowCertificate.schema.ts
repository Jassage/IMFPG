import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateIncludeObjectSchema } from './objects/CertificateInclude.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';

export const CertificateFindUniqueOrThrowSchema = z.object({ select: CertificateSelectObjectSchema.optional(), include: CertificateIncludeObjectSchema.optional(), where: CertificateWhereUniqueInputObjectSchema })