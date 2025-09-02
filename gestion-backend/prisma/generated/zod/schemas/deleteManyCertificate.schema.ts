import { z } from 'zod';
import { CertificateWhereInputObjectSchema } from './objects/CertificateWhereInput.schema';

export const CertificateDeleteManySchema = z.object({ where: CertificateWhereInputObjectSchema.optional()  })