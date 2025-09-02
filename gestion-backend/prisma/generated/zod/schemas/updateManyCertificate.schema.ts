import { z } from 'zod';
import { CertificateUpdateManyMutationInputObjectSchema } from './objects/CertificateUpdateManyMutationInput.schema';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';

export const CertificateUpdateManySchema = z.object({ data: CertificateUpdateManyMutationInputObjectSchema, where: CertificateWhereInputObjectSchema.optional()  })