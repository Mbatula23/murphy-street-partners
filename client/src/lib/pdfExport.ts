import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Deal {
  name: string;
  league: string | null;
  country: string | null;
  currentValuation: string | null;
  revenue: string | null;
  ebitda: string | null;
  debt: string | null;
  investmentThesis: string | null;
  keyRisks: string | null;
  valueCreationOpportunities: string | null;
}

interface Scenario {
  id: number;
  name: string;
  entryValuation: string;
  stakePercentage: string;
  investmentAmount: string;
  debtPercentage: string | null;
  revenueGrowthRate: string | null;
  ebitdaMarginImprovement: string | null;
  exitYear: number | null;
  exitMultiple: string | null;
  exitValuation: string | null;
  irr: string | null;
  moic: string | null;
  cashOnCashReturn: string | null;
}

export function exportDealWithScenarios(deal: Deal, scenarios: Scenario[]) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Murphy Street Partners', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(deal.name, 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${deal.league || ''} • ${deal.country || ''}`, 105, 37, { align: 'center' });
  
  // Deal Overview
  let yPos = 50;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Deal Overview', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const dealData = [
    ['Valuation', deal.currentValuation ? `€${deal.currentValuation}M` : 'N/A'],
    ['Revenue', deal.revenue ? `€${deal.revenue}M` : 'N/A'],
    ['EBITDA', deal.ebitda ? `€${deal.ebitda}M` : 'N/A'],
    ['Net Debt', deal.debt ? `€${deal.debt}M` : 'N/A'],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: dealData,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 50 }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Investment Thesis
  if (deal.investmentThesis) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment Thesis', 20, yPos);
    yPos += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitThesis = doc.splitTextToSize(deal.investmentThesis, 170);
    doc.text(splitThesis, 20, yPos);
    yPos += splitThesis.length * 5 + 10;
  }
  
  // Key Risks
  if (deal.keyRisks && yPos < 250) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Risks', 20, yPos);
    yPos += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitRisks = doc.splitTextToSize(deal.keyRisks, 170);
    doc.text(splitRisks, 20, yPos);
    yPos += splitRisks.length * 5 + 10;
  }
  
  // New page for scenarios
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Scenario Analysis', 105, yPos, { align: 'center' });
  
  yPos += 15;
  
  if (scenarios.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No scenarios available', 105, yPos, { align: 'center' });
  } else {
    // Scenario comparison table
    const scenarioHeaders = ['Metric', ...scenarios.map(s => s.name)];
    const scenarioData = [
      ['IRR', ...scenarios.map(s => `${s.irr || 'N/A'}%`)],
      ['MOIC', ...scenarios.map(s => `${s.moic || 'N/A'}x`)],
      ['Entry Valuation', ...scenarios.map(s => `€${s.entryValuation}M`)],
      ['Stake %', ...scenarios.map(s => `${s.stakePercentage}%`)],
      ['Investment', ...scenarios.map(s => `€${s.investmentAmount}M`)],
      ['Revenue Growth', ...scenarios.map(s => `${s.revenueGrowthRate}%`)],
      ['Margin Improvement', ...scenarios.map(s => `${s.ebitdaMarginImprovement}pp`)],
      ['Exit Year', ...scenarios.map(s => `${s.exitYear}Y`)],
      ['Exit Multiple', ...scenarios.map(s => `${s.exitMultiple}x`)],
      ['Exit Valuation', ...scenarios.map(s => `€${s.exitValuation}M`)],
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [scenarioHeaders],
      body: scenarioData,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 }
      }
    });
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Murphy Street Partners - Confidential | Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      new Date().toLocaleDateString(),
      190,
      290,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`${deal.name.replace(/\s+/g, '_')}_Analysis.pdf`);
}

export function exportScenarioComparison(dealName: string, scenarios: Scenario[]) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Murphy Street Partners', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`${dealName} - Scenario Comparison`, 105, 30, { align: 'center' });
  
  let yPos = 50;
  
  if (scenarios.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No scenarios available', 105, yPos, { align: 'center' });
  } else {
    const scenarioHeaders = ['Metric', ...scenarios.map(s => s.name)];
    const scenarioData = [
      ['IRR', ...scenarios.map(s => `${s.irr || 'N/A'}%`)],
      ['MOIC', ...scenarios.map(s => `${s.moic || 'N/A'}x`)],
      ['Cash-on-Cash', ...scenarios.map(s => `${s.cashOnCashReturn}%`)],
      ['Entry Valuation', ...scenarios.map(s => `€${s.entryValuation}M`)],
      ['Stake %', ...scenarios.map(s => `${s.stakePercentage}%`)],
      ['Investment Amount', ...scenarios.map(s => `€${s.investmentAmount}M`)],
      ['Debt Financing', ...scenarios.map(s => `${s.debtPercentage}%`)],
      ['Revenue Growth (Annual)', ...scenarios.map(s => `${s.revenueGrowthRate}%`)],
      ['EBITDA Margin Improvement', ...scenarios.map(s => `${s.ebitdaMarginImprovement}pp`)],
      ['Exit Year', ...scenarios.map(s => `${s.exitYear}Y`)],
      ['Exit Multiple', ...scenarios.map(s => `${s.exitMultiple}x`)],
      ['Exit Valuation', ...scenarios.map(s => `€${s.exitValuation}M`)],
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [scenarioHeaders],
      body: scenarioData,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 }
      }
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'Murphy Street Partners - Confidential',
    105,
    290,
    { align: 'center' }
  );
  doc.text(
    new Date().toLocaleDateString(),
    190,
    290,
    { align: 'right' }
  );
  
  // Save the PDF
  doc.save(`${dealName.replace(/\s+/g, '_')}_Scenarios.pdf`);
}
