/**
 * ------------------------------------------------------------------
 *  FiveS Digital — single source of truth for homepage content.
 *  Every number and label on the page reads from here, so wiring the
 *  site to a CMS / WordPress REST endpoint later means replacing these
 *  exports with fetched data of the same shape.
 *  Items marked `confirm: true` are placeholders awaiting client sign-off.
 * ------------------------------------------------------------------
 */

export type Metric = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
  shape: 'wave' | 'bubble' | 'gem' | 'coin' | 'parcel' | 'loop';
  color: string;
  /** shown in the hero orbit (keep to 4) */
  featured?: boolean;
};

/** Hero — live operations counters (rendered as 3D objects orbiting the core). */
export const heroMetrics: Metric[] = [
  { featured: true, id: 'voice', value: 15, suffix: ' Mn', label: 'Voice conversations', detail: 'Inbound and outbound calls handled across 13+ Indian languages.', shape: 'wave', color: '#FACC2C' },
  { featured: true, id: 'chats', value: 20, suffix: ' Mn', label: 'Active chats', detail: 'Chat, email and social threads resolved by AI-assisted specialists.', shape: 'bubble', color: '#7CC6FF' },
  { featured: true, id: 'quality', value: 95, suffix: '%', label: 'Quality score', detail: 'Audited interaction quality across every live programme.', shape: 'gem', color: '#3DDC97' },
  { id: 'loans', value: 1, suffix: ' Mn', label: 'Personal-loan leads handled', detail: 'Lead qualification and follow-up for lending partners.', shape: 'coin', color: '#FFD76A' },
  { id: 'ndr', value: 50, suffix: 'K', label: 'NDR completions', detail: 'Non-delivery reports closed out with customers for logistics brands.', shape: 'parcel', color: '#FF9A5C' },
  { featured: true, id: 'returns', value: 1, suffix: ' Mn', label: 'Shopping-cart returns', detail: 'Return requests verified and processed for e-commerce clients.', shape: 'loop', color: '#C3A6FF' },
];

export const heroFeatured = () => heroMetrics.filter((m) => m.featured).slice(0, 4);

/** Who we are — headline facts. */
export const whoWeAre = {
  lead: 'We blend technology and human intelligence to run customer experience and data operations for brands across India, Europe, the USA and the Middle East.',
  body: 'FiveS began in 2009 in Udaipur with a 12-member team. Today it is home to Asia’s first diversity-focused BPM delivery centre in Navi Mumbai, where scale meets social impact.',
  facts: [
    { value: 16, suffix: '+', label: 'Years in CX', note: 'Since 2009, Udaipur' },
    { value: 7, suffix: '', label: 'Countries', note: 'India, USA, Malta, Belgium, Ghana, Kenya, Philippines' },
    { value: 100, suffix: '+', label: 'Brands served', note: 'Placeholder — confirm with FiveS', confirm: true },
    { value: 3000, suffix: '+', label: 'People', note: 'Team strength since 2023' },
  ],
};

/** Recognitions — logos taken from fivesdigital.com/legacy (files in src/assets/logos). */
export const awardLogos = [
  { file: '10-iaop-impact-sourcing-champion.webp', name: "IAOP – Impact Sourcing Champion" },
  { file: '11-everest-group-cxm-peak-matrix-aspirant.webp', name: "Everest Group CXM PEAK Matrix – Aspirant" },
  { file: '12-iaop-company-to-watch.webp', name: "IAOP – Company to Watch" },
  { file: '13-everest-group-cxm-peak-matrix-major-cont.webp', name: "Everest Group CXM PEAK Matrix - Major Contender" },
  { file: '14-everest-group-data-annotation-labelling-.webp', name: "Everest Group Data Annotation & Labelling PEAK Matrix – Major Contender" },
  { file: '15-nasscom-sme-inspire-award-delivery-excel.webp', name: "NASSCOM SME Inspire Award – Delivery Excellence" },
  { file: '16-nasscom-excellence-in-delivery-inclusion.webp', name: "NASSCOM Excellence in Delivery & Inclusion" },
  { file: '17-nasscom-dei-champions.webp', name: "NASSCOM DEI Champions" },
  { file: '18-nasscom-sme-inspire-award-outstanding-hr.webp', name: "NASSCOM SME Inspire Award – Outstanding HR Practices" },
  { file: '19-global-impact-sourcing-coalition.webp', name: "Global Impact Sourcing Coalition" },
  { file: '20-asia-outsourcing-leadership-awards-socia.webp', name: "Asia Outsourcing Leadership Awards – Social Change Agent" },
  { file: '21-nsic-national-small-scale-industries-cor.webp', name: "NSIC – National Small Scale Industries Corporation Certified" },
  { file: '22-iaop-recognition.webp', name: "IAOP Recognition" },
  { file: '23-iso-27001-2022-information-security-mana.webp', name: "ISO 27001:2022 – Information Security Management" },
  { file: '24-iso-9001-2015-quality-management.webp', name: "ISO 9001:2015 – Quality Management" },
  { file: '25-woman-owned-certified.webp', name: "Woman-Owned Certified" },
];

export const partnerLogos = [
  { file: '26-avaya.webp', name: "Avaya" },
  { file: '32-kapture.webp', name: "Kapture" },
  { file: '33-ozonetel.webp', name: "Ozonetel" },
  { file: '34-genesys.webp', name: "GENESYS" },
  { file: '35-freshworks.webp', name: "Freshworks" },
  { file: '37-zendesk.webp', name: "Zendesk" },
  { file: '41-superb-ai.webp', name: "Superb AI" },
  { file: '43-kofax.webp', name: "Kofax" },
  { file: '44-haptik.webp', name: "Haptik" },
  { file: '47-ui-path.webp', name: "Ui Path" },
  { file: '51-yellow-ai.webp', name: "Yellow.ai" },
  { file: '40-taskmonk.webp', name: "Taskmonk" },
];

/** Comprehensive BPM services — each service has its own scripted agent. */
export type AgentStep = { from: 'agent' | 'user'; text: string };
export type Service = {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  metrics: { num: string; lbl: string }[];
  agent: { name: string; role: string; hue: string; mode: 'call' | 'chat'; action: string; hint: string; opener: string[]; replies: { q: string; a: string[] }[] };
};

export const services: Service[] = [
  {
    id: 'voice',
    title: 'Customer Service Voice',
    kicker: 'Inbound & outbound',
    desc: 'Multilingual specialists backed by real-time speech analytics and sentiment monitoring, working from Tier-2 and Tier-3 language hubs.',
    metrics: [{ num: '94%', lbl: 'First-contact resolution' }, { num: '13+', lbl: 'Indian languages' }, { num: '<30s', lbl: 'Average speed of answer' }],
    agent: {
      name: 'Vani', role: 'Voice CX agent', hue: '#FACC2C', mode: 'call', action: 'Call Vani', hint: 'Double-click to call',
      opener: ['Namaste! You’re through to Vani, FiveS voice support.', 'Ask me anything about how our voice programmes run.'],
      replies: [
        { q: 'Which languages?', a: ['Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati and more — 13+ in total.', 'Calls are routed to a native speaker based on the caller’s first words.'] },
        { q: 'How fast do you scale?', a: ['Pre-vetted talent pools let us add 500+ specialists in about 72 hours for festive peaks.'] },
        { q: 'Where does AI help?', a: ['Live sentiment flags, auto call summaries and an agent-assist panel that suggests the next best answer.'] },
      ],
    },
  },
  {
    id: 'nonvoice',
    title: 'Customer Service Non-Voice',
    kicker: 'Chat · email · social',
    desc: 'Asynchronous speed with conversational precision. AI triages intent, specialists resolve with context intact.',
    metrics: [{ num: '<45s', lbl: 'First response time' }, { num: '98.8%', lbl: 'SLA adherence' }, { num: '4.8/5', lbl: 'Digital CSAT' }],
    agent: {
      name: 'Kavya', role: 'Chat & email agent', hue: '#7CC6FF', mode: 'chat', action: 'Chat with Kavya', hint: 'Double-click to chat',
      opener: ['Hi, I’m Kavya. I run chat, email and social queues.', 'Ask me anything about digital support.'],
      replies: [
        { q: 'Which channels?', a: ['Web chat, WhatsApp, email, in-app and social DMs, all in one queue.'] },
        { q: 'Bot or human?', a: ['Both. The bot handles routine intents; anything emotional or complex is handed to a person with the full thread attached.'] },
        { q: 'Which CRMs?', a: ['Salesforce, Zendesk, Freshdesk, Zoho and custom ERPs — we work inside your tools.'] },
      ],
    },
  },
  {
    id: 'genai',
    title: 'Gen AI Model Training',
    kicker: 'RLHF · red teaming',
    desc: 'Domain-specific RLHF, red teaming, hallucination audits and cultural-alignment datasets for foundation models.',
    metrics: [{ num: '99.8%', lbl: 'RLHF consensus score' }, { num: '500+', lbl: 'Domain experts' }, { num: '100%', lbl: 'Clean-room delivery' }],
    agent: {
      name: 'Atlas', role: 'Model-training lead', hue: '#3DDC97', mode: 'chat', action: 'Ask Atlas about RLHF', hint: 'Double-click to ask',
      opener: ['I’m Atlas. I coordinate RLHF and evaluation teams.', 'Curious how human feedback shapes a model?'],
      replies: [
        { q: 'What is RLHF here?', a: ['Experts rank and rewrite model answers. Those preferences train a reward model that steers the LLM.'] },
        { q: 'Red teaming?', a: ['Trained testers probe for unsafe, biased or false outputs in English and Indic languages, then log them for fixes.'] },
        { q: 'Data security?', a: ['Work runs in ISO 27001:2022 clean rooms with no personal devices on the floor.'] },
      ],
    },
  },
  {
    id: 'annotation',
    title: 'Annotation Services',
    kicker: 'Vision · NLP · audio',
    desc: 'Pixel-level segmentation, 3D LiDAR point-cloud labelling, audio tagging and multi-tier QA for AI pipelines.',
    metrics: [{ num: '99.9%', lbl: 'Bounding-box precision' }, { num: '10M+', lbl: 'Labels per month' }, { num: 'Zero', lbl: 'Data leakage' }],
    agent: {
      name: 'Lumi', role: 'Annotation QA lead', hue: '#C3A6FF', mode: 'chat', action: 'Ask Lumi about labelling', hint: 'Double-click to ask',
      opener: ['Hey, I’m Lumi. I check every label before it ships.', 'Pick a topic and I’ll walk you through it.'],
      replies: [
        { q: 'What do you label?', a: ['Images, video, 3D LiDAR, text and audio — bounding boxes, polygons, segmentation, transcripts.'] },
        { q: 'How is QA done?', a: ['Three tiers: annotator, peer reviewer, then a QA lead sample. Disagreements go back for consensus.'] },
        { q: 'Which industries?', a: ['Autonomous vehicles, e-commerce, logistics, healthcare AI, agriculture and urban planning.'] },
      ],
    },
  },
];

/** Industries — flip cards. */
export const industries = [
  { title: 'E-Commerce & D2C', icon: 'cart', front: 'WISMO, returns and festive surges.', kpi: '<4 hrs', kpiLbl: 'Return turnaround', back: ['WISMO resolution', 'Returns verification', 'Catalogue moderation', 'Festive surge scaling'] },
  { title: 'Fintech & Banking', icon: 'shield', front: 'KYC, fraud and disputes.', kpi: '99.2%', kpiLbl: 'KYC pass rate', back: ['Video KYC verification', 'Fraud alert triage', 'Merchant onboarding', 'Dispute handling'] },
  { title: 'HealthTech & Insurance', icon: 'pulse', front: 'Patients, claims and providers.', kpi: '100%', kpiLbl: 'Compliance audits passed', back: ['Appointment coordination', 'Cashless claims parsing', 'Doctor credentialing', 'Revenue cycle support'] },
  { title: 'EdTech & Media', icon: 'cap', front: 'Learners, exams and content.', kpi: '4.8/5', kpiLbl: 'CSAT score', back: ['Learner doubt resolution', 'Live exam proctoring', 'Multilingual moderation', 'Subscription support'] },
  { title: 'Logistics & Supply Chain', icon: 'truck', front: 'Last mile, NDR and POD.', kpi: '99.7%', kpiLbl: 'Delivery SLA', back: ['Last-mile driver dispatch', 'NDR follow-up', 'Exception escalation', 'POD audits'] },
  { title: 'AI & Autonomous Tech', icon: 'chip', front: 'Data that trains models.', kpi: '99.9%', kpiLbl: 'Label quality', back: ['3D LiDAR labelling', 'Computer-vision boxes', 'RLHF evaluations', 'Red teaming'] },
];

/** Delivery philosophy — bubbles. */
export const philosophy = [
  { id: 'auto', title: 'Automate the routine', tag: 'Voice AI · bots · RPA', metric: '60%', metricLbl: 'routine queries automated', body: 'Conversational voice AI, automated triage and RPA resolve high-frequency queries instantly.', points: ['Voice AI and smart chatbots', 'Intent and sentiment triage', 'Live CRM sync'] },
  { id: 'human', title: 'Humans for the hard parts', tag: 'Empathy in the loop', metric: '88%', metricLbl: 'first-contact resolution', body: 'Emotional, financial or multi-step cases move to certified specialists with the full context attached.', points: ['Warm bot-to-human handover', 'Native speakers, 15+ languages', 'Escalation management'] },
  { id: 'learn', title: 'Always learning', tag: 'LEAP & RiSE academies', metric: '99.4%', metricLbl: 'quality accuracy SLA', body: 'Our LEAP and RiSE academies, plus automated speech analytics, keep quality sampling and upskilling continuous.', points: ['100% interaction auditing', 'Structured mentorship', 'ISO 27001 process rigour'] },
];

/** Our workplace — the five elements behind the FiveS name. */
export const elements = [
  { id: 'earth', name: 'Earth', value: 'Grounded in Tier-2 India', stat: '35%', statLbl: 'of our people come from Tier-2 cities', body: 'We hire where talent lives. Regional hubs in Udaipur, Hubballi and Jamshedpur open careers close to home and keep retention high.', color: '#C9A26B' },
  { id: 'water', name: 'Water', value: 'Inclusion that flows', stat: '5%', statLbl: 'of the workforce are persons with disabilities', body: 'Adaptive workstations, accessible software and equal career paths. Navi Mumbai is Asia’s first diversity-focused BPM centre.', color: '#4FB3FF' },
  { id: 'air', name: 'Air', value: 'Room for every voice', stat: '50%', statLbl: 'workforce diversity, 40% in leadership', body: 'An equitable floor where leadership reflects the people it leads.', color: '#BFE6FF' },
  { id: 'fire', name: 'Fire', value: 'The drive to grow', stat: 'LEAP', statLbl: '& RiSE learning academies', body: 'Continuous development keeps every specialist ready for what’s next, from first call to team lead.', color: '#FF7A45' },
  { id: 'space', name: 'Space', value: 'Values we live by', stat: 'CATER', statLbl: 'Competent · Accountable · Trustworthy · Engaged · Reliable', body: 'Perform with empathy, solve for repeatable success, do the right thing, own the outcome, and win together.', color: '#FACC2C' },
];

/** Delivery footprint — lon/lat pins for the map. */
export type Location = { name: string; region: 'india' | 'intl'; lon: number; lat: number; role: string; detail: string; flagship?: boolean };
export const locations: Location[] = [
  { name: 'Udaipur', region: 'india', lon: 73.71, lat: 24.58, role: 'Central enterprise hub', detail: 'Where FiveS began in 2009 with a 12-member team.', flagship: true },
  { name: 'Navi Mumbai', region: 'india', lon: 73.03, lat: 19.03, role: 'Diversity-focused BPM centre', detail: 'Asia’s first diversity-focused delivery centre, opened 2023.' },
  { name: 'Noida', region: 'india', lon: 77.39, lat: 28.54, role: 'Delivery centre', detail: 'Voice and non-voice CX programmes for North India.' },
  { name: 'Hubballi', region: 'india', lon: 75.12, lat: 15.36, role: 'Tier-2 delivery centre', detail: 'Kannada and South Indian language support.' },
  { name: 'Jamshedpur', region: 'india', lon: 86.2, lat: 22.8, role: 'Tier-2 delivery centre', detail: 'Eastern language hub for voice programmes.' },
  { name: 'Hyderabad', region: 'india', lon: 78.49, lat: 17.39, role: 'Delivery centre', detail: 'AI data, annotation and digital CX.' },
  { name: 'Bengaluru', region: 'india', lon: 77.59, lat: 12.97, role: 'Delivery centre', detail: 'Tech partnerships and AI services.' },
  { name: 'New Jersey', region: 'intl', lon: -74.41, lat: 40.06, role: 'US desk', detail: 'Client partnerships for North America.' },
  { name: 'Brussels', region: 'intl', lon: 4.35, lat: 50.85, role: 'Europe desk', detail: 'EU client engagement and GDPR-aligned delivery.' },
  { name: 'Malta', region: 'intl', lon: 14.38, lat: 35.94, role: 'Mediterranean desk', detail: 'Multilingual support for European brands.' },
  { name: 'Ghana', region: 'intl', lon: -0.19, lat: 5.6, role: 'West Africa desk', detail: 'Impact-sourcing delivery in Accra.' },
  { name: 'Kenya', region: 'intl', lon: 36.82, lat: -1.29, role: 'East Africa desk', detail: 'English and Swahili CX from Nairobi.' },
  { name: 'Philippines', region: 'intl', lon: 120.98, lat: 14.6, role: 'South-East Asia desk', detail: 'Follow-the-sun coverage for global clients.' },
];

/** Contact pathways — used by the intake agent. */
export const pathways = [
  { id: 'sales', agent: 'Arjun', role: 'Solutions team', label: 'Enterprise services', ask: 'Which service are you exploring?', options: ['Voice CX', 'Chat & email', 'Gen AI training', 'Annotation', 'Not sure yet'], email: 'sales@fivesdigital.com' },
  { id: 'careers', agent: 'Meera', role: 'Talent team', label: 'Careers', ask: 'Which kind of role interests you?', options: ['Customer support', 'AI data / annotation', 'Team lead', 'Corporate'], email: 'careers@fivesdigital.com' },
  { id: 'partner', agent: 'Kabir', role: 'Alliances team', label: 'Partnerships', ask: 'What kind of partnership?', options: ['Technology', 'AI data alliance', 'Impact / ESG', 'Reseller'], email: 'partnerships@fivesdigital.com' },
];

/** Header menu — same items as the reference design; dropdowns mirror the live fivesdigital.com menu. */
export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };
export const nav: NavItem[] = [
  { label: 'About Us', href: '#about', children: [
    { label: 'Legacy', href: 'https://fivesdigital.com/legacy/' }, { label: 'Partnerships', href: 'https://fivesdigital.com/partnerships/' },
    { label: 'Awards & Certifications', href: 'https://fivesdigital.com/awards/' }, { label: 'Value Proposition', href: 'https://fivesdigital.com/value-proposition/' },
    { label: 'Infrastructure', href: 'https://fivesdigital.com/infrastructure/' } ] },
  { label: 'CX', href: '#services', children: [
    { label: 'Customer Engagement', href: 'https://fivesdigital.com/cx/offerings/customer-engagement/' }, { label: 'Revenue Cycle Management', href: 'https://fivesdigital.com/cx/offerings/revenue-cycle-management/' },
    { label: 'BPM Services', href: 'https://fivesdigital.com/cx/offerings/bpm-services/' }, { label: 'Enterprise Technology', href: 'https://fivesdigital.com/cx/offerings/enterprise-technology/' },
    { label: 'Case Studies', href: 'https://fivesdigital.com/case-study/' } ] },
  { label: 'AI in CX', href: '#services', children: [
    { label: 'Voice AI', href: 'https://fivesdigital.com/ai-in-cx/offerings/voice-ai/' }, { label: 'Chat AI', href: 'https://fivesdigital.com/ai-in-cx/offerings/chat-ai/' },
    { label: 'Analytics & Insights', href: 'https://fivesdigital.com/ai-in-cx/offerings/analytics-and-insights/' }, { label: 'AI-Assist', href: 'https://fivesdigital.com/ai-in-cx/offerings/ai-assist/' } ] },
  { label: 'AI & Data Services', href: '#services', children: [
    { label: 'Gen AI Model Training', href: 'https://fivesdigital.com/ai-data-services/offerings/gen-ai-model-training/' }, { label: 'LLM Fine Tuning', href: 'https://fivesdigital.com/ai-data-services/offerings/llm-fine-tuning/' },
    { label: 'AI Alignment', href: 'https://fivesdigital.com/ai-data-services/offerings/ai-alignment/' }, { label: 'Annotation Services', href: 'https://fivesdigital.com/ai-data-services/offerings/annotation-services/' },
    { label: 'NLP for Transcription', href: 'https://fivesdigital.com/ai-data-services/offerings/nlp-for-transcription/' }, { label: 'Content Moderation', href: 'https://fivesdigital.com/ai-data-services/offerings/content-moderation-services/' } ] },
  { label: 'Industries', href: '#industries', children: [
    { label: 'E-Commerce & Retail', href: 'https://fivesdigital.com/cx/industries/e-commerce-retail/' }, { label: 'Healthcare', href: 'https://fivesdigital.com/cx/industries/healthcare/' },
    { label: 'BFSI', href: 'https://fivesdigital.com/cx/industries/bfsi/' }, { label: 'New Age Startups', href: 'https://fivesdigital.com/cx/industries/fast-growth-startups/' },
    { label: 'Travel, Logistics & Hospitality', href: 'https://fivesdigital.com/cx/industries/travel-tech/' }, { label: 'Utilities & Environment', href: 'https://fivesdigital.com/cx/industries/utilities-environmental-services/' } ] },
  { label: 'Our People', href: '#people', children: [
    { label: 'Leadership', href: 'https://fivesdigital.com/leaderships/' }, { label: 'Career', href: 'https://fivesdigital.com/careers/' },
    { label: 'Life at FiveS', href: 'https://fivesdigital.com/life-at-fives/' }, { label: 'Events', href: 'https://fivesdigital.com/events/' }, { label: 'Coffee Chat', href: 'https://fivesdigital.com/coffee-chat/' } ] },
  { label: 'Contact Us', href: '#contact' },
];

/** Client outcomes band — wording from the reference design. */
export const outcomes = [
  { value: 60, suffix: '%', label: 'Enterprise clients expand scope within 12 months', kind: 'ring' as const },
  { value: 84, suffix: '%', label: 'Annual Client Retention', kind: 'ring' as const },
  { value: 3.8, suffix: 'X', label: 'First Year Client ROI', kind: 'bars' as const },
];

/** Case studies — wording from the reference design. */
export const caseStudies = [
  {
    industry: 'E-Commerce & D2C',
    kpi: '-58% WISMO • 4.8/5 CSAT',
    quote: 'FiveS Digital scaled our peak festive support by 450+ specialists in under 5 days, cutting average response time to under 45 seconds while protecting CSAT.',
    author: 'VP of Customer Operations',
    org: 'Leading Indian D2C Retail Brand',
    initials: 'VP',
    tags: ['72-Hour Rapid Onboarding', 'Omnichannel Voice & Chat', 'Zero SLA Breach'],
  },
  {
    industry: 'Fintech & Banking',
    kpi: '+65% Throughput • 99.8% Pass',
    quote: 'Deploying FiveS Digital’s multilingual Video-KYC and merchant fraud review reduced our customer onboarding backlog from 48 hours to under 3 hours.',
    author: 'Head of Risk & Compliance',
    org: 'Global Neo-Banking Platform',
    initials: 'RC',
    tags: ['24/7 Video KYC Pods', 'ISO 27001 Clean Rooms', 'Fraud Alert Triaging'],
  },
];
