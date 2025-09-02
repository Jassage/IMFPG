import { z } from 'zod';
import { CertificateSelectObjectSchema } from './objects/CertificateSelect.schema';
import { CertificateIncludeObjectSchema } from './objects/CertificateInclude.schema';
import { CertificateWhereUniqueInputObjectSchema } from './objects/CertificateWhereUniqueInput.schema';
import { CertificateCreateInputObjectSchema } from './objects/CertificateCreateInput.schema';
import { CertificateUncheckedCreateInputObjectSchema } from './objects/CertificateUncheckedCreateInput.schema';
import { CertificateUpdateInputObjectSchema } from './objects/CertificateUpdateInput.schema';
import { CertificateUncheckedUpdateInputObjectSchema } from './objects/CertificateUncheckedUpdateInput.schema';

export const CertificateUpsertSchema = z.object({ select: CertificateSelectObjectSchema.optional(), include: CertificateIncludeObjectSchema.optional(), where: CertificateWhereUniqueInputObjectSchema, create: z.union([ CertificateCreateInputObjectSchema, CertificateUncheckedCreateInputObjectSchema ]), update: z.union([ CertificateUpdateInputObjectSchema, CertificateUncheckedUpdateInputObjectSchema ])  })