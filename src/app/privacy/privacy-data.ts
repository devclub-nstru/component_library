export interface PrivacyItem {
  id: number;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export const PRIVACY_ITEMS: PrivacyItem[] = [
  {
    id: 1,
    title: "1. Introduction",
    paragraphs: [
      "Welcome to DevClub UI (the \"Library\", \"Platform\", \"Service\", \"we\", \"us\", or \"our\").",
      "This Privacy Policy explains how we collect, receive, use, disclose, retain, protect, and otherwise process personal information when you visit or use our website, browse our component documentation, download, install, import, or use our packages, access our source code repositories, communicate with us, submit issues or pull requests, or use our developer tools, APIs, playgrounds, and hosted services.",
      "The Library consists of open-source and component registry software. Components execute entirely in your local environment and do not silently harvest or transmit application data to us. Other services, such as our documentation website, APIs, or community channels, process technical information as described below.",
    ],
  },
  {
    id: 2,
    title: "2. Scope of This Privacy Policy",
    paragraphs: [
      "This Privacy Policy applies to personal information processed through services that expressly link to this Policy, including the DevClub UI website, documentation and API reference endpoints, package distribution interfaces, preview and rendering environments, support channels, and community repositories.",
      "Software that runs locally: If you install a component package and use it within your own application, the components do not send information to us. A locally installed UI component that renders a button, accordion, sidebar, or shader operates within your application sandbox. Your application remains solely responsible for the personal information it collects.",
      "Hosted services: If you use a hosted service operated by us, such as a playground, preview environment, or public REST API, we process technical request information necessary to deliver that service.",
    ],
  },
  {
    id: 3,
    title: "3. Definitions",
    paragraphs: [
      "\"Personal Information\" means information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked to an identifiable individual, as defined by applicable law.",
      "\"Usage Data\" means technical or interaction information relating to the use of our websites, packages, documentation, or services.",
      "\"Device Information\" means information about a computer, browser, operating system, network, or similar device.",
      "\"Services\" means the websites, software, documentation, hosted products, APIs, developer tools, and related services covered by this Policy.",
      "\"You\" or \"User\" means the individual or organization accessing or using the Services.",
      "\"Controller\" means the entity that determines why and how personal information is processed.",
      "\"Processor\" or \"Service Provider\" means an entity that processes personal information on behalf of a controller.",
    ],
  },
  {
    id: 4,
    title: "4. Information We Collect",
    paragraphs: [
      "The information we collect depends on how you interact with the Library.",
      "Information you provide directly: You may provide information when you contact support, submit a bug report on GitHub, open a pull request, submit feedback, or communicate via email. This may include your name, GitHub handle, email address, feedback, and technical correspondence.",
      "We do not require you to provide more information than is reasonably necessary for the specific technical purpose.",
    ],
  },
  {
    id: 5,
    title: "5. Account and Authentication Information",
    paragraphs: [
      "DevClub UI does not require mandatory account registration to browse documentation, preview interactive showcases, or copy registry components.",
      "If authenticated developer accounts are introduced in future releases, we will process email addresses, usernames, and authentication identifiers through secure, industry-standard authentication providers without storing third-party passwords.",
    ],
  },
  {
    id: 6,
    title: "6. Automatically Collected Information",
    paragraphs: [
      "When you access our websites or hosted endpoints, technical information may be recorded transiently in server access logs. This may include IP address, approximate geographic region derived from IP, browser type and version, operating system, referring URL, pages viewed, timestamps, HTTP headers, and error diagnostics.",
      "We use this information solely for delivering the service, diagnosing errors, preventing automated abuse, detecting security threats, and measuring aggregate performance.",
    ],
  },
  {
    id: 7,
    title: "7. Cookies and Similar Technologies",
    paragraphs: [
      "Our website utilizes local storage and minimal session mechanisms strictly for essential functions, such as preserving your chosen dark theme preference, remembering dismissed notices, and maintaining playground UI state.",
      "We do not deploy third-party advertising tracking cookies or cross-site profiling pixels.",
    ],
  },
  {
    id: 8,
    title: "8. Package, Download, and Repository Information",
    paragraphs: [
      "When you download or clone components via git or fetch them from our registry API, technical network metadata (such as IP address, requested slug, and user agent) is processed by our server infrastructure or host CDN to deliver the requested files.",
      "Third-party package managers (such as npm) independently process download metrics under their own respective privacy policies.",
    ],
  },
  {
    id: 9,
    title: "9. Documentation and Website Usage",
    paragraphs: [
      "When you navigate our documentation, we process technical page view events to ensure high-speed caching and accurate content rendering. Documentation search queries are evaluated client-side or transiently without building individualized user profiles.",
    ],
  },
  {
    id: 10,
    title: "10. Hosted Playground, Sandbox, and Preview Data",
    paragraphs: [
      "Interactive code studios, WebGL shader previews, and component playgrounds execute in your local browser runtime. Any code changes, props adjustments, or playground values you test remain within your client session and are not saved to remote tracking databases.",
      "Do not input passwords, private API keys, or confidential secrets into interactive playgrounds.",
    ],
  },
  {
    id: 11,
    title: "11. Source Code, Issues, Pull Requests, and Public Contributions",
    paragraphs: [
      "If you submit an issue, comment, or pull request to our public GitHub repository, information you publish (including your GitHub username, commit email, code snippets, and comments) becomes publicly accessible and permanently preserved under open-source version control.",
      "Never publish private credentials, API keys, or sensitive customer data in public repositories.",
    ],
  },
  {
    id: 12,
    title: "12. Information From Third Parties",
    paragraphs: [
      "We may receive technical data from third-party hosting platforms (such as GitHub, Vercel, or Cloudflare) relating to repository activity, CDN bandwidth delivery, and automated security scanning reports.",
    ],
  },
  {
    id: 13,
    title: "13. Information We Do Not Intentionally Collect",
    paragraphs: [
      "We do not intentionally seek or collect passwords entered into component form examples, credit card numbers, biometric data, precise GPS location, government IDs, or private health records.",
      "The component library operates without requiring access to sensitive data handled by the applications into which it is embedded.",
    ],
  },
  {
    id: 14,
    title: "14. How We Use Personal Information",
    paragraphs: [
      "We use information to operate websites, deliver documentation, process API requests, detect suspicious traffic, investigate abuse, protect infrastructure, troubleshoot bugs, and comply with legal requirements.",
      "We do not sell personal information to third parties.",
    ],
  },
  {
    id: 15,
    title: "15. Legal Bases for Processing",
    paragraphs: [
      "Where required by law, we rely on legitimate interests (maintaining service security, preventing fraud, and delivering open-source software), performance of contracts, compliance with legal obligations, or explicit user consent where applicable.",
    ],
  },
  {
    id: 16,
    title: "16. How We Share Personal Information",
    paragraphs: [
      "We may share technical information with trusted service providers who assist with cloud hosting, CDN distribution, security DDoS filtering, and error monitoring under strict confidentiality obligations.",
      "We may also disclose information where required by valid legal process or to protect security and user safety.",
    ],
  },
  {
    id: 17,
    title: "17. Third-Party Services",
    paragraphs: [
      "Our services link to external platforms (GitHub, Twitter, npm, Radix UI). Third-party platforms operate under their own independent privacy notices, which you should review before engaging with them.",
    ],
  },
  {
    id: 18,
    title: "18. Payment Information",
    paragraphs: [
      "DevClub UI core open-source components are provided free of charge under the MIT License. If paid enterprise tiers or support contracts are purchased, transactions are handled by certified third-party payment processors without DevClub storing payment card numbers.",
    ],
  },
  {
    id: 19,
    title: "19. Analytics",
    paragraphs: [
      "Where aggregate performance analytics are gathered, they are configured to anonymize IP addresses and minimize data retention, focusing strictly on high-level page views, load times, and error rates.",
    ],
  },
  {
    id: 20,
    title: "20. Error Reporting and Diagnostics",
    paragraphs: [
      "Client-side errors and network failures may generate technical diagnostic stack traces to help us fix component issues. Diagnostic payloads are scrubbed to prevent transmission of sensitive environment variables.",
    ],
  },
  {
    id: 21,
    title: "21. Security and Fraud Prevention",
    paragraphs: [
      "We monitor request patterns to protect public API endpoints against automated brute-force attacks, credential stuffing, scraping abuse, and denial-of-service attempts.",
    ],
  },
  {
    id: 22,
    title: "22. Children's Privacy",
    paragraphs: [
      "Our developer tools and documentation are not directed at children under the age of 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    id: 23,
    title: "23. Sensitive Personal Information",
    paragraphs: [
      "We do not collect sensitive personal information. Users should not post sensitive financial, medical, or confidential data in issue trackers or public discussions.",
    ],
  },
  {
    id: 24,
    title: "24. Data Retention",
    paragraphs: [
      "We retain technical information only for as long as necessary to fulfill operational purposes, ensure server security, maintain error diagnostics, and satisfy legal obligations.",
    ],
  },
  {
    id: 25,
    title: "25. Data Deletion",
    paragraphs: [
      "You may request the deletion of personal communications or correspondence by contacting privacy@devclub.co. Certain transient security logs and publicly committed git history cannot be erased immediately due to immutability.",
    ],
  },
  {
    id: 26,
    title: "26. Data Accuracy",
    paragraphs: [
      "We endeavor to keep developer records and documentation accurate. You may request corrections to correspondence or documentation via our GitHub repository.",
    ],
  },
  {
    id: 27,
    title: "27. Your Privacy Rights",
    paragraphs: [
      "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal information, or lodge a complaint with your local data protection regulator.",
    ],
  },
  {
    id: 28,
    title: "28. Rights Under Indian Privacy Law",
    paragraphs: [
      "Where applicable, we adhere to the Digital Personal Data Protection Act, 2023 (DPDP) and provide grievance redressal for data principals via grievance@devclub.co.",
    ],
  },
  {
    id: 29,
    title: "29. Rights Under the European Economic Area and United Kingdom",
    paragraphs: [
      "EEA and UK residents possess rights under the GDPR and UK GDPR, including data access, rectification, erasure, restriction, objection, and data portability.",
    ],
  },
  {
    id: 30,
    title: "30. Rights Under United States State Privacy Laws",
    paragraphs: [
      "Residents of California, Virginia, Colorado, Connecticut, Utah, and other US states may exercise rights to know, access, delete, and opt-out of regulated data practices under applicable state laws.",
    ],
  },
  {
    id: 31,
    title: "31. California Privacy Information",
    paragraphs: [
      "Under the California Consumer Privacy Act (CCPA) and CPRA, California residents have the right to request disclosure of collected categories and request deletion without discriminatory treatment.",
    ],
  },
  {
    id: 32,
    title: "32. Exercising Your Rights",
    paragraphs: [
      "To submit a privacy inquiry or exercise your legal rights, email privacy@devclub.co with the subject line \"Privacy Rights Request\". We verify requests to protect against unauthorized disclosures.",
    ],
  },
  {
    id: 33,
    title: "33. Authorized Agents",
    paragraphs: [
      "Where permitted by law, you may designate an authorized agent to submit requests on your behalf with written authorization and verification of identity.",
    ],
  },
  {
    id: 34,
    title: "34. Appeals",
    paragraphs: [
      "If we decline to take action on a privacy request, you may appeal the decision by writing to privacy@devclub.co explaining the grounds for appeal.",
    ],
  },
  {
    id: 35,
    title: "35. International Data Transfers",
    paragraphs: [
      "Where data is transferred internationally across our global hosting infrastructure, we utilize recognized transfer mechanisms, including Standard Contractual Clauses, to ensure adequate protection.",
    ],
  },
  {
    id: 36,
    title: "36. Data Security",
    paragraphs: [
      "We implement technical safeguards including HTTPS/TLS encryption in transit, strict access control, vulnerability scanning, and infrastructure firewalls. However, no internet transmission is 100% secure.",
    ],
  },
  {
    id: 37,
    title: "37. Your Responsibilities",
    paragraphs: [
      "You are responsible for keeping your local environment, git credentials, and API tokens secure, and ensuring that any application built with DevClub UI complies with applicable privacy laws.",
    ],
  },
  {
    id: 38,
    title: "38. Privacy of Applications Built With the Library",
    paragraphs: [
      "DevClub UI does not control the privacy practices of external applications that integrate our components. Application owners must publish their own privacy notices and obtain necessary end-user consents.",
    ],
  },
  {
    id: 39,
    title: "39. Telemetry in Components",
    paragraphs: [
      "DevClub UI components do NOT contain hidden telemetry routines or phoning-home beacons. Components execute locally within your application's domain without reporting user interactions back to our servers.",
    ],
  },
  {
    id: 40,
    title: "40. Open Source Components",
    paragraphs: [
      "Our open-source component source code is publicly inspectable on GitHub. Developers can audit every line of TSX and CSS to verify that no unauthorized network requests occur.",
    ],
  },
  {
    id: 41,
    title: "41. Third-Party Dependencies",
    paragraphs: [
      "Components rely on standard peer libraries (React, GSAP, Radix UI, OGL, Motion, Tailwind CSS). We recommend reviewing dependency manifests when building systems with high compliance requirements.",
    ],
  },
  {
    id: 42,
    title: "42. API and Network Requests",
    paragraphs: [
      "When consuming our public REST API endpoints (/api/components, /api/components/[slug]), requests include standard HTTP metadata needed to serve responses and maintain rate limiting.",
    ],
  },
  {
    id: 43,
    title: "43. Logs",
    paragraphs: [
      "Server access logs record request timestamps, IP addresses, requested URLs, and response status codes for operational reliability, DDoS prevention, and debugging.",
    ],
  },
  {
    id: 44,
    title: "44. Backups",
    paragraphs: [
      "System backups are maintained for business continuity and disaster recovery. Information in backups is automatically purged or overwritten in accordance with retention schedules.",
    ],
  },
  {
    id: 45,
    title: "45. Security Incidents",
    paragraphs: [
      "In the event of a verified security incident affecting personal data, we will take prompt containment and remediation measures and notify affected parties and authorities as required by law.",
    ],
  },
  {
    id: 46,
    title: "46. Data Breach Responsibilities for Customers",
    paragraphs: [
      "Organizations utilizing DevClub UI components in their products are responsible for their own internal incident response plans, breach assessments, and regulatory notifications.",
    ],
  },
  {
    id: 47,
    title: "47. Marketing Communications",
    paragraphs: [
      "We do not send unsolicited marketing email. If you subscribe to product announcements or release notes, you can opt out at any time using the unsubscribe link provided.",
    ],
  },
  {
    id: 48,
    title: "48. Surveys and Feedback",
    paragraphs: [
      "Participation in community surveys or developer feedback forms is voluntary. Feedback is used in aggregate to improve our component library and documentation.",
    ],
  },
  {
    id: 49,
    title: "49. Community Participation",
    paragraphs: [
      "Public comments, discussions, and code submitted to our GitHub community forums are publicly visible. Do not share confidential business secrets or private personal data.",
    ],
  },
  {
    id: 50,
    title: "50. User-Generated Content",
    paragraphs: [
      "You retain ownership of any custom code or issue submissions you create. By submitting contributions to open-source repositories, you license them under the applicable repository license.",
    ],
  },
  {
    id: 51,
    title: "51. Artificial Intelligence Features",
    paragraphs: [
      "If you use AI coding assistants with our Agent Skills or registry endpoints, your interaction with those AI providers is governed by the terms and privacy practices of those respective AI services.",
    ],
  },
  {
    id: 52,
    title: "52. Automated Decision-Making",
    paragraphs: [
      "We do not subject users to automated profiling or decision-making that produces legal or similarly significant effects.",
    ],
  },
  {
    id: 53,
    title: "53. Do Not Track Signals",
    paragraphs: [
      "Because our website does not engage in cross-site tracking or third-party behavioral profiling, your browsing privacy is respected by default.",
    ],
  },
  {
    id: 54,
    title: "54. Global Privacy Control",
    paragraphs: [
      "Where required by law, we recognize legally valid opt-out preference signals such as Global Privacy Control (GPC).",
    ],
  },
  {
    id: 55,
    title: "55. Do Not Sell or Share",
    paragraphs: [
      "We do not sell personal information or share personal information for cross-context behavioral advertising under California or other US state privacy laws.",
    ],
  },
  {
    id: 56,
    title: "56. Data Minimization",
    paragraphs: [
      "We intentionally restrict data collection to the minimum technical information required to maintain website availability, deliver registry components, and protect system security.",
    ],
  },
  {
    id: 57,
    title: "57. Aggregated and De-Identified Information",
    paragraphs: [
      "We may generate anonymous, de-identified metrics (such as aggregate page view counts or component popularity) to guide future component engineering and performance tuning.",
    ],
  },
  {
    id: 58,
    title: "58. Enterprise and Business Customers",
    paragraphs: [
      "Enterprise customers with dedicated service contracts may execute customized Data Processing Agreements (DPAs) governing specific operational requirements.",
    ],
  },
  {
    id: 59,
    title: "59. Data Processing Agreements",
    paragraphs: [
      "Where required by GDPR or other data protection legislation, we make DPAs available to enterprise clients detailing security safeguards and processing instructions.",
    ],
  },
  {
    id: 60,
    title: "60. Subprocessors",
    paragraphs: [
      "We utilize reputable cloud infrastructure providers (such as GitHub, Vercel, and Cloudflare) who adhere to strict data security and privacy compliance standards.",
    ],
  },
  {
    id: 61,
    title: "61. Government Requests",
    paragraphs: [
      "We review any governmental or law enforcement data requests rigorously and disclose technical information only when compelled by valid, binding legal process.",
    ],
  },
  {
    id: 62,
    title: "62. Legal Claims and Disputes",
    paragraphs: [
      "We may retain correspondence or technical logs when reasonably necessary to defend against legal claims, enforce our Terms of Service, or comply with court orders.",
    ],
  },
  {
    id: 63,
    title: "63. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically to reflect new features, operational adjustments, or legal changes. Revisions are published on this page with an updated timestamp.",
    ],
  },
  {
    id: 64,
    title: "64. Privacy Policy Version History",
    paragraphs: [
      "Version 1.0 published on 23 September 2026. Comprehensive initial release covering developer documentation, registry endpoints, and client-side execution.",
    ],
  },
  {
    id: 65,
    title: "65. Contact Us",
    paragraphs: [
      "For privacy questions or rights requests, contact DevClub at privacy@devclub.co or via our website at https://devclub.co.",
    ],
  },
  {
    id: 66,
    title: "66. Grievance Redressal",
    paragraphs: [
      "For privacy grievances or complaints under applicable legislation, contact our designated Grievance Officer at grievance@devclub.co.",
    ],
  },
  {
    id: 67,
    title: "67. Security Contact",
    paragraphs: [
      "Report security vulnerabilities privately to security@devclub.co before coordinated disclosure.",
    ],
  },
  {
    id: 68,
    title: "68. Data Protection Officer",
    paragraphs: [
      "For inquiries regarding data protection oversight, direct communications to our privacy team at privacy@devclub.co.",
    ],
  },
  {
    id: 69,
    title: "69. Controller Information",
    paragraphs: [
      "DevClub acts as the data controller for personal information processed directly through the devclub.co website and public documentation channels.",
    ],
  },
  {
    id: 70,
    title: "70. Processor Information",
    paragraphs: [
      "Where hosted services are provided to enterprise clients under contract, DevClub acts as a processor subject to agreed contractual terms.",
    ],
  },
  {
    id: 71,
    title: "71. Compliance With Applicable Laws",
    paragraphs: [
      "Our data practices are engineered to align with global standards including GDPR, UK GDPR, CCPA/CPRA, and India's DPDP framework.",
    ],
  },
  {
    id: 72,
    title: "72. Jurisdiction-Specific Notices",
    paragraphs: [
      "Where localized laws require specific disclosures, this Policy is supplemented by applicable regional statutory protections.",
    ],
  },
  {
    id: 73,
    title: "73. Data Protection by Design",
    paragraphs: [
      "We embed privacy by design principles into our software architecture by minimizing default data collection, keeping component code client-side, and avoiding third-party ad tracking.",
    ],
  },
  {
    id: 74,
    title: "74. Privacy and Component Architecture",
    paragraphs: [
      "Because our components are distributed as uncompiled TypeScript source code, you have full visibility into state and prop flows. An Input or Accordion component does not send form data to our servers.",
    ],
  },
  {
    id: 75,
    title: "75. Browser Storage",
    paragraphs: [
      "Our website utilizes browser local storage solely for non-sensitive UI preferences (such as dark mode theme selection). Do not store unencrypted secrets in browser storage.",
    ],
  },
  {
    id: 76,
    title: "76. Authentication Tokens",
    paragraphs: [
      "Developers integrating authentication with their applications should ensure tokens are securely handled using HTTP-only cookies and proper CORS headers.",
    ],
  },
  {
    id: 77,
    title: "77. Source Maps, Builds, and Deployment Artifacts",
    paragraphs: [
      "Review production build artifacts and source maps prior to deployment to ensure internal development secrets or staging URLs are not exposed.",
    ],
  },
  {
    id: 78,
    title: "78. Error Messages and Public Issues",
    paragraphs: [
      "Before submitting public bug reports or issues, redact all private customer information, access tokens, and sensitive system logs.",
    ],
  },
  {
    id: 79,
    title: "79. Children and Educational Applications",
    paragraphs: [
      "Developers building software for educational institutions or minors must independently implement child privacy safeguards under COPPA, FERPA, or GDPR-K.",
    ],
  },
  {
    id: 80,
    title: "80. Accessibility and Privacy",
    paragraphs: [
      "Our accessibility features (ARIA attributes, keyboard navigation) operate natively in the browser without collecting assistive technology metadata.",
    ],
  },
  {
    id: 81,
    title: "81. Enterprise Security Requirements",
    paragraphs: [
      "Enterprise clients requiring specialized security reviews, custom audit logs, or dedicated compliance documentation should contact enterprise@devclub.co.",
    ],
  },
  {
    id: 82,
    title: "82. Data Residency",
    paragraphs: [
      "Public documentation and registry APIs are distributed globally via high-speed edge networks to optimize latency.",
    ],
  },
  {
    id: 83,
    title: "83. Data Export",
    paragraphs: [
      "Users may request copies of any personal correspondence retained by our support team by submitting a verified request to privacy@devclub.co.",
    ],
  },
  {
    id: 84,
    title: "84. Account Closure",
    paragraphs: [
      "If user accounts are provided in future versions, closing an account will delete eligible personal data while preserving immutable open-source git history.",
    ],
  },
  {
    id: 85,
    title: "85. No Guarantee of Absolute Security",
    paragraphs: [
      "While we implement robust safeguards, no digital system is impenetrable. Maintain strong operational security and report suspected bugs responsibly.",
    ],
  },
  {
    id: 86,
    title: "86. Third-Party Hosting and Infrastructure",
    paragraphs: [
      "We host our services on reputable cloud providers with ISO/IEC 27001 and SOC 2 Type II certifications.",
    ],
  },
  {
    id: 87,
    title: "87. Open Web and Public Information",
    paragraphs: [
      "Information voluntarily published on public GitHub pull requests, commits, or community discussions is accessible to the global open-source community.",
    ],
  },
  {
    id: 88,
    title: "88. Changes in Ownership",
    paragraphs: [
      "In the event of a merger, acquisition, or restructuring, information will continue to be governed by the protections outlined in this Privacy Policy.",
    ],
  },
  {
    id: 89,
    title: "89. Severability",
    paragraphs: [
      "If any provision of this Privacy Policy is found unenforceable, the remaining provisions continue in full force and effect.",
    ],
  },
  {
    id: 90,
    title: "90. Interpretation",
    paragraphs: [
      "Section titles are for organizational convenience only and do not affect legal interpretation.",
    ],
  },
  {
    id: 91,
    title: "91. Entire Privacy Notice",
    paragraphs: [
      "This Privacy Policy constitutes the complete privacy disclosure for DevClub UI and its associated public registry endpoints.",
    ],
  },
  {
    id: 92,
    title: "92. Implementation Checklist",
    paragraphs: [
      "Before deploying applications built with DevClub UI, verify that dependency licenses, cookie notices, and data handling workflows align with your product requirements.",
    ],
  },
  {
    id: 93,
    title: "93. Privacy Principles",
    paragraphs: [
      "We operate by transparency, data minimization, purpose limitation, strong technical security, user control, and privacy by design across all components.",
    ],
  },
  {
    id: 94,
    title: "94. Final Notice",
    paragraphs: [
      "This Privacy Policy establishes our commitment to privacy. Component source code is open, inspectable, and runs client-side under your control.",
    ],
  },
];
