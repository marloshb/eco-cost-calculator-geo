
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  area: number;
  activity: string;
  totalLoss: number;
  impactedServices: string[];
  compliance: {
    codigoFlorestal: string;
    emissoes: string;
    mercadoCarbono: string;
  };
  co2Emissions: number;
  opportunities: {
    redd: number;
    psa: number;
    ecoturismo: number;
    carbonCredits: number;
  };
  coordinates: [number, number][];
}

export class ReportGenerator {
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  private formatDate(): string {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private getActivityName(activity: string): string {
    const activities: { [key: string]: string } = {
      agricultura: 'Cultivo de Cereais (CNAE 01.11-3)',
      pecuaria: 'Criação de Bovinos (CNAE 01.51-2)',
      extracao_madeira: 'Extração de Madeira (CNAE 02.10-8)',
      mineracao: 'Extração de Minério (CNAE 07.10-3)',
      rodovia: 'Construção de Rodovias (CNAE 42.11-1)',
      construcao: 'Construção Civil (CNAE 41.20-4)',
      industria: 'Indústria Química (CNAE 19.10-7)',
      turismo_predatorio: 'Turismo Não Sustentável (CNAE 79.11-2)'
    };
    return activities[activity] || activity;
  }

  private getServiceTranslation(service: string): string {
    const translations: { [key: string]: string } = {
      carbono: 'Sequestro de Carbono',
      agua: 'Purificação de Água',
      biodiversidade: 'Conservação da Biodiversidade',
      erosao: 'Controle de Erosão',
      polinizacao: 'Polinização',
      enchentes: 'Regulação de Enchentes',
      solo: 'Formação de Solo'
    };
    return translations[service] || service;
  }

  async generateReport(data: ReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RELATÓRIO DE ANÁLISE AMBIENTAL', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Calculadora de Custos Ambientais Geoespacial', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${this.formatDate()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Dados Básicos
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('1. DADOS BÁSICOS DA ANÁLISE', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Área Analisada: ${data.area.toFixed(2)} hectares`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Atividade Econômica: ${this.getActivityName(data.activity)}`, 25, yPosition);
    yPosition += 6;
    
    if (data.coordinates.length > 0) {
      pdf.text('Coordenadas do Polígono:', 25, yPosition);
      yPosition += 5;
      data.coordinates.slice(0, 3).forEach((coord, index) => {
        pdf.text(`  Ponto ${index + 1}: ${coord[0].toFixed(6)}°, ${coord[1].toFixed(6)}°`, 30, yPosition);
        yPosition += 4;
      });
      if (data.coordinates.length > 3) {
        pdf.text(`  ... e mais ${data.coordinates.length - 3} pontos`, 30, yPosition);
        yPosition += 4;
      }
    }

    yPosition += 10;

    // Resultados da Análise
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('2. RESULTADOS DA ANÁLISE DE IMPACTO', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Custo Total das Perdas Ambientais: ${this.formatCurrency(data.totalLoss)} por ano`, 25, yPosition);
    yPosition += 8;

    pdf.text(`Impacto por Hectare: ${this.formatCurrency(data.totalLoss / data.area)} por hectare/ano`, 25, yPosition);
    yPosition += 8;

    pdf.text(`Emissões de CO₂ Estimadas: ${data.co2Emissions.toLocaleString()} tCO₂`, 25, yPosition);
    yPosition += 10;

    // Serviços Ecossistêmicos Impactados
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('2.1 Serviços Ecossistêmicos Impactados:', 25, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    data.impactedServices.forEach(service => {
      pdf.text(`• ${this.getServiceTranslation(service)}`, 30, yPosition);
      yPosition += 5;
    });

    yPosition += 10;

    // Análise de Conformidade
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('3. ANÁLISE DE CONFORMIDADE LEGAL', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Código Florestal: ${data.compliance.codigoFlorestal}`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Metas de Emissões (NDC): ${data.compliance.emissoes}`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Mercado de Carbono: ${data.compliance.mercadoCarbono}`, 25, yPosition);
    yPosition += 15;

    // Oportunidades de Comercialização
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('4. OPORTUNIDADES DE COMERCIALIZAÇÃO', 20, yPosition);
    yPosition += 10;

    const totalOpportunities = data.opportunities.redd + data.opportunities.psa + data.opportunities.ecoturismo;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total de Oportunidades: ${this.formatCurrency(totalOpportunities)} por ano`, 25, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`REDD+ / Créditos de Carbono: ${this.formatCurrency(data.opportunities.redd)} por ano`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Pagamento por Serviços Ambientais: ${this.formatCurrency(data.opportunities.psa)} por ano`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Ecoturismo Sustentável: ${this.formatCurrency(data.opportunities.ecoturismo)} por ano`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Potencial Créditos de Carbono: ${this.formatCurrency(data.opportunities.carbonCredits)}`, 25, yPosition);
    yPosition += 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Análise Comparativa
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('5. ANÁLISE COMPARATIVA', 20, yPosition);
    yPosition += 10;

    const difference = totalOpportunities - data.totalLoss;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    if (difference > 0) {
      pdf.setTextColor(0, 128, 0);
      pdf.text(`Potencial de Ganho Líquido: ${this.formatCurrency(difference)} por ano`, 25, yPosition);
      yPosition += 6;
      pdf.setTextColor(0, 0, 0);
      pdf.text('Recomendação: Implementar estratégias de conservação e comercialização de ativos ambientais.', 25, yPosition);
    } else {
      pdf.setTextColor(255, 0, 0);
      pdf.text(`Déficit Potencial: ${this.formatCurrency(Math.abs(difference))} por ano`, 25, yPosition);
      yPosition += 6;
      pdf.setTextColor(0, 0, 0);
      pdf.text('Recomendação: Reavaliar a atividade proposta e considerar alternativas sustentáveis.', 25, yPosition);
    }

    yPosition += 15;

    // Recomendações
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('6. RECOMENDAÇÕES', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const recommendations = [
      '• Considere implementar projetos REDD+ para monetizar a conservação florestal',
      '• Explore parcerias para Pagamento por Serviços Ambientais (PSA)',
      '• Avalie o potencial de ecoturismo sustentável na região',
      '• Monitore a conformidade com o Código Florestal Brasileiro',
      '• Considere certificações ambientais para acessar mercados premium',
      '• Implemente sistemas de monitoramento ambiental contínuo'
    ];

    recommendations.forEach(rec => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(rec, 25, yPosition);
      yPosition += 6;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Este relatório foi gerado pela Calculadora de Custos Ambientais Geoespacial', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    pdf.save(`relatorio-ambiental-${Date.now()}.pdf`);
  }
}

export const reportGenerator = new ReportGenerator();
