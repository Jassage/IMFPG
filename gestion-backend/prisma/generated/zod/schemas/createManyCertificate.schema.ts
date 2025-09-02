import { z } from 'zod';
import { CertificateCreateManyInputObjectSchema } from './objects/CertificateCreateManyInput.schema';

export const CertificateCreateManySchema = z.object({ data: z.union([ CertificateCreateManyInputObjectSchema, z.array(CertificateCreateManyInputObjectSchema) ]),  })