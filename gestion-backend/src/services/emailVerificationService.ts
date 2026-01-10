import dns from "dns/promises";

// Cache pour éviter les vérifications DNS répétitives
const emailCache = new Map<
  string,
  { valid: boolean; timestamp: number; hasMx: boolean; hasA: boolean }
>();
const CACHE_TTL = 3600000; // 1 heure

export interface EmailVerificationResult {
  valid: boolean;
  hasMxRecords: boolean;
  hasARecords: boolean;
  domain: string;
  message: string;
  cached?: boolean;
  error?: string;
}

export class EmailVerificationService {
  /**
   * Vérifie si un email a un domaine valide qui accepte les emails
   */
  static async verifyEmail(email: string): Promise<EmailVerificationResult> {
    // Validation basique du format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        hasMxRecords: false,
        hasARecords: false,
        domain: "",
        message: "Format d'email invalide",
        error: "INVALID_FORMAT",
      };
    }

    const domain = email.split("@")[1];

    // Vérifier le cache
    const cached = emailCache.get(email);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return {
        valid: cached.valid,
        hasMxRecords: cached.hasMx,
        hasARecords: cached.hasA,
        domain,
        message: cached.valid
          ? "Email valide (cache)"
          : "Email invalide (cache)",
        cached: true,
      };
    }

    try {
      // Vérification DNS MX (Mail Exchange)
      let mxRecords;
      let hasMxRecords = false;

      try {
        mxRecords = await dns.resolveMx(domain);
        hasMxRecords = mxRecords && mxRecords.length > 0;
      } catch (mxError: any) {
        // Pas d'enregistrements MX trouvés
        hasMxRecords = false;
      }

      // Vérification DNS A (Address) comme fallback
      let aRecords;
      let hasARecords = false;

      try {
        aRecords = await dns.resolve(domain);
        hasARecords = aRecords && aRecords.length > 0;
      } catch (aError: any) {
        // Pas d'enregistrements A trouvés
        hasARecords = false;
      }

      const isValid = hasMxRecords || hasARecords;

      // Préparer le message
      let message = "";
      if (isValid) {
        if (hasMxRecords) {
          message = `Le domaine ${domain} accepte les emails (MX records trouvés)`;
        } else {
          message = `Le domaine ${domain} existe mais n'a pas de serveur mail configuré`;
        }
      } else {
        message = `Le domaine ${domain} ne semble pas exister ou n'accepte pas les emails`;
      }

      // Mettre en cache
      emailCache.set(email, {
        valid: isValid,
        hasMx: hasMxRecords,
        hasA: hasARecords,
        timestamp: Date.now(),
      });

      return {
        valid: isValid,
        hasMxRecords,
        hasARecords,
        domain,
        message,
      };
    } catch (error: any) {
      console.error(
        `Erreur lors de la vérification de l'email ${email}:`,
        error
      );

      return {
        valid: false,
        hasMxRecords: false,
        hasARecords: false,
        domain,
        message: "Erreur lors de la vérification du domaine",
        error: "DNS_ERROR",
      };
    }
  }

  /**
   * Vérifie si un domaine est jetable/temporaire
   */
  static isDisposableDomain(domain: string): boolean {
    const disposableDomains = [
      "tempmail.com",
      "10minutemail.com",
      "mailinator.com",
      "yopmail.com",
      "guerrillamail.com",
      "trashmail.com",
      "throwawaymail.com",
      "fakeinbox.com",
      "maildrop.cc",
      "getnada.com",
      "tmpmail.org",
      "temp-mail.org",
      // ... ajoutez d'autres domaines jetables ici
    ];

    const domainLower = domain.toLowerCase();
    return disposableDomains.some(
      (d) =>
        domainLower.includes(d.toLowerCase()) ||
        domainLower.endsWith(`.${d.toLowerCase()}`)
    );
  }

  /**
   * Nettoie le cache
   */
  static clearCache(): void {
    emailCache.clear();
  }

  /**
   * Vérifie plusieurs emails en batch
   */
  static async verifyBatch(
    emails: string[]
  ): Promise<EmailVerificationResult[]> {
    const results: EmailVerificationResult[] = [];

    for (const email of emails) {
      try {
        const result = await this.verifyEmail(email);
        results.push(result);
      } catch (error) {
        results.push({
          valid: false,
          hasMxRecords: false,
          hasARecords: false,
          domain: email.split("@")[1] || "",
          message: "Erreur lors de la vérification",
          error: "BATCH_ERROR",
        });
      }
    }

    return results;
  }
}
