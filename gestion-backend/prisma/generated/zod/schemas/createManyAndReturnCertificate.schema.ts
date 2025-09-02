import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateCreateManyInputObjectSchema } from './objects/CertificateCreateManyInput.schema';

export const CertificateCreateManyAndReturnSchema = z.object({ select: CertificateSelectObjectSchema.optional(), data: z.union([ CertificateCreateManyInputObjectSchema, z.array(CertificateCreateManyInputObjectSchema) ]),  }).strict()