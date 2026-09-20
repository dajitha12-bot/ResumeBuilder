import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// Export PDF using html2pdf
export function exportToPDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Resume preview element not found.');
    return;
  }

  const opt = {
    margin: 0.3,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

// Export DOCX using docx library
export async function exportToDOCX(resumeData, filename = 'resume.docx') {
  const info = resumeData?.personalInfo || {};
  const children = [];

  // Header
  children.push(
    new Paragraph({
      text: info.fullName || 'Ajitha D R',
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${info.email || ''} | ${info.phone || ''} | ${info.location || ''}` }),
      ],
    })
  );

  // Summary
  if (resumeData?.summary) {
    children.push(
      new Paragraph({ text: 'PROFESSIONAL SUMMARY', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: resumeData.summary })
    );
  }

  // Education
  if (resumeData?.education?.length) {
    children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_1 }));
    resumeData.education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree} - ${edu.institution}`, bold: true }),
            new TextRun({ text: ` (${edu.year}) | ${edu.cgpa}` })
          ]
        })
      );
    });
  }

  // Skills
  if (resumeData?.skills) {
    children.push(new Paragraph({ text: 'TECHNICAL SKILLS', heading: HeadingLevel.HEADING_1 }));
    const s = resumeData.skills;
    if (s.languages) children.push(new Paragraph({ text: `Languages: ${s.languages.join(', ')}` }));
    if (s.frameworks) children.push(new Paragraph({ text: `Frameworks: ${s.frameworks.join(', ')}` }));
    if (s.databases) children.push(new Paragraph({ text: `Databases: ${s.databases.join(', ')}` }));
    if (s.tools) children.push(new Paragraph({ text: `Tools: ${s.tools.join(', ')}` }));
  }

  // Projects
  if (resumeData?.projects?.length) {
    children.push(new Paragraph({ text: 'PROJECTS', heading: HeadingLevel.HEADING_1 }));
    resumeData.projects.forEach(proj => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            new TextRun({ text: ` (${proj.technologies?.join(', ') || ''})`, italics: true })
          ]
        }),
        new Paragraph({ text: proj.description })
      );
    });
  }

  const doc = new Document({
    sections: [{ properties: {}, children }]
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
