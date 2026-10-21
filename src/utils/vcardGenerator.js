/**
 * RFC 6350 / vCard 3.0 & 4.0 Compliant Contact File (.vcf) Generator
 * Enables 1-click import into iOS Contacts, Android Google Contacts, Outlook, and macOS Address Book.
 */

export const DEFAULT_CONTACT_DATA = {
  firstName: 'Atul',
  lastName: 'Verma',
  formattedName: 'Atul Verma',
  title: 'Tax Consultant & Full-Stack AI Web Engineer',
  organization: 'Atul Verma Professional Consultancy Services',
  role: 'Accountant, Tax Consultant, MIS Specialist & AI Engineer',
  email: 'Atulravi2015@gmail.com',
  phone: '+917992383804',
  formattedPhone: '+91 7992383804',
  street: 'Main Road, Belwatika',
  city: 'Medininagar (Daltonganj)',
  state: 'Jharkhand',
  postalCode: '822101',
  country: 'India',
  url: 'https://atulverma.in',
  note: 'Expertise: Statutory Tax Filings (GST, ITR), Tally Prime, Executive MIS Dashboards, Full-Stack Next.js/React SaaS MVP & Autonomous AI Workflow Loops.',
  categories: ['Tax Consultant', 'Accounting', 'MIS Specialist', 'Full-Stack Developer', 'AI Engineer']
};

/**
 * Generate standard RFC 6350 compliant vCard string
 */
export function generateVCardString(customData = {}) {
  const data = { ...DEFAULT_CONTACT_DATA, ...customData };
  const revDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // vCard 3.0 format for maximum backward and forward cross-platform compatibility
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.formattedName}`,
    `ORG:${data.organization};`,
    `TITLE:${data.title}`,
    `ROLE:${data.role}`,
    `TEL;TYPE=CELL,VOICE,PREF:${data.phone}`,
    `EMAIL;TYPE=INTERNET,PREF,WORK:${data.email}`,
    `ADR;TYPE=WORK,POSTAL,PARCEL:;;${data.street};${data.city};${data.state};${data.postalCode};${data.country}`,
    `LABEL;TYPE=WORK:${data.street}, ${data.city}, ${data.state} - ${data.postalCode}, ${data.country}`,
    `URL:${data.url}`,
    `NOTE:${data.note.replace(/\n/g, '\\n')}`,
    `CATEGORIES:${data.categories.join(',')}`,
    `REV:${revDate}`,
    'END:VCARD'
  ].join('\r\n');
}

/**
 * Trigger immediate browser download of the .vcf file
 */
export function downloadVCard(filename = 'Atul_Verma_Tax_and_Developer.vcf', contactData = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const vcardContent = generateVCardString(contactData);
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.vcf') ? filename : `${filename}.vcf`);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 250);

    return true;
  } catch (err) {
    console.error('Failed to download vCard file:', err);
    return false;
  }
}
