import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  FileText, 
  File,
  Loader2,
  Check
} from "lucide-react";

interface WorkData {
  title: string;
  author: string;
  institution: string;
  course: string;
  city: string;
  year: string;
  abstract: string;
  keywords: string;
  introduction: string;
  development: string;
  conclusion: string;
  references: string;
}

interface DocumentExporterProps {
  workData: WorkData;
}

export default function DocumentExporter({ workData }: DocumentExporterProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const isDataValid = workData.title && workData.author;

  // Gerar conteúdo HTML formatado ABNT
  const generateABNTHTML = (): string => {
    const styles = `
      <style>
        @page {
          size: A4;
          margin: 3cm 2cm 2cm 3cm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          text-align: justify;
          color: #000;
        }
        .cover {
          text-align: center;
          page-break-after: always;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2cm 0;
        }
        .cover-institution {
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
        }
        .cover-title {
          font-size: 16pt;
          font-weight: bold;
          text-transform: uppercase;
          margin: 2cm 0;
        }
        .cover-author {
          font-size: 12pt;
          text-transform: uppercase;
        }
        .cover-location {
          font-size: 12pt;
        }
        .abstract-page {
          page-break-after: always;
        }
        .abstract-title {
          font-size: 12pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1cm;
        }
        .keywords {
          margin-top: 1cm;
        }
        .keywords-label {
          font-weight: bold;
        }
        .section-title {
          font-size: 12pt;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 1cm;
          margin-bottom: 0.5cm;
        }
        .content {
          text-indent: 1.25cm;
          margin-bottom: 0.5cm;
        }
        .references-title {
          font-size: 12pt;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          margin-top: 1cm;
          margin-bottom: 1cm;
        }
        .reference-item {
          margin-bottom: 0.5cm;
          text-indent: 0;
        }
      </style>
    `;

    const cover = `
      <div class="cover">
        <div>
          <p class="cover-institution">${workData.institution || 'INSTITUIÇÃO'}</p>
          <p class="cover-author">${workData.course || 'CURSO'}</p>
        </div>
        <div>
          <p class="cover-author">${workData.author.toUpperCase()}</p>
        </div>
        <div>
          <p class="cover-title">${workData.title.toUpperCase()}</p>
        </div>
        <div>
          <p class="cover-location">${workData.city || 'Cidade'}</p>
          <p class="cover-location">${workData.year}</p>
        </div>
      </div>
    `;

    const abstractPage = workData.abstract ? `
      <div class="abstract-page">
        <p class="abstract-title">RESUMO</p>
        <p class="content">${workData.abstract}</p>
        ${workData.keywords ? `
          <p class="keywords">
            <span class="keywords-label">Palavras-chave:</span> ${workData.keywords}
          </p>
        ` : ''}
      </div>
    ` : '';

    const introduction = workData.introduction ? `
      <p class="section-title">1 INTRODUÇÃO</p>
      ${workData.introduction.split('\n').map(p => `<p class="content">${p}</p>`).join('')}
    ` : '';

    const development = workData.development ? `
      <p class="section-title">2 DESENVOLVIMENTO</p>
      ${workData.development.split('\n').map(p => `<p class="content">${p}</p>`).join('')}
    ` : '';

    const conclusion = workData.conclusion ? `
      <p class="section-title">3 CONCLUSÃO</p>
      ${workData.conclusion.split('\n').map(p => `<p class="content">${p}</p>`).join('')}
    ` : '';

    const references = workData.references ? `
      <p class="references-title">REFERÊNCIAS</p>
      ${workData.references.split('\n').filter(r => r.trim()).map(r => `<p class="reference-item">${r}</p>`).join('')}
    ` : '';

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${workData.title}</title>
        ${styles}
      </head>
      <body>
        ${cover}
        ${abstractPage}
        ${introduction}
        ${development}
        ${conclusion}
        ${references}
      </body>
      </html>
    `;
  };

  // Exportar como HTML (pode ser aberto no Word)
  const exportAsWord = async () => {
    setIsExporting('word');
    
    try {
      const html = generateABNTHTML();
      
      // Criar blob com tipo MIME do Word
      const blob = new Blob([html], { 
        type: 'application/msword' 
      });
      
      // Criar link de download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workData.title || 'trabalho'}_ABNT.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess('word');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao exportar Word:', error);
      alert('Erro ao exportar documento. Tente novamente.');
    } finally {
      setIsExporting(null);
    }
  };

  // Exportar como PDF (usando print)
  const exportAsPDF = async () => {
    setIsExporting('pdf');
    
    try {
      const html = generateABNTHTML();
      
      // Abrir nova janela com o conteúdo
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Aguardar carregamento e imprimir
        printWindow.onload = () => {
          printWindow.print();
        };
        
        // Fallback se onload não funcionar
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      setExportSuccess('pdf');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(null);
    }
  };

  // Exportar como HTML puro
  const exportAsHTML = async () => {
    setIsExporting('html');
    
    try {
      const html = generateABNTHTML();
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workData.title || 'trabalho'}_ABNT.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess('html');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao exportar HTML:', error);
      alert('Erro ao exportar documento. Tente novamente.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Documento
        </CardTitle>
        <CardDescription>
          Baixe seu trabalho formatado nas normas ABNT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Botão Word */}
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={exportAsWord}
          disabled={!isDataValid || isExporting !== null}
        >
          {isExporting === 'word' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : exportSuccess === 'word' ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
          )}
          Exportar para Word (.doc)
        </Button>

        {/* Botão PDF */}
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={exportAsPDF}
          disabled={!isDataValid || isExporting !== null}
        >
          {isExporting === 'pdf' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : exportSuccess === 'pdf' ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <File className="mr-2 h-4 w-4 text-red-600" />
          )}
          Exportar para PDF
        </Button>

        {/* Botão HTML */}
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={exportAsHTML}
          disabled={!isDataValid || isExporting !== null}
        >
          {isExporting === 'html' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : exportSuccess === 'html' ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <FileText className="mr-2 h-4 w-4 text-orange-600" />
          )}
          Exportar como HTML
        </Button>

        {!isDataValid && (
          <p className="text-xs text-gray-500 text-center">
            Preencha pelo menos título e autor para exportar
          </p>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p className="font-medium mb-1">📋 Formatação ABNT aplicada:</p>
          <ul className="space-y-0.5">
            <li>• Margens: 3cm (sup/esq), 2cm (inf/dir)</li>
            <li>• Fonte: Times New Roman 12pt</li>
            <li>• Espaçamento: 1,5 entre linhas</li>
            <li>• Recuo: 1,25cm nos parágrafos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
