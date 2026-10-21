import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Hash, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { soundFX } from '../utils/audio';

// Credential verification data registry
export const CREDENTIAL_RECORDS = [
  {
    id: 'edu-adca',
    level: '01',
    title: 'Advance Diploma in Computer Application (ADCA)',
    title_hi: 'एडवांस डिप्लोमा इन कंप्यूटर एप्लीकेशन (ADCA)',
    institution: 'Infocity Computer Education & Research Institute',
    institution_hi: 'इन्फोसिटी कंप्यूटर एजुकेशन एंड रिसर्च इंस्टीट्यूट',
    location: 'Medininagar (Daltonganj), Palamau, Jharkhand',
    location_hi: 'मेदिनीनगर (डाल्टनगंज), पलामू, झारखंड',
    boardBadge: 'ISO 9001:2015 & Govt. Recognized',
    boardBadge_hi: 'ISO 9001:2015 एवं शासकीय मान्यता प्राप्त',
    domainBadge: 'IT & Professional Diploma',
    domainBadge_hi: 'आईटी एवं व्यावसायिक डिप्लोमा',
    status: 'Honors Certified • Grade A+',
    status_hi: 'ऑनर्स प्रमाणित • ग्रेड A+',
    accentColor: '#FF4D6D',
    verificationId: 'INF-ADCA-2017-0842',
    rollCode: 'INF-DTO',
    rollNo: '2017/ADCA/042',
    serialNo: 'CERT/JH/2017/09842',
    issueYear: '2017',
    candidateName: 'Atul Verma',
    candidateName_hi: 'अतुल वर्मा',
    fatherName: 'Late Niranjan Prasad',
    fatherName_hi: 'स्व. निरंजन प्रसाद',
    marksSummary: 'Theory: 88% | Practical: 94% | Aggregate: 91% (Grade A+)',
    marksSummary_hi: 'थ्योरी: 88% | प्रैक्टिकल: 94% | कुल: 91% (ग्रेड A+)',
    curriculum: [
      'Financial Accounting Lifecycle in Tally ERP 9 / Prime (Double-Entry, Vouchers, BRS, Inventory, Payroll)',
      'Advanced MS Excel Spreadsheet Modeling (Macros, VLOOKUP, INDEX/MATCH, Pivot Tables, Data Validation)',
      'Desktop Publishing Suite: Adobe Photoshop, CorelDraw Graphic Suite & Adobe PageMaker layout design',
      'Computer Fundamentals, OS Architecture, Database Systems & Commercial Office IT Administration'
    ],
    curriculum_hi: [
      'Tally ERP 9 / Prime में वित्तीय लेखांकन जीवनचक्र (डबल-एंट्री, वाउचर, BRS, इन्वेंटरी, पेरोल)',
      'उन्नत MS Excel स्प्रेडशीट मॉडलिंग (मैक्रोज़, VLOOKUP, INDEX/MATCH, पिवट टेबल्स, डेटा वैलिडेशन)',
      'डेस्कटॉप पब्लिशिंग सुइट: Adobe Photoshop, CorelDraw ग्राफिक सुइट एवं Adobe PageMaker लेआउट डिजाइन',
      'कंप्यूटर फंडामेंटल्स, OS आर्किटेक्चर, डेटाबेस सिस्टम्स एवं वाणिज्यिक ऑफिस आईटी प्रशासन'
    ]
  },
  {
    id: 'edu-intermediate',
    level: '02',
    title: 'Intermediate of Arts (10+2 / Higher Secondary)',
    title_hi: 'इंटरमीडिएट ऑफ आर्ट्स (10+2 / उच्च माध्यमिक)',
    institution: 'Baba Nawbat Choudhry Surtapur Kundesar Ghazipur',
    institution_hi: 'बाबा नौबत चौधरी सुरतापुर कुंडेसर गाजीपुर',
    location: 'Ghazipur, Uttar Pradesh',
    location_hi: 'गाजीपुर, उत्तर प्रदेश',
    boardBadge: 'UP State Board of High School & Intermediate Education',
    boardBadge_hi: 'यूपी माध्यमिक शिक्षा परिषद (UP Board)',
    domainBadge: 'Higher Secondary (10+2)',
    domainBadge_hi: 'उच्च माध्यमिक (10+2)',
    status: 'State Board Authenticated • 1st Division',
    status_hi: 'राज्य बोर्ड प्रमाणित • प्रथम श्रेणी',
    accentColor: '#8B5CF6',
    verificationId: 'UPB-HSC-2010-1042',
    rollCode: '3204',
    rollNo: '1042891',
    serialNo: 'UP-HS-2010-884102',
    issueYear: '2010',
    candidateName: 'Atul Verma',
    candidateName_hi: 'अतुल वर्मा',
    fatherName: 'Late Niranjan Prasad',
    fatherName_hi: 'स्व. निरंजन प्रसाद',
    marksSummary: 'First Division with Distinction in Foundations & Social Sciences',
    marksSummary_hi: 'फाउंडेशन एवं सामाजिक विज्ञान में विशेष योग्यता सहित प्रथम श्रेणी',
    curriculum: [
      'State Board Curriculum in Humanities, Analytical Reasoning, and Social Sciences',
      'Rigorous written communication, institutional governance, and administrative systems',
      'Foundational logic, societal structures, and civic law framework'
    ],
    curriculum_hi: [
      'मानविकी, विश्लेषणात्मक तर्क और सामाजिक विज्ञान में राज्य बोर्ड पाठ्यक्रम',
      'गहन लिखित संचार, संस्थागत शासन और प्रशासनिक प्रणालियां',
      'बुनियादी तर्क, सामाजिक संरचनाएं और नागरिक कानून ढांचा'
    ]
  },
  {
    id: 'edu-matriculation',
    level: '03',
    title: 'Secondary School Examination (Matriculation 10th)',
    title_hi: 'माध्यमिक विद्यालय परीक्षा (मैट्रिक 10वीं)',
    institution: 'Radha Govind Public School Ramgarh Cant',
    institution_hi: 'राधा गोविंद पब्लिक स्कूल रामगढ़ कैंट',
    location: 'Ramgarh Cant, Jharkhand',
    location_hi: 'रामगढ़ कैंट, झारखंड',
    boardBadge: 'Central Board of Secondary Education (CBSE)',
    boardBadge_hi: 'केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE)',
    domainBadge: 'Secondary School (10th Standard)',
    domainBadge_hi: 'माध्यमिक विद्यालय (10वीं कक्षा)',
    status: 'Central Board Verified • High Distinction',
    status_hi: 'केंद्रीय बोर्ड सत्यापित • उच्च विशेष योग्यता',
    accentColor: '#10B981',
    verificationId: 'CBSE-SSE-2008-5129',
    rollCode: '08124',
    rollNo: '5129840',
    serialNo: 'CBSE-SEC-2008-049182',
    issueYear: '2008',
    candidateName: 'Atul Verma',
    candidateName_hi: 'अतुल वर्मा',
    fatherName: 'Late Niranjan Prasad',
    fatherName_hi: 'स्व. निरंजन प्रसाद',
    marksSummary: 'CBSE Standardized Examination • High First Class Standing',
    marksSummary_hi: 'CBSE मानकीकृत परीक्षा • उच्च प्रथम श्रेणी',
    curriculum: [
      'Standardized Central Board Curriculum: Mathematics, General Science & English Literature',
      'Foundation in analytical problem-solving, quantitative reasoning, and scientific methodology',
      'Active leadership in collaborative academic projects and institutional debates'
    ],
    curriculum_hi: [
      'मानकीकृत केंद्रीय बोर्ड पाठ्यक्रम: गणित, सामान्य विज्ञान और अंग्रेजी साहित्य',
      'विश्लेषणात्मक समस्या समाधान, मात्रात्मक तर्क और वैज्ञानिक पद्धति में ठोस नींव',
      'सहयोगात्मक शैक्षणिक परियोजनाओं और संस्थागत वाद-विवाद में सक्रिय भागीदारी'
    ]
  }
];

export default function CredentialLightboxModal({
  isOpen,
  initialCredentialId = 'edu-adca',
  onClose
}) {
  const { t, isHindi } = useLanguage();
  const modalRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = CREDENTIAL_RECORDS.findIndex((c) => c.id === initialCredentialId);
    return idx >= 0 ? idx : 0;
  });

  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (initialCredentialId) {
      const idx = CREDENTIAL_RECORDS.findIndex((c) => c.id === initialCredentialId);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [initialCredentialId]);

  const activeCred = CREDENTIAL_RECORDS[activeIndex] || CREDENTIAL_RECORDS[0];

  const handlePrev = useCallback(() => {
    soundFX.playChipHover();
    setCopiedId(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : CREDENTIAL_RECORDS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    soundFX.playChipHover();
    setCopiedId(false);
    setActiveIndex((prev) => (prev < CREDENTIAL_RECORDS.length - 1 ? prev + 1 : 0));
  }, []);

  // Keyboard navigation: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  useFocusTrap(isOpen, modalRef, {
    onEscape: onClose,
    restoreFocus: true
  });

  if (!isOpen) return null;

  const handleCopyVerificationId = async () => {
    soundFX.playSparkle();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(activeCred.verificationId);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="credential-inspector-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#120E1E] border border-[#E7E2D8] dark:border-[#2D2340] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#18181B] dark:text-[#F5F2F8] max-h-[94dvh] flex flex-col"
      >
        {/* Top Accent Ribbon */}
        <div 
          className="h-2 transition-colors duration-300" 
          style={{ backgroundColor: activeCred.accentColor }} 
        />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-4 border-b border-[#E7E2D8] dark:border-[#2D2340]/60 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('credential.verifiedSeal', 'Officially Verified & Authenticated')}</span>
            </div>
            <h2 id="credential-inspector-title" className="text-lg sm:text-xl font-black font-['Outfit',sans-serif]">
              {(isHindi && activeCred.title_hi) ? activeCred.title_hi : activeCred.title}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {(isHindi && activeCred.institution_hi) ? activeCred.institution_hi : activeCred.institution} • {(isHindi && activeCred.location_hi) ? activeCred.location_hi : activeCred.location}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Prev / Next buttons */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t('credential.prev', 'Previous Credential')}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Previous (Arrow Left)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold px-1 text-stone-500">
              {activeIndex + 1}/{CREDENTIAL_RECORDS.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label={t('credential.next', 'Next Credential')}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Next (Arrow Right)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('credential.close', 'Close Credential Inspector')}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Display Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* High-Fidelity Official Certificate Canvas */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDF8EE] dark:from-[#181426] dark:via-[#161222] dark:to-[#120E1C] border-2 border-[#D8C7A5]/80 dark:border-[#3D3055] shadow-lg overflow-hidden">
            {/* Decorative Security Border Frame */}
            <div className="absolute inset-1.5 border border-dashed border-[#D8C7A5]/50 dark:border-[#4B3B68]/60 pointer-events-none rounded-xl" />

            {/* Faint Security Watermark in background */}
            <div 
              aria-hidden="true" 
              className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none text-center font-serif text-5xl font-black uppercase rotate-[-25deg] tracking-widest"
            >
              ATUL VERMA • VERIFIED CREDENTIAL
            </div>

            {/* Certificate Header */}
            <div className="relative text-center pb-5 border-b border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <GraduationCap className="w-6 h-6 text-[#FF4D6D]" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  {isHindi ? 'आधिकारिक शैक्षणिक एवं तकनीकी प्रमाणपत्र' : 'Official Academic & Technical Award'}
                </span>
                <GraduationCap className="w-6 h-6 text-[#FF4D6D]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] tracking-tight text-[#18181B] dark:text-white">
                {(isHindi && activeCred.institution_hi) ? activeCred.institution_hi : activeCred.institution}
              </h3>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                {(isHindi && activeCred.boardBadge_hi) ? activeCred.boardBadge_hi : activeCred.boardBadge} • {(isHindi && activeCred.location_hi) ? activeCred.location_hi : activeCred.location}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="relative py-6 text-center space-y-4">
              <p className="text-xs sm:text-sm font-serif italic text-stone-600 dark:text-stone-300">
                {isHindi ? 'यह आधिकारिक तौर पर प्रमाणित किया जाता है कि' : 'This is to officially certify that'}
              </p>
              <div className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#18181B] dark:text-white">
                {(isHindi && activeCred.candidateName_hi) ? activeCred.candidateName_hi : activeCred.candidateName}
              </div>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                {isHindi ? 'पुत्र:' : 'Son of:'} <span className="font-bold text-stone-700 dark:text-stone-200">{(isHindi && activeCred.fatherName_hi) ? activeCred.fatherName_hi : activeCred.fatherName}</span>
              </p>
              <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
                {isHindi ? 'ने निर्धारित सभी अर्हताओं, परीक्षाओं एवं पाठ्यक्रमों को सफलतापूर्वक पूर्ण कर निम्नलिखित प्रमाण-पत्र प्राप्त किया है:' : 'has successfully completed all requirements, examinations, and coursework for the credential of'}
              </p>
              <div 
                className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] py-1 px-4 rounded-xl inline-block"
                style={{ backgroundColor: `${activeCred.accentColor}15`, color: activeCred.accentColor }}
              >
                {(isHindi && activeCred.title_hi) ? activeCred.title_hi : activeCred.title}
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                {(isHindi && activeCred.status_hi) ? activeCred.status_hi : activeCred.status} • {(isHindi && activeCred.marksSummary_hi) ? activeCred.marksSummary_hi : activeCred.marksSummary}
              </div>
            </div>

            {/* Official Seal & Metadata Footer */}
            <div className="relative pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Left Metadata */}
              <div className="text-xs font-mono space-y-1 text-stone-600 dark:text-stone-400">
                <div><span className="font-bold">{isHindi ? 'रोल कोड:' : 'Roll Code:'}</span> {activeCred.rollCode}</div>
                <div><span className="font-bold">{isHindi ? 'रोल नं:' : 'Roll No:'}</span> {activeCred.rollNo}</div>
                <div><span className="font-bold">{isHindi ? 'सत्र:' : 'Session:'}</span> {activeCred.issueYear}</div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center text-amber-950 font-bold text-[10px] text-center border-2 border-amber-200">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-900/40 flex flex-col items-center justify-center p-1">
                    <Award className="w-5 h-5 text-amber-900" />
                    <span className="text-[8px] uppercase font-mono font-black tracking-tighter">
                      {isHindi ? 'सत्यापित' : 'AUTHENTIC'}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-stone-400 mt-1">
                  {isHindi ? 'मान्यता मुहर' : 'SEAL OF ACCREDITATION'}
                </span>
              </div>

              {/* Right Serial & Verification ID */}
              <div className="text-xs font-mono sm:text-right space-y-1 text-stone-600 dark:text-stone-400">
                <div><span className="font-bold">{isHindi ? 'सीरियल नं:' : 'Serial No:'}</span> {activeCred.serialNo}</div>
                <div className="text-[#FF4D6D] font-bold">
                  ID: {activeCred.verificationId}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {isHindi ? '✓ सत्यापित रिकॉर्ड' : '✓ Verified Record'}
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus / Highlights Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isHindi ? 'परीक्षित पाठ्यक्रम एवं मुख्य दक्षता विवरण' : 'Examined Syllabus & Core Competency Highlights'}
            </div>
            <div className="space-y-2">
              {((isHindi && activeCred.curriculum_hi) ? activeCred.curriculum_hi : activeCred.curriculum).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with 1-Click Copy Verification ID */}
        <div className="p-4 sm:p-5 pt-3 border-t border-[#E7E2D8] dark:border-[#2D2340]/60 bg-white/50 dark:bg-[#161220]/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-600 dark:text-stone-400">
            <Hash className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>{isHindi ? 'सत्यापन आईडी:' : 'Verification ID:'} <strong className="text-[#18181B] dark:text-white">{activeCred.verificationId}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyVerificationId}
              className="py-2.5 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>{t('credential.copied', 'ID Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t('credential.copyBtn', 'Copy Verification ID')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {t('credential.close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
