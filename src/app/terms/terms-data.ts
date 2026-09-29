export interface TermItem {
  id: number;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export const TERMS_ITEMS: TermItem[] = [
  {
    id: 1,
    title: "1. Introduction",
    paragraphs: [
      "These Terms and Conditions (\"Terms\", \"Terms and Conditions\", or \"Agreement\") govern access to and use of DevClub UI (the \"Library\", \"Service\", \"Software\", or \"Product\"), including its source code, compiled packages, components, templates, styles, design assets, documentation, examples, utilities, plugins, APIs, websites, package registries, repositories, and related services.",
      "The Library is provided by DevClub (\"Provider\", \"we\", \"us\", or \"our\").",
      "By downloading, installing, accessing, copying, modifying, integrating, distributing, or otherwise using the Library, you acknowledge that you have read, understood, and agree to be bound by these Terms.",
      "If you do not agree to these Terms, you must not use, install, copy, distribute, or otherwise access the Library.",
      "If you are using the Library on behalf of an organization, company, educational institution, or other legal entity, you represent and warrant that you have authority to bind that entity to these Terms. In that case, \"you\" includes both you and the entity you represent.",
    ],
  },
  {
    id: 2,
    title: "2. Definitions",
    paragraphs: [
      "\"Library\" means the software component library made available by the Provider, including all versions, releases, packages, source code, compiled distributions, components, utilities, styles, assets, documentation, examples, and associated materials.",
      "A \"Component\" means any reusable software component, UI component, module, hook, function, utility, stylesheet, token, configuration, asset, or other software element included in the Library.",
      "\"Documentation\" means guides, references, API documentation, examples, installation instructions, tutorials, changelogs, migration guides, README files, and other explanatory materials provided by the Provider.",
      "\"User\", \"you\", or \"your\" means any individual or legal entity accessing or using the Library.",
      "\"Project\" means any software application, website, mobile application, desktop application, service, product, internal system, client project, commercial product, open-source project, or other work that incorporates or uses the Library.",
      "\"Third-Party Material\" means software, libraries, packages, fonts, icons, images, APIs, services, dependencies, frameworks, or other material created or supplied by parties other than the Provider.",
      "\"License\" means the license terms that apply to the specific version, package, component, or asset of the Library. Where a separate open-source license, commercial license, or asset-specific license accompanies a portion of the Library, that license controls the relevant portion to the extent stated in that license.",
    ],
  },
  {
    id: 3,
    title: "3. Acceptance of Terms",
    paragraphs: [
      "By using the Library, you confirm that you have legal capacity to enter into this Agreement and will comply with applicable laws and regulations.",
    ],
    list: [
      "You will comply with all applicable license terms.",
      "You will not use the Library for unlawful purposes.",
      "You will not intentionally interfere with the Library or its infrastructure.",
      "You will respect the intellectual property rights of the Provider and third parties.",
      "You will comply with restrictions applicable to third-party dependencies and assets.",
      "You will review these Terms periodically for changes.",
    ],
  },
  {
    id: 4,
    title: "4. Scope of These Terms",
    paragraphs: [
      "These Terms apply to all supported forms of access to the Library, including package manager installations, source-code downloads, git repositories, binary distributions, CDN distributions, hosted documentation, component previews, design resources, example projects, templates, plugins and integrations, APIs made available with the Library, developer tooling, command-line tooling, development environments, commercial and non-commercial projects, internal organizational projects, client projects, educational projects, and open-source projects.",
      "Additional terms may apply to specific products, packages, services, or features. If a separate written agreement expressly conflicts with these Terms, the separate agreement controls only for the subject matter covered by that agreement.",
    ],
  },
  {
    id: 5,
    title: "5. Eligibility",
    paragraphs: [
      "You may use the Library only if you are legally capable of entering into a binding agreement, your use is permitted under applicable law, you are not prohibited from receiving software under applicable sanctions or export restrictions, and you comply with the applicable license for the Library.",
      "If you are under the age required by applicable law to enter into this Agreement independently, you must use the Library only with appropriate permission and supervision from a parent, guardian, educational institution, or other legally authorized person.",
    ],
  },
  {
    id: 6,
    title: "6. License and Right to Use",
    paragraphs: [
      "Your rights to use the Library are determined by the applicable license. Unless expressly stated otherwise in a separate license, these Terms do not automatically grant ownership of the Library or its intellectual property.",
      "Depending on the applicable license, you may be permitted to install the Library, use the Library in personal projects, use the Library in commercial projects, modify source code, create derivative works, distribute applications incorporating the Library, include the Library in client projects, use the Library internally, and use the Library in open-source projects.",
      "You must comply with all applicable license conditions, including attribution, notice, redistribution, source availability, trademark, or other requirements where applicable.",
    ],
  },
  {
    id: 7,
    title: "7. Open-Source Components",
    paragraphs: [
      "Some portions of the Library may be distributed under open-source licenses. Open-source components remain subject to their respective licenses.",
      "Where applicable, the Provider will identify relevant third-party or open-source licenses through LICENSE files, NOTICE files, package metadata, documentation, repository directories, dependency manifests, or license information included with distributions.",
      "You are responsible for reviewing and complying with applicable open-source licenses. If an open-source license grants rights that cannot legally be restricted by these Terms, those rights remain unaffected.",
    ],
  },
  {
    id: 8,
    title: "8. Commercial Use",
    paragraphs: [
      "Unless prohibited by the applicable license, the Library may be used in commercial Projects, including SaaS products, websites, mobile applications, desktop applications, enterprise applications, internal business software, client work, freelance projects, agency projects, paid applications, subscription products, e-commerce systems, educational products, startup products, and government or institutional software.",
      "If a specific package or asset is subject to a commercial license, commercial use is permitted only in accordance with that license.",
    ],
  },
  {
    id: 9,
    title: "9. Personal and Educational Use",
    paragraphs: [
      "Subject to the applicable license, the Library may be used for personal learning, academic assignments, university projects, research projects, prototypes, demonstrations, hackathons, educational applications, and portfolio projects.",
      "Educational use does not automatically override license restrictions or third-party intellectual property requirements.",
    ],
  },
  {
    id: 10,
    title: "10. Modification",
    paragraphs: [
      "Where permitted by the applicable license, you may modify the Library for your Projects, including changing component behavior, changing styles, adding functionality, removing functionality, refactoring code, changing configuration, adapting components to a different framework, integrating additional dependencies, and creating custom variants.",
      "You are responsible for maintaining your modifications and ensuring that they remain compatible with your Project. Unless separately agreed, the Provider has no obligation to support modified versions.",
    ],
  },
  {
    id: 11,
    title: "11. Distribution",
    paragraphs: [
      "If the applicable license permits redistribution, you may distribute the Library or software incorporating the Library subject to all applicable license requirements across source repositories, package registries, application installers, production deployments, container images, client deliverables, internal distributions, and public downloads.",
      "You must not remove legally required notices, license information, copyright statements, or attribution requirements. You must not represent the Library as independently created by you where such representation would be misleading.",
    ],
  },
  {
    id: 12,
    title: "12. Prohibited Uses",
    paragraphs: [
      "You must not use the Library to violate applicable laws, infringe intellectual property rights, circumvent security controls, distribute malware, facilitate unauthorized access, conduct fraudulent activities, conduct phishing or credential theft, create ransomware or destructive software, intentionally damage systems or networks, interfere with infrastructure supporting the Library, attempt to gain unauthorized access to Provider systems, abuse APIs or hosted services, circumvent technical usage limits, reverse engineer portions where prohibited by law, remove required copyright or licensing notices, misrepresent authorship, or attack, scan, exploit, or compromise systems without authorization.",
      "Nothing in this section is intended to prohibit activities expressly permitted by applicable law or the applicable open-source license.",
    ],
  },
  {
    id: 13,
    title: "13. Security",
    paragraphs: [
      "You are responsible for implementing appropriate security controls in your Project. The Library may contain software components that interact with user input, authentication systems, databases, APIs, browsers, servers, local storage, network services, and third-party services.",
      "You must independently evaluate the security requirements of your Project and should not assume that use of the Library makes an application secure.",
      "You are responsible for input validation, authentication, authorization, access control, secret management, dependency management, secure configuration, logging, monitoring, encryption where appropriate, secure deployment, and vulnerability management.",
    ],
  },
  {
    id: 14,
    title: "14. Security Vulnerabilities",
    paragraphs: [
      "If you discover a security vulnerability affecting the Library, please report it through the Provider's designated security contact: softwaredevg.club@rishihood.edu.in.",
      "Security reports should include a description of the vulnerability, affected versions, reproduction steps, proof of concept where appropriate, potential impact, and suggested mitigation if known.",
      "You should avoid publicly disclosing sensitive vulnerability details before the Provider has had a reasonable opportunity to investigate and address the issue.",
    ],
  },
  {
    id: 15,
    title: "15. Dependencies",
    paragraphs: [
      "The Library may depend on third-party packages, frameworks, libraries, or services including React, Node.js, TypeScript, CSS frameworks, GSAP, Radix UI, OGL, build tools, package managers, browser APIs, cloud services, and authentication providers.",
      "Third-party dependencies are subject to their own terms and licenses. The Provider does not necessarily control third-party dependencies and is not responsible for changes made by third-party maintainers. You are responsible for reviewing dependency licenses and security advisories relevant to your Project.",
    ],
  },
  {
    id: 16,
    title: "16. Third-Party Services",
    paragraphs: [
      "The Library may optionally integrate with third-party services such as hosting providers, authentication providers, analytics services, payment providers, cloud platforms, AI services, databases, package registries, and content delivery networks.",
      "Your use of third-party services is governed by the relevant provider's terms and privacy policies. The Provider does not guarantee the availability, security, accuracy, or continued operation of third-party services.",
    ],
  },
  {
    id: 17,
    title: "17. APIs",
    paragraphs: [
      "Where APIs are provided, you agree to use them only for lawful and authorized purposes. You must not abuse API endpoints, circumvent rate limits, attempt unauthorized access, extract data in violation of applicable terms, conduct denial-of-service attacks, use automated access beyond permitted limits, or share credentials improperly.",
      "API availability, quotas, rate limits, and functionality may change over time.",
    ],
  },
  {
    id: 18,
    title: "18. Package Registry and Distribution Channels",
    paragraphs: [
      "The Library may be distributed through package registries or other platforms such as npm, GitHub, GitLab, jsDelivr, unpkg, or custom registry endpoints.",
      "Third-party distribution platforms may impose additional terms. The Provider does not control third-party platform availability or policies.",
      "A package may become temporarily unavailable because of registry outages, security incidents, platform policy changes, network failures, maintenance, version removal, or account/infrastructure issues.",
    ],
  },
  {
    id: 19,
    title: "19. Versioning",
    paragraphs: [
      "The Provider may release new versions of the Library containing new features, bug fixes, security patches, performance improvements, documentation updates, breaking changes, dependency changes, API changes, or deprecated functionality.",
      "You are responsible for evaluating upgrades before deploying them to production. The Provider does not guarantee backward compatibility between all versions unless expressly stated.",
    ],
  },
  {
    id: 20,
    title: "20. Deprecation",
    paragraphs: [
      "The Provider may deprecate features, components, APIs, or packages. A deprecated feature may remain available for a period of time but may eventually be removed.",
      "Where reasonably practical, the Provider will communicate significant deprecations through release notes, changelogs, documentation, repository notices, and migration guides. You are responsible for migrating away from deprecated functionality when appropriate.",
    ],
  },
  {
    id: 21,
    title: "21. Breaking Changes",
    paragraphs: [
      "Breaking changes may occur between major or other releases, affecting component APIs, props, events, hooks, CSS classes, tokens, build configuration, package exports, dependencies, browser compatibility, or framework compatibility.",
      "You should review release notes and migration instructions before upgrading.",
    ],
  },
  {
    id: 22,
    title: "22. Compatibility",
    paragraphs: [
      "The Provider documents supported operating systems, browsers, framework versions, runtime versions, package manager versions, Node.js versions, and build tools.",
      "Unsupported environments may still work, but the Provider makes no guarantee of compatibility unless expressly stated.",
    ],
  },
  {
    id: 23,
    title: "23. Documentation",
    paragraphs: [
      "Documentation is provided for informational and implementation purposes. The Provider may update, correct, remove, or reorganize documentation without notice.",
      "Examples and sample code may require modification before production use. Documentation does not constitute professional legal, financial, security, medical, or other regulated advice.",
    ],
  },
  {
    id: 24,
    title: "24. Examples and Sample Code",
    paragraphs: [
      "Example code is provided to demonstrate possible implementations. Unless explicitly stated otherwise, examples are not guaranteed to be production-ready, secure for all use cases, accessible for all users, optimized for performance, or compatible with every environment.",
      "You are responsible for adapting examples to your own product requirements.",
    ],
  },
  {
    id: 25,
    title: "25. Accessibility",
    paragraphs: [
      "Where the Library includes user-interface components, the Provider attempts to support accessibility standards such as WCAG and WAI-ARIA authoring practices.",
      "However, final accessibility depends on component configuration, user-provided content, application structure, browser behavior, assistive technologies, styling, and custom modifications.",
      "You remain responsible for testing your final Project for accessibility and complying with applicable accessibility legal requirements.",
    ],
  },
  {
    id: 26,
    title: "26. Browser and Platform Differences",
    paragraphs: [
      "Different browsers, devices, operating systems, screen sizes, rendering engines, and assistive technologies may produce different behavior or visual appearance.",
      "The Provider does not guarantee identical rendering or behavior across every environment. You are responsible for testing your Project on the environments relevant to your end users.",
    ],
  },
  {
    id: 27,
    title: "27. Performance",
    paragraphs: [
      "Performance depends on factors including application architecture, bundle size, network conditions, browser environment, device hardware, rendering strategy, third-party dependencies, data volume, and server configuration.",
      "The Provider does not guarantee specific performance results unless expressly stated in a written agreement.",
    ],
  },
  {
    id: 28,
    title: "28. Intellectual Property",
    paragraphs: [
      "The Library and its original materials may be protected by copyright, trademark rights, database rights, design rights, trade secrets, and other intellectual property rights.",
      "Except for rights expressly granted under the applicable license, all rights are reserved by their respective owners. Nothing in these Terms transfers ownership of intellectual property to you.",
    ],
  },
  {
    id: 29,
    title: "29. Ownership of Your Project",
    paragraphs: [
      "Subject to third-party rights and applicable licenses, you retain ownership of the original intellectual property that you create in your Project.",
      "Using the Library does not automatically transfer ownership of your independent Project to the Provider. However, your rights may be subject to the licenses governing the Library and its dependencies.",
    ],
  },
  {
    id: 30,
    title: "30. Contributions",
    paragraphs: [
      "If the Library accepts community contributions, contributions are subject to contribution guidelines. By submitting a contribution, you represent that you have the necessary rights and permissions to submit it.",
      "Unless a separate contribution agreement states otherwise, contributions are licensed under the terms specified by the Provider's repository. You must not submit confidential information, proprietary code belonging to another party without license, malicious code, credentials, or personal data.",
    ],
  },
  {
    id: 31,
    title: "31. Pull Requests and Community Contributions",
    paragraphs: [
      "The Provider may review, reject, modify, or accept contributions at its discretion. Acceptance of a contribution does not guarantee inclusion in a particular release, continued maintenance, backward compatibility, or attribution beyond what the applicable contribution terms require.",
    ],
  },
  {
    id: 32,
    title: "32. Feedback",
    paragraphs: [
      "If you provide suggestions, ideas, feature requests, bug reports, or other feedback, you grant the Provider permission, to the extent legally permitted, to use that feedback without restriction or compensation, unless otherwise agreed in writing.",
      "You should not submit confidential information as feedback.",
    ],
  },
  {
    id: 33,
    title: "33. Trademarks",
    paragraphs: [
      "Names, logos, product names, service names, and other branding associated with the Provider constitute trademarks. Use of Provider trademarks must comply with applicable trademark law and published brand guidelines.",
      "You must not imply sponsorship, partnership, certification, endorsement, employment, or official affiliation unless such relationship actually exists in writing.",
    ],
  },
  {
    id: 34,
    title: "34. Attribution",
    paragraphs: [
      "Where attribution is required by the applicable license, you must provide it in the required manner across source distributions, binary distributions, documentation, product interfaces, about pages, license files, or notices.",
      "Failure to provide required attribution may constitute a license violation.",
    ],
  },
  {
    id: 35,
    title: "35. Privacy",
    paragraphs: [
      "The Library itself runs client-side and does not harvest personal data. If the Library includes hosted services, telemetry, analytics, authentication, or crash reporting, applicable privacy terms are provided separately.",
      "You are responsible for ensuring that your Project complies with applicable privacy and data protection laws including GDPR, UK GDPR, CCPA/CPRA, and other relevant regional frameworks.",
    ],
  },
  {
    id: 36,
    title: "36. Personal Data",
    paragraphs: [
      "If your Project processes personal data using the Library, you are responsible for determining what data is collected, why it is collected, the legal basis for processing, storage, security, retention, international transfers, and user rights.",
      "You must not assume that the Library provides compliance with privacy laws by itself.",
    ],
  },
  {
    id: 37,
    title: "37. Cookies and Tracking",
    paragraphs: [
      "If your Project uses cookies, pixels, analytics, local storage, fingerprinting, or similar technologies, you are responsible for providing legally required notices and obtaining consent where applicable.",
      "The Library does not automatically make a Project compliant with cookie or tracking regulations.",
    ],
  },
  {
    id: 38,
    title: "38. Data Security",
    paragraphs: [
      "You are responsible for protecting data processed through your Project using reasonable security practices including encryption, secure authentication, least-privilege access, secret management, dependency updates, security monitoring, backups, and incident response procedures.",
    ],
  },
  {
    id: 39,
    title: "39. Data Retention",
    paragraphs: [
      "Unless otherwise expressly stated, the Provider does not determine how long you retain data in your own Project. You are responsible for establishing appropriate retention and deletion policies.",
    ],
  },
  {
    id: 40,
    title: "40. User Content",
    paragraphs: [
      "If your Project allows end users to upload, create, publish, or transmit content, you are responsible for establishing appropriate rules governing that content and ensuring that your Project does not facilitate unlawful activities.",
    ],
  },
  {
    id: 41,
    title: "41. AI-Related Features",
    paragraphs: [
      "If the Library includes or integrates with artificial intelligence functionality or code generators, AI-generated output may be inaccurate, incomplete, outdated, or biased.",
      "AI output should be reviewed before being relied upon for consequential decisions. The Provider does not guarantee that AI-generated output is accurate, original, lawful, or suitable for a particular purpose.",
    ],
  },
  {
    id: 42,
    title: "42. Sensitive and High-Risk Uses",
    paragraphs: [
      "Unless expressly authorized, you should not rely solely on the Library or its output for decisions involving significant risks to individuals, including medical decisions, emergency response, legal determinations, financial decisions, credit decisions, employment decisions, safety-critical systems, or critical infrastructure.",
    ],
  },
  {
    id: 43,
    title: "43. User Responsibility",
    paragraphs: [
      "You are responsible for your use of the Library, your Project, your users, your deployment, your security, your data, your compliance obligations, your third-party integrations, your modifications, and your distribution practices.",
      "The Provider is not responsible for problems caused solely by your implementation or configuration.",
    ],
  },
  {
    id: 44,
    title: "44. No Warranty",
    paragraphs: [
      "To the maximum extent permitted by applicable law, the Library is provided on an \"AS IS\" and \"AS AVAILABLE\" basis.",
      "The Provider does not guarantee that the Library will be error-free, uninterrupted, meet every requirement, remain available indefinitely, be compatible with every environment, be secure against every vulnerability, produce particular results, remain unchanged, or be free of third-party defects.",
    ],
  },
  {
    id: 45,
    title: "45. Disclaimer of Implied Warranties",
    paragraphs: [
      "To the maximum extent permitted by law, the Provider disclaims implied warranties, including warranties of merchantability, fitness for a particular purpose, non-infringement, quiet enjoyment, accuracy, and availability.",
    ],
  },
  {
    id: 46,
    title: "46. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, the Provider and its affiliates, officers, employees, contributors, licensors, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to use of the Library.",
      "Such damages include loss of profits, revenue, data, business opportunities, goodwill, business interruption, security incidents, or replacement costs.",
      "Maximum aggregate liability is capped as permitted by applicable law.",
    ],
  },
  {
    id: 47,
    title: "47. Indemnification",
    paragraphs: [
      "To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless the Provider and its affiliates, officers, employees, contributors, and agents from claims arising from your unlawful use of the Library, violation of these Terms, violation of third-party rights, your Project, your modifications, your distribution of the Library, or your misuse of third-party services.",
    ],
  },
  {
    id: 48,
    title: "48. Availability",
    paragraphs: [
      "The Provider may modify, suspend, or discontinue any hosted aspect of the Library due to maintenance, security incidents, infrastructure changes, business decisions, legal requirements, or platform failures.",
      "No specific availability or uptime commitment is made unless separately agreed in writing.",
    ],
  },
  {
    id: 49,
    title: "49. Maintenance",
    paragraphs: [
      "The Provider may maintain the Library through bug fixes, security patches, feature releases, refactoring, documentation updates, and dependency updates. Maintenance schedules are not guaranteed unless separately stated.",
    ],
  },
  {
    id: 50,
    title: "50. Backups",
    paragraphs: [
      "You are responsible for maintaining backups of your Project, configuration, modifications, deployments, and data. Do not rely on the Library or its public repositories as your sole backup mechanism.",
    ],
  },
  {
    id: 51,
    title: "51. Service Changes",
    paragraphs: [
      "The Provider may change APIs, components, documentation, distribution methods, package names, features, hosting infrastructure, URLs, or release schedules. Where reasonably practical, advance notice may be provided.",
    ],
  },
  {
    id: 52,
    title: "52. Suspension and Termination",
    paragraphs: [
      "The Provider may suspend access to hosted services if reasonably necessary to protect infrastructure, prevent abuse, address security incidents, comply with legal requirements, or prevent unauthorized access.",
      "Termination of hosted services does not terminate rights granted under an irrevocable open-source license.",
    ],
  },
  {
    id: 53,
    title: "53. Effect of Termination",
    paragraphs: [
      "Upon termination of rights granted under a license that is legally terminable, you must stop activities that are no longer authorized.",
      "However, rights granted under an irrevocable open-source license remain governed by that license, and previously distributed copies remain subject to the applicable license terms.",
    ],
  },
  {
    id: 54,
    title: "54. Survival",
    paragraphs: [
      "Provisions that by their nature should survive termination will survive, including intellectual property, disclaimers, limitation of liability, indemnification, governing law, dispute resolution, and license obligations.",
    ],
  },
  {
    id: 55,
    title: "55. Confidentiality",
    paragraphs: [
      "Unless separately agreed, the Library and its public documentation are not confidential. You should not submit confidential or sensitive proprietary information through public repositories, issue trackers, discussions, or contribution channels.",
    ],
  },
  {
    id: 56,
    title: "56. Export Controls and Sanctions",
    paragraphs: [
      "You are responsible for complying with applicable export control, sanctions, and trade laws. You must not use or distribute the Library in violation of applicable international restrictions.",
    ],
  },
  {
    id: 57,
    title: "57. Government Use",
    paragraphs: [
      "Government or public-sector users are responsible for determining whether their use complies with procurement, security, data protection, accessibility, export, and other applicable regulatory requirements.",
    ],
  },
  {
    id: 58,
    title: "58. Educational Institutions",
    paragraphs: [
      "Educational institutions may use the Library subject to applicable license terms. Institutions are responsible for ensuring that student and staff personal data is handled in accordance with applicable laws and policies.",
    ],
  },
  {
    id: 59,
    title: "59. Client and Agency Projects",
    paragraphs: [
      "If you use the Library to create Projects for clients, you are responsible for ensuring that your client agreements properly address intellectual property, third-party software, open-source licenses, attribution, security, maintenance, and support. The Provider is not a party to your client agreements.",
    ],
  },
  {
    id: 60,
    title: "60. Resale and Redistribution",
    paragraphs: [
      "You may not claim ownership of the Library itself merely because you include it in a Project. Any resale, sublicensing, white-labeling, redistribution, or bundling must comply with the applicable license.",
    ],
  },
  {
    id: 61,
    title: "61. White-Label Use",
    paragraphs: [
      "White-label use is permitted only where allowed by the applicable license. Where attribution is mandatory under an open-source license, white-labeling does not remove that attribution requirement.",
    ],
  },
  {
    id: 62,
    title: "62. Forks",
    paragraphs: [
      "Where permitted by the applicable open-source license, you may fork the Library. A fork may use a modified name, different branding, and independent maintenance, but must comply with the original license and must not falsely imply that it is an official Provider release.",
    ],
  },
  {
    id: 63,
    title: "63. Security of Secrets",
    paragraphs: [
      "You must not commit or distribute API keys, passwords, private keys, access tokens, database credentials, or signing keys. If credentials are accidentally exposed, revoke or rotate them immediately.",
    ],
  },
  {
    id: 64,
    title: "64. Malicious or Unauthorized Modifications",
    paragraphs: [
      "You must not knowingly distribute modified versions containing malicious code while representing them as official Provider releases, nor impersonate official repositories, packages, maintainers, or distribution channels.",
    ],
  },
  {
    id: 65,
    title: "65. Reporting Abuse",
    paragraphs: [
      "Abuse reports may be sent to abuse@devclub.co with sufficient information to investigate the alleged abuse. The Provider may take appropriate action where permitted by law.",
    ],
  },
  {
    id: 66,
    title: "66. Copyright Complaints",
    paragraphs: [
      "Copyright or intellectual property complaints should be submitted to legal@devclub.co, including identification of the claimant, protected work, infringing material location, contact info, and rights statement.",
    ],
  },
  {
    id: 67,
    title: "67. DMCA or Similar Procedures",
    paragraphs: [
      "Where applicable, the Provider maintains procedures for responding to legally valid copyright notices under the Digital Millennium Copyright Act (DMCA) or equivalent international legislation.",
    ],
  },
  {
    id: 68,
    title: "68. Dispute Resolution",
    paragraphs: [
      "Before initiating formal proceedings, the parties agree to attempt in good faith to resolve disputes through informal written communication.",
    ],
  },
  {
    id: 69,
    title: "69. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law principles, except where mandatory consumer law provides otherwise.",
    ],
  },
  {
    id: 70,
    title: "70. Jurisdiction",
    paragraphs: [
      "Subject to applicable law, any disputes arising under these Terms shall be resolved in the competent courts located in Delaware, United States.",
    ],
  },
  {
    id: 71,
    title: "71. Changes to These Terms",
    paragraphs: [
      "The Provider may update these Terms from time to time to reflect product changes, legal requirements, or new features. The Last Updated date indicates when revisions took effect.",
    ],
  },
  {
    id: 72,
    title: "72. Material Changes",
    paragraphs: [
      "For material changes, the Provider may provide additional notice through reasonable means such as website banners, repository notices, release notes, or package documentation.",
    ],
  },
  {
    id: 73,
    title: "73. Severability",
    paragraphs: [
      "If any provision of these Terms is found to be invalid or unenforceable, that provision will be modified only to the extent necessary, and the remaining provisions will continue in full effect.",
    ],
  },
  {
    id: 74,
    title: "74. Waiver",
    paragraphs: [
      "Failure to enforce any provision does not constitute a permanent waiver of that provision or any other right under these Terms.",
    ],
  },
  {
    id: 75,
    title: "75. Assignment",
    paragraphs: [
      "You may not assign your rights or obligations under these Terms without prior written consent. The Provider may assign these Terms in connection with a merger, acquisition, corporate restructuring, or sale of assets.",
    ],
  },
  {
    id: 76,
    title: "76. Entire Agreement",
    paragraphs: [
      "These Terms, together with applicable licenses and published policies, constitute the entire agreement concerning the Library and supersede prior agreements on the same subject matter.",
    ],
  },
  {
    id: 77,
    title: "77. No Partnership",
    paragraphs: [
      "Nothing in these Terms creates a partnership, joint venture, employment, agency, franchise, or fiduciary relationship between you and the Provider.",
    ],
  },
  {
    id: 78,
    title: "78. Force Majeure",
    paragraphs: [
      "The Provider is not responsible for delays or failures caused by circumstances beyond reasonable control, including natural disasters, war, government action, internet outages, cloud outages, or cyberattacks.",
    ],
  },
  {
    id: 79,
    title: "79. Notices",
    paragraphs: [
      "Legal notices should be sent via email to legal@devclub.co. Notices to users may be delivered through electronic postings or repository announcements.",
    ],
  },
  {
    id: 80,
    title: "80. Support",
    paragraphs: [
      "Unless separately agreed in an enterprise agreement, the Provider does not guarantee individualized technical support. Community support is available via GitHub issues and documentation.",
    ],
  },
  {
    id: 81,
    title: "81. Bug Reports",
    paragraphs: [
      "Bug reports are welcome through our official GitHub issue tracker. Reports should include library version, runtime, OS, browser, reproduction steps, expected behavior, and minimal repro code.",
    ],
  },
  {
    id: 82,
    title: "82. Feature Requests",
    paragraphs: [
      "Feature requests may be submitted through supported community channels. Submission of a request does not guarantee implementation or timeline.",
    ],
  },
  {
    id: 83,
    title: "83. Documentation and Content Accuracy",
    paragraphs: [
      "While reasonable efforts are made to keep documentation accurate, errors may occur. You should verify critical implementation details before deploying to production.",
    ],
  },
  {
    id: 84,
    title: "84. Open-Source Notice",
    paragraphs: [
      "This document does not replace the actual open-source license (such as MIT) included with the Library. Upstream license texts remain authoritative.",
    ],
  },
  {
    id: 85,
    title: "85. License Priority",
    paragraphs: [
      "If there is a conflict between these Terms and an applicable open-source license concerning rights granted by that license, the open-source license controls to the extent required by law.",
    ],
  },
  {
    id: 86,
    title: "86. Fonts, Icons, Images, and Design Assets",
    paragraphs: [
      "The Library may contain or reference visual assets (fonts, icons, svgs, images) which may be subject to separate licenses. Before redistributing assets, verify that redistribution is permitted.",
    ],
  },
  {
    id: 87,
    title: "87. User-Provided Assets",
    paragraphs: [
      "If you provide assets for use with the Library, you represent that you have the necessary rights to use those assets and remain responsible for any claims arising from them.",
    ],
  },
  {
    id: 88,
    title: "88. Accessibility of Documentation",
    paragraphs: [
      "The Provider attempts to make documentation accessible. If you identify an accessibility barrier, please notify accessibility@devclub.co.",
    ],
  },
  {
    id: 89,
    title: "89. International Users",
    paragraphs: [
      "The Library is accessible globally. You are responsible for determining whether use of the Library complies with local laws in your jurisdiction.",
    ],
  },
  {
    id: 90,
    title: "90. Consumer Rights",
    paragraphs: [
      "Nothing in these Terms is intended to remove or restrict mandatory statutory rights that consumers enjoy under applicable law.",
    ],
  },
  {
    id: 91,
    title: "91. Professional Advice",
    paragraphs: [
      "The Library and documentation do not constitute legal, tax, financial, medical, or cybersecurity certification advice. Seek professional counsel for regulated applications.",
    ],
  },
  {
    id: 92,
    title: "92. Compliance",
    paragraphs: [
      "You are responsible for evaluating and meeting all compliance obligations applicable to your Project (privacy, accessibility, security, consumer protection, and industry regulations).",
    ],
  },
  {
    id: 93,
    title: "93. Enterprise Use",
    paragraphs: [
      "Enterprise users requiring custom SLAs, vendor security reviews, data processing agreements, or tailored licensing should contact enterprise@devclub.co.",
    ],
  },
  {
    id: 94,
    title: "94. Service-Level Agreements",
    paragraphs: [
      "No service-level agreement applies to public community releases unless expressly executed in a separate written agreement.",
    ],
  },
  {
    id: 95,
    title: "95. Beta Features",
    paragraphs: [
      "Experimental or beta features may change without notice, contain bugs, lack documentation, or be removed. Use of beta functionality is at your own risk.",
    ],
  },
  {
    id: 96,
    title: "96. Experimental Components",
    paragraphs: [
      "Components tagged as experimental may alter APIs and behavior without adhering to semantic versioning guarantees.",
    ],
  },
  {
    id: 97,
    title: "97. Archived Versions",
    paragraphs: [
      "Older versions may be archived or unsupported. The Provider does not guarantee ongoing security patches or fixes for deprecated versions.",
    ],
  },
  {
    id: 98,
    title: "98. End-of-Life",
    paragraphs: [
      "When components reach end-of-life status, official distribution and updates cease. Migration guidance will be provided where reasonably practical.",
    ],
  },
  {
    id: 99,
    title: "99. Responsible Disclosure",
    paragraphs: [
      "Security researchers are encouraged to report vulnerabilities privately to softwaredevg.club@rishihood.edu.in before public disclosure.",
    ],
  },
  {
    id: 100,
    title: "100. No Guarantee of Error-Free Software",
    paragraphs: [
      "Software inherently may contain defects. Despite rigorous automated testing, the Library may contain bugs. Maintain appropriate testing and rollback controls.",
    ],
  },
  {
    id: 101,
    title: "101. Production Deployment",
    paragraphs: [
      "Before deploying to production, pin dependency versions, run automated test suites, perform security scans, test target browsers, and verify accessibility compliance.",
    ],
  },
  {
    id: 102,
    title: "102. Recommended Development Practices",
    paragraphs: [
      "You are encouraged to use git version control, review dependency updates, conduct security scanning, use automated testing, protect credentials, and document modifications.",
    ],
  },
  {
    id: 103,
    title: "103. No Automatic Security Certification",
    paragraphs: [
      "Use of the Library does not mean your Project is automatically SOC 2, ISO, GDPR, HIPAA, or PCI DSS compliant. Such compliance depends on your total system controls.",
    ],
  },
  {
    id: 104,
    title: "104. Third-Party Claims",
    paragraphs: [
      "The Provider is not responsible for claims arising solely from third-party products, dependencies, or external assets that you choose to integrate.",
    ],
  },
  {
    id: 105,
    title: "105. Conflicts Between Policies",
    paragraphs: [
      "If separate policies exist (Privacy Policy, License, Code of Conduct), each applies to its specific stated subject matter.",
    ],
  },
  {
    id: 106,
    title: "106. Code of Conduct",
    paragraphs: [
      "Users participating in DevClub community platforms (issue trackers, discussions, forums) must adhere to respectful and collaborative standards of conduct.",
    ],
  },
  {
    id: 107,
    title: "107. Community Platforms",
    paragraphs: [
      "Community discussions hosted on third-party services (such as GitHub or Discord) are governed additionally by the terms and policies of those respective platforms.",
    ],
  },
  {
    id: 108,
    title: "108. Repository Availability",
    paragraphs: [
      "Public repositories may experience temporary downtime due to maintenance, upstream provider outages, or network interruptions. Maintain local git mirrors of essential code.",
    ],
  },
  {
    id: 109,
    title: "109. Package Integrity",
    paragraphs: [
      "Users are encouraged to verify package integrity using package-lock checksums, cryptographic signatures, and provenance metadata.",
    ],
  },
  {
    id: 110,
    title: "110. Automated Systems",
    paragraphs: [
      "Automated systems interacting with DevClub infrastructure must respect rate limits and technical quotas, and must not degrade service availability for other users.",
    ],
  },
  {
    id: 111,
    title: "111. Scraping and Data Extraction",
    paragraphs: [
      "You must not extract data from Provider infrastructure in a manner that violates applicable law, technical rate limits, intellectual property, or server stability.",
    ],
  },
  {
    id: 112,
    title: "112. Reverse Engineering",
    paragraphs: [
      "Nothing in these Terms prohibits activity expressly permitted by applicable open-source licenses or governing law.",
    ],
  },
  {
    id: 113,
    title: "113. Interoperability",
    paragraphs: [
      "Where applicable law provides rights for interoperability, those rights remain unaffected. Interoperability must not be used as a pretense for unauthorized access or security exploits.",
    ],
  },
  {
    id: 114,
    title: "114. User Accounts",
    paragraphs: [
      "If accounts are offered in the future, you are responsible for maintaining credential confidentiality and promptly notifying the Provider of unauthorized access.",
    ],
  },
  {
    id: 115,
    title: "115. Account Termination",
    paragraphs: [
      "The Provider may suspend accounts for abuse, fraud, security violations, or terms violations, without terminating irrevocable rights granted under open-source licenses.",
    ],
  },
  {
    id: 116,
    title: "116. Payments",
    paragraphs: [
      "If commercial tiers or paid support packages are offered, additional pricing, billing, and tax terms will be specified in the relevant order form.",
    ],
  },
  {
    id: 117,
    title: "117. Taxes",
    paragraphs: [
      "Users are responsible for any applicable sales, value-added, or withholding taxes associated with their commercial purchases or usage.",
    ],
  },
  {
    id: 118,
    title: "118. Refunds",
    paragraphs: [
      "Refund eligibility for commercial products is governed by the specific commercial agreement, preserving all non-waivable statutory consumer protections.",
    ],
  },
  {
    id: 119,
    title: "119. Free and Paid Versions",
    paragraphs: [
      "If distinct versions exist, each may provide differing features, support tiers, and distribution terms as set out in their respective documentation.",
    ],
  },
  {
    id: 120,
    title: "120. License Compliance",
    paragraphs: [
      "You are responsible for retaining license texts, copyright notices, and dependency attribution required to demonstrate software license compliance.",
    ],
  },
  {
    id: 121,
    title: "121. Audit Rights",
    paragraphs: [
      "These Terms do not grant the Provider automatic audit access to your systems unless explicitly executed in a separate commercial enterprise agreement.",
    ],
  },
  {
    id: 122,
    title: "122. Security Audits",
    paragraphs: [
      "Independent security reviews conducted on the Library do not certify the security of your overall integrated application.",
    ],
  },
  {
    id: 123,
    title: "123. Incident Response",
    paragraphs: [
      "If an incident affects your application, you are responsible for containment, investigation, customer notification, and regulatory reporting.",
    ],
  },
  {
    id: 124,
    title: "124. Vulnerability Scanning",
    paragraphs: [
      "Automated vulnerability scanners may produce false positives. Evaluate dependencies in the context of your specific deployment environment.",
    ],
  },
  {
    id: 125,
    title: "125. Data Processing Agreements",
    paragraphs: [
      "If the Provider processes personal data on your behalf through hosted services, a Data Processing Agreement (DPA) will be executed as required by law.",
    ],
  },
  {
    id: 126,
    title: "126. International Data Transfers",
    paragraphs: [
      "Where personal data crosses borders, the parties will implement legally recognized safeguards such as Standard Contractual Clauses.",
    ],
  },
  {
    id: 127,
    title: "127. Children",
    paragraphs: [
      "The Library is not directed at children under the age of 13. Projects directed at minors must independently comply with COPPA and relevant regional protections.",
    ],
  },
  {
    id: 128,
    title: "128. Accessibility Compliance",
    paragraphs: [
      "Where legal accessibility mandates apply to your Project (e.g. ADA Title III, European Accessibility Act), you must independently test and ensure compliance.",
    ],
  },
  {
    id: 129,
    title: "129. Localization",
    paragraphs: [
      "Translations of documentation or UI text are provided for convenience; the English version remains legally authoritative in the event of ambiguity.",
    ],
  },
  {
    id: 130,
    title: "130. Language",
    paragraphs: [
      "These Terms are executed in the English language, which controls all aspects of interpretation and dispute resolution.",
    ],
  },
  {
    id: 131,
    title: "131. Interpretation",
    paragraphs: [
      "Section titles and numbering are for convenience and reference only and do not affect the legal interpretation of these Terms.",
    ],
  },
  {
    id: 132,
    title: "132. Electronic Acceptance",
    paragraphs: [
      "Downloading, installing, cloning, copying component code, or accessing the registry constitutes valid electronic execution and agreement to these Terms.",
    ],
  },
  {
    id: 133,
    title: "133. Contact Information",
    paragraphs: [
      "For general support: support@devclub.co. For legal notices: legal@devclub.co. For security disclosures: softwaredevg.club@rishihood.edu.in. For privacy: privacy@devclub.co.",
    ],
  },
  {
    id: 134,
    title: "134. Additional Policies",
    paragraphs: [
      "These Terms may be supplemented by our Privacy Policy, Cookie Policy, Security Policy, MIT License, Contribution Guidelines, and Code of Conduct.",
    ],
  },
  {
    id: 135,
    title: "135. Final User Responsibilities",
    paragraphs: [
      "Before production deployment, verify the applicable license, dependencies, accessibility compliance, runtime compatibility, and attribution obligations.",
    ],
  },
  {
    id: 136,
    title: "136. Acknowledgment",
    paragraphs: [
      "By using the Library, you acknowledge that you have reviewed the license, understand that software may contain defects, and accept these Terms.",
    ],
  },
  {
    id: 137,
    title: "137. Recommended Project-Level License Notice",
    paragraphs: [
      "Include the following notice in projects utilizing DevClub UI: \"This project uses DevClub UI components under the terms of the MIT License. See LICENSE for details.\"",
    ],
  },
  {
    id: 138,
    title: "138. Recommended Third-Party Notices",
    paragraphs: [
      "Ensure third-party dependency licenses (GSAP, Radix UI, OGL, Motion, Tailwind CSS) are preserved in your distributions as required.",
    ],
  },
  {
    id: 139,
    title: "139. Recommended Security Contact",
    paragraphs: [
      "For responsible security disclosures: softwaredevg.club@rishihood.edu.in. Follow responsible disclosure timelines before making findings public.",
    ],
  },
  {
    id: 140,
    title: "140. Recommended Legal Contact",
    paragraphs: [
      "Legal inquiries should be directed to DevClub via legal@devclub.co.",
    ],
  },
  {
    id: 141,
    title: "141. Version History",
    paragraphs: [
      "Version 1.0 — Published 23 September 2026. Initial comprehensive publication.",
    ],
  },
  {
    id: 142,
    title: "142. Customization Checklist",
    paragraphs: [
      "Ensure all organization-specific variables, licensing models, and jurisdictional parameters are reviewed and verified before commercial distribution.",
    ],
  },
  {
    id: 143,
    title: "143. Final Notice",
    paragraphs: [
      "This document establishes a complete framework for using DevClub UI. It does not replace independent legal counsel. Open-source licenses remain authoritative.",
    ],
  },
];
