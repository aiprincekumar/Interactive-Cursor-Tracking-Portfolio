import React, { useMemo } from 'react';
import { useRoleTab } from '../context/RoleContext';
import { getResumeConfig } from '../utils/resumeConfig';

export default function BasicPDFViewer() {
  const roleCtx = useRoleTab();
  const activeRole = roleCtx?.activeRole || 'accountant';
  const resumeConfig = useMemo(() => getResumeConfig(activeRole), [activeRole]);
  const pdfPath = resumeConfig?.pdfPath || '/resume-accountant.pdf';
  const label = resumeConfig?.label || 'Resume';

  return (
    <div 
      className="fixed inset-0 top-0 left-0 w-screen h-screen z-0 bg-[#525659] flex flex-col"
      role="region"
      aria-label={`PDF Viewer - ${label}`}
    >
      <iframe
        src={`${pdfPath}#toolbar=1&navpanes=0`}
        title={`Atul Verma Resume - ${label}`}
        className="w-full h-full border-none"
        loading="eager"
      />
      <noscript>
        <div className="p-8 text-center text-white">
          <p>PDF preview requires JavaScript. <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="underline font-bold text-amber-300">Click here to open PDF</a>.</p>
        </div>
      </noscript>
    </div>
  );
}
