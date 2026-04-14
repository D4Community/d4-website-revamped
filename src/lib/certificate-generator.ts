// Dynamic import for pdfkit
let PDFDocument: any = null;

async function getPDFDocument() {
  if (!PDFDocument) {
    const pdfkit = await import('pdfkit');
    PDFDocument = pdfkit.default;
  }
  return PDFDocument;
}

export async function generateCertificatePDF(name: string, date: Date, memberId: string): Promise<Buffer> {
  const PDFDocument = await getPDFDocument();
  
  /** * FIX: Using the Direct Download URL for Google Drive
   * Your file: LOGO_WHITE.png 
   * We change '/file/d/[ID]/view' to 'uc?export=download&id=[ID]'
   */
  const fileId = "1MLH4-BkYTjIKReRl2n2BHJzbYxFa52JE";
  const logoUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
  
  const logoResponse = await fetch(logoUrl);
  if (!logoResponse.ok) {
    throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);
  }
  const logoArrayBuffer = await logoResponse.arrayBuffer();
  const logoBuffer = Buffer.from(logoArrayBuffer);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape', 
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      const W = doc.page.width;
      const H = doc.page.height;
      const coral = '#fd7d6e';

      // 1. BACKGROUND
      doc.rect(0, 0, W, H).fill('#1f1f1f');

      // 2. WATERMARK & GEOMETRIC ELEMENTS
      doc.save();
      doc.fillColor('#ffffff').fillOpacity(0.03).font('Helvetica-Bold').fontSize(300)
         .text('D4', W/2 - 180, H/2 - 120);

      doc.fillColor('#22d3ee').fillOpacity(0.1).circle(0, 0, 150).fill();
      doc.fillColor(coral).fillOpacity(0.08).circle(W, H, 200).fill();

      doc.fillColor('#38bdf8').fillOpacity(0.2).polygon([100, 100, 130, 120, 100, 140]).fill();
      doc.fillColor(coral).fillOpacity(0.2).polygon([W-150, H-200, W-120, H-180, W-150, H-160]).fill();
      
      doc.fillColor('#ffffff').fillOpacity(0.1);
      for(let i=0; i<6; i++) {
        for(let j=0; j<6; j++) {
            doc.circle(W/2 + 200 + (i*15), 100 + (j*15), 2).fill();
        }
      }
      doc.restore();

      // 3. HEADER & LOGO
      // LOGO_WHITE.png 
      // Positioned at the top right
      doc.image(logoBuffer, W - 140, 40, { width: 90 });
      
      const leftMargin = 70;
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(32)
         .text(`Welcome, ${name}!`, leftMargin, 100);

      // 4. CERTIFICATE CONTENT
      doc.fillColor('#e0e0e0').font('Helvetica').fontSize(16).lineGap(10);
      const contentWidth = W - (leftMargin * 2.5);

      doc.text(`We are thrilled to welcome you to the D4 Community. Your expertise and passion are exactly what we look for in our mission to Discite, Develop, Debug, and Deploy.`, leftMargin, 170, { width: contentWidth });

      // OPPORTUNITIES SECTION
      const listTop = 270;
      doc.fillColor(coral).font('Helvetica-Bold').fontSize(18).text('Your Opportunities:', leftMargin, listTop);
      
      const items = [
        'Collaborate with industry experts.',
        'Access exclusive workshops and resources.',
        'Expand your global professional network.',
        'Contribute to high-impact tech initiatives.'
      ];

      doc.fontSize(14).font('Helvetica').fillColor('#cccccc');
      items.forEach((item, i) => {
        doc.fillColor(coral).text('•', leftMargin + 10, listTop + 35 + (i * 25));
        doc.fillColor('#cccccc').text(item, leftMargin + 30, listTop + 35 + (i * 25));
      });

      // 5. FOOTER SECTION
      const footerY = H - 120;

      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(16)
         .text('Warm Regards,', leftMargin, footerY);
      doc.fillColor(coral).fontSize(18)
         .text('Team D4', leftMargin, footerY + 25);

      doc.save()
         .strokeColor('#555').lineWidth(1)
         .moveTo(W - 350, footerY).lineTo(W - leftMargin, footerY).stroke()
         .restore();

      doc.fontSize(10).fillColor('#999')
         .text(`MEMBER ID: ${memberId}`, W - 350, footerY + 15, { width: 280, align: 'right' });
      doc.text(`ISSUED ON: ${date.toLocaleDateString('en-GB')}`, W - 350, footerY + 30, { width: 280, align: 'right' });

      // Final Bottom Tagline
      doc.fontSize(8).fillColor('#6f6f6f')
         .text('Discite • Develop • Debug • Deploy', 0, H - 30, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}