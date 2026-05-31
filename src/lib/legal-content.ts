export type LegalParagraph = string;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: LegalParagraph[];
  bullets?: string[];
  /** Optional defined-term references rendered as Glossary links beneath the section. */
  glossaryTerms?: { label: string; termId: string }[];
};

export type LegalVersion = {
  version: string;
  date: string;
  summary: string;
};

export type LegalPage = {
  slug: string;
  navLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: LegalSection[];
  versionHistory: LegalVersion[];
};

export const legalContact = {
  legalEmail: 'legal@stepmotech.com',
  dpoEmail: 'dpo@stepmotech.com',
  dpoName: 'Data Protection Officer, STEPMOTECH Compliance Office',
  postal: 'STEPMOTECH Compliance Office, Unit 5, Industrial Motion Park, Shenzhen, China',
};

export const legalPages: LegalPage[] = [
  {
    slug: 'terms',
    navLabel: 'Terms of Sale & Use',
    title: 'Terms of Sale & Use',
    eyebrow: 'Legal',
    description:
      'The trading terms that govern catalog purchases, quotations, payment, delivery, warranty, and liability between STEPMOTECH and its business customers.',
    lastUpdated: '2026-05-01',
    effectiveDate: '2026-05-15',
    sections: [
      {
        id: 'scope',
        title: '1. Scope and Acceptance',
        paragraphs: [
          'These Terms of Sale & Use ("Terms") apply to every order, quotation, and use of the STEPMOTECH storefront. By placing an Order or accepting a Quotation you agree to these Terms in full.',
          'Where a signed master supply agreement exists between the parties, that agreement prevails over any conflicting provision in these Terms.',
        ],
      },
      {
        id: 'pricing',
        title: '2. Pricing, Currency, and Volume Tiers',
        bullets: [
          'Catalog prices are shown in the currency selected for your session and exclude duties and taxes unless an all-inclusive shipping route is chosen.',
          'Volume tier pricing and project quotations are confirmed in writing and supersede catalog list pricing for the quoted lines and quantities.',
          'Quotations remain valid for the period stated on the Quotation; after expiry, pricing is subject to re-confirmation.',
        ],
        glossaryTerms: [{ label: 'Volume tier', termId: 'volume-pricing' }],
      },
      {
        id: 'order-acceptance',
        title: '3. Order Acceptance',
        paragraphs: [
          'An Order constitutes an offer to purchase. A contract is formed only when STEPMOTECH issues an order confirmation or dispatches the goods, whichever occurs first.',
          'STEPMOTECH may decline or cancel an Order before dispatch where stock, pricing errors, export screening, or credit checks require it.',
        ],
      },
      {
        id: 'payment',
        title: '4. Payment and Net Terms',
        bullets: [
          'Standard orders are payable in advance unless approved Net 30 credit terms are in place for the account.',
          'Approved Net 30 customers must settle invoices within thirty (30) days of the invoice date.',
          'Overdue balances may accrue interest at the maximum rate permitted by applicable law and may suspend open credit.',
        ],
      },
      {
        id: 'delivery',
        title: '5. Delivery, Risk, and Incoterms',
        paragraphs: [
          'Delivery, transfer of risk, and customs responsibility follow the Incoterm stated on the order confirmation. Title passes only upon full payment.',
          'Delivery dates are estimates. STEPMOTECH is not liable for delays caused by carriers, customs authorities, or events outside its reasonable control.',
        ],
        glossaryTerms: [{ label: 'Incoterm', termId: 'incoterms' }],
      },
      {
        id: 'duties',
        title: '6. Duties and Taxes',
        paragraphs: [
          'Unless a duty-inclusive route is selected, the customer is responsible for import duties, VAT, and clearance charges levied by the destination country.',
        ],
      },
      {
        id: 'warranty',
        title: '7. Warranty',
        bullets: [
          'Products carry a three (3) year limited warranty from the delivery date against functional failure under normal, rated operating conditions.',
          'The warranty excludes misuse, over-current operation, unauthorized modification, and cosmetic wear.',
          'The sole remedy under warranty is repair, replacement, or credit at STEPMOTECH’s election.',
        ],
      },
      {
        id: 'liability',
        title: '8. Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, STEPMOTECH’s aggregate liability for any claim is limited to the amount paid for the goods giving rise to the claim.',
          'STEPMOTECH is not liable for indirect, incidental, or consequential loss, including loss of profit, production, or downtime.',
        ],
      },
      {
        id: 'ip',
        title: '9. Intellectual Property',
        paragraphs: [
          'All trademarks, drawings, datasheets, and CAD assets remain the property of STEPMOTECH. Purchase of goods grants no licence to the underlying intellectual property beyond ordinary use of the product.',
        ],
      },
      {
        id: 'disputes',
        title: '10. Disputes and Governing Law',
        paragraphs: [
          'These Terms are governed by the laws stated on the order confirmation. The parties will attempt good-faith resolution before commencing formal proceedings.',
        ],
      },
      {
        id: 'force-majeure',
        title: '11. Force Majeure',
        paragraphs: [
          'Neither party is liable for failure or delay caused by events beyond reasonable control, including natural disasters, labour action, transport disruption, or government measures.',
        ],
      },
      {
        id: 'severability',
        title: '12. Severability',
        paragraphs: [
          'If any provision of these Terms is held unenforceable, the remaining provisions continue in full force and effect.',
        ],
      },
    ],
    versionHistory: [
      { version: 'v3.0', date: '2026-05-01', summary: 'Clarified Net 30 credit terms and Incoterm-based risk transfer.' },
      { version: 'v2.1', date: '2025-09-12', summary: 'Updated warranty remedy language and liability cap.' },
      { version: 'v2.0', date: '2025-02-03', summary: 'Restructured into numbered articles; added force majeure clause.' },
    ],
  },
  {
    slug: 'privacy',
    navLabel: 'Privacy Policy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    description:
      'How STEPMOTECH collects, uses, shares, and protects personal data, the legal bases we rely on, and the rights available to you under GDPR and CCPA.',
    lastUpdated: '2026-05-01',
    effectiveDate: '2026-05-15',
    sections: [
      {
        id: 'controller',
        title: '1. Data Controller and DPO',
        paragraphs: [
          'STEPMOTECH is the data controller for personal data processed through this storefront. Our Data Protection Officer can be reached at the contact details in the footer of this page.',
        ],
      },
      {
        id: 'collection',
        title: '2. Categories of Data We Collect',
        bullets: [
          'Identity and contact data: name, company, email, phone, and shipping address.',
          'Account data: credentials, order history, quotations, and saved lists.',
          'Technical data: IP address, device and browser details, and page interaction data.',
        ],
      },
      {
        id: 'purposes',
        title: '3. How We Use Personal Data',
        bullets: [
          'To process orders, quotations, payments, and shipments.',
          'To provide support, manage accounts, and operate B2B credit and verification workflows.',
          'To improve site performance and to send marketing only where you have opted in.',
        ],
      },
      {
        id: 'legal-basis',
        title: '4. Legal Bases (GDPR)',
        bullets: [
          'Performance of a contract for order fulfilment and account services.',
          'Legitimate interests for fraud prevention, security, and service improvement.',
          'Consent for marketing communications, which you may withdraw at any time.',
          'Legal obligation for tax, customs, and export-compliance records.',
        ],
      },
      {
        id: 'sharing',
        title: '5. Who We Share Data With',
        paragraphs: [
          'We share data with payment processors, logistics and customs providers, and IT service providers acting as processors under contract, and with authorities where legally required. We do not sell personal data.',
        ],
      },
      {
        id: 'transfers',
        title: '6. International Transfers',
        paragraphs: [
          'Where data is transferred outside your region, we rely on adequacy decisions or Standard Contractual Clauses with appropriate safeguards.',
        ],
      },
      {
        id: 'retention',
        title: '7. Retention',
        paragraphs: [
          'We retain personal data only as long as needed to fulfil the purposes above and to satisfy legal, tax, and export-record requirements.',
        ],
      },
      {
        id: 'cookies',
        title: '8. Cookies',
        paragraphs: [
          'We use cookies for cart persistence, session preferences, and analytics. See our Cookies Policy for the full list and consent controls.',
        ],
      },
      {
        id: 'rights',
        title: '9. Your Rights',
        bullets: [
          'Access, rectification, erasure, restriction, portability, and objection under GDPR.',
          'CCPA rights to know, delete, and opt out of sale (note: we do not sell personal data).',
          'The right to lodge a complaint with your supervisory authority.',
        ],
      },
      {
        id: 'requests',
        title: '10. Submitting a Request',
        paragraphs: [
          'To exercise any right, contact our DPO using the details in the footer. We respond within the timeframe required by applicable law.',
        ],
      },
    ],
    versionHistory: [
      { version: 'v3.0', date: '2026-05-01', summary: 'Added explicit GDPR legal-basis table and CCPA request routing.' },
      { version: 'v2.2', date: '2025-08-20', summary: 'Updated international transfer safeguards to reference SCCs.' },
      { version: 'v2.0', date: '2025-01-15', summary: 'Separated cookies detail into a dedicated Cookies Policy.' },
    ],
  },
  {
    slug: 'cookies',
    navLabel: 'Cookies Policy',
    title: 'Cookies Policy',
    eyebrow: 'Legal',
    description:
      'The categories of cookies used on this site, what each does, how long it lasts, and how to change your consent at any time.',
    lastUpdated: '2026-05-01',
    effectiveDate: '2026-05-15',
    sections: [
      {
        id: 'overview',
        title: '1. About Cookies',
        paragraphs: [
          'Cookies are small files stored on your device. We use them to keep your cart, remember preferences, and understand site performance.',
        ],
      },
      {
        id: 'necessary',
        title: '2. Necessary Cookies',
        bullets: [
          'cart_token — preserves cart contents — session/30 days — STEPMOTECH.',
          'locale / currency / unit — store site preferences — 12 months — STEPMOTECH.',
          'cookie_consent — records your consent choice — 12 months — STEPMOTECH.',
        ],
      },
      {
        id: 'performance',
        title: '3. Performance Cookies',
        bullets: [
          'Analytics identifiers — measure page performance and traffic — up to 24 months — analytics provider.',
        ],
      },
      {
        id: 'functional',
        title: '4. Functional Cookies',
        bullets: [
          'Session preference cookies — remember UI choices such as saved filters — up to 12 months — STEPMOTECH.',
        ],
      },
      {
        id: 'marketing',
        title: '5. Marketing Cookies',
        bullets: [
          'Campaign attribution cookies — set only with consent — up to 12 months — marketing provider.',
        ],
      },
      {
        id: 'manage',
        title: '6. Managing Your Consent',
        paragraphs: [
          'You can reopen the consent manager at any time to change or withdraw your choices. Necessary cookies cannot be disabled because the storefront cannot function without them.',
        ],
      },
    ],
    versionHistory: [
      { version: 'v2.0', date: '2026-05-01', summary: 'Re-categorized cookies and added consent-manager reopen control.' },
      { version: 'v1.2', date: '2025-06-30', summary: 'Added analytics retention durations and providers.' },
    ],
  },
  {
    slug: 'ip',
    navLabel: 'IP Policy',
    title: 'Intellectual Property Policy',
    eyebrow: 'Legal',
    description:
      'How STEPMOTECH trademarks, copyrighted material, and product imagery may be used, and how to submit a DMCA takedown notice.',
    lastUpdated: '2026-05-01',
    effectiveDate: '2026-05-15',
    sections: [
      {
        id: 'trademarks',
        title: '1. Trademarks',
        paragraphs: [
          'STEPMOTECH and associated logos are trademarks of STEPMOTECH. You may not use them in a way that implies endorsement or affiliation without prior written permission.',
        ],
      },
      {
        id: 'copyright',
        title: '2. Copyright',
        paragraphs: [
          'All site content, including text, datasheets, drawings, and CAD models, is protected by copyright and may not be reproduced without authorization.',
        ],
      },
      {
        id: 'imagery',
        title: '3. Product Imagery Use',
        bullets: [
          'Approved resellers and affiliates may use unmodified product images solely to promote genuine STEPMOTECH products.',
          'Images must not be altered to misrepresent specifications or to brand non-STEPMOTECH goods.',
        ],
      },
      {
        id: 'dmca',
        title: '4. DMCA Takedown Notices',
        paragraphs: [
          'If you believe content on this site infringes your copyright, send a written notice to our Legal contact including identification of the work, the infringing URL, your contact details, and a good-faith statement.',
        ],
      },
    ],
    versionHistory: [
      { version: 'v1.1', date: '2026-05-01', summary: 'Added product-imagery usage rules for resellers and affiliates.' },
      { version: 'v1.0', date: '2025-03-10', summary: 'Initial IP policy with DMCA notice procedure.' },
    ],
  },
  {
    slug: 'export-compliance',
    navLabel: 'Export Compliance',
    title: 'Export Compliance Policy',
    eyebrow: 'Legal',
    description:
      'STEPMOTECH export-control classification, denied-party screening, restricted destinations, and the compliance obligations that apply to customers.',
    lastUpdated: '2026-05-01',
    effectiveDate: '2026-05-15',
    sections: [
      {
        id: 'classification',
        title: '1. Classification Scope',
        paragraphs: [
          'The majority of STEPMOTECH catalog products are classified as EAR99 or under a standard ECCN. Classification for a specific item is confirmed on request for regulated transactions.',
        ],
      },
      {
        id: 'screening',
        title: '2. Denied-Party Screening',
        paragraphs: [
          'Orders are screened against applicable denied-, restricted-, and sanctioned-party lists. STEPMOTECH may pause or cancel any transaction that fails screening.',
        ],
      },
      {
        id: 'restricted',
        title: '3. Restricted Destinations',
        paragraphs: [
          'STEPMOTECH does not ship to embargoed or sanctioned destinations. Orders to such destinations are rejected regardless of payment status.',
        ],
      },
      {
        id: 'end-use',
        title: '4. End-Use and End-User Limits',
        bullets: [
          'Products must not be used in prohibited end-uses, including unlawful military or weapons-related applications.',
          'Customers must provide accurate end-use and end-user information when requested.',
        ],
      },
      {
        id: 'customer-obligations',
        title: '5. Customer Compliance Obligations',
        bullets: [
          'Comply with all applicable export, re-export, and import laws of relevant jurisdictions.',
          'Do not re-export or divert products in violation of export-control regulations.',
          'Maintain records sufficient to demonstrate compliance.',
        ],
      },
      {
        id: 'reexport',
        title: '6. Re-Export Prohibition',
        paragraphs: [
          'Re-export or transfer of products in breach of applicable export-control laws is strictly prohibited and may void warranty and support entitlements.',
        ],
      },
      {
        id: 'reporting',
        title: '7. Reporting Channel',
        paragraphs: [
          'Suspected compliance violations may be reported confidentially to our Legal contact using the details in the footer.',
        ],
      },
    ],
    versionHistory: [
      { version: 'v2.0', date: '2026-05-01', summary: 'Expanded denied-party screening and re-export prohibition language.' },
      { version: 'v1.1', date: '2025-07-05', summary: 'Added end-use and end-user certification requirements.' },
    ],
  },
];

export function getLegalPageBySlug(slug: string) {
  return legalPages.find((page) => page.slug === slug) ?? null;
}
