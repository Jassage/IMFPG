import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateUpdateManyMutationInputObjectSchema } from './objects/CertificateUpdateManyMutationInput.schema';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';

export const CertificateUpdateManyAndReturnSchema = z.object({ select: CertificateSelectObjectSchema.optional(), data: CertificateUpdateManyMutationInputObjectSchema, where: CertificateWhereInputObjectSchema.optional()  }).strict()