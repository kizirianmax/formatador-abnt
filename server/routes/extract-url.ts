import { Router } from "express";

const router = Router();

// Função para extrair metadados de uma URL
async function extractMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extrair título
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const title = ogTitleMatch?.[1] || titleMatch?.[1] || '';
    
    // Extrair autor
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i);
    const ogAuthorMatch = html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i);
    const author = authorMatch?.[1] || ogAuthorMatch?.[1] || '';
    
    // Extrair data de publicação
    const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
    const dateMatch2 = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i);
    const dateMatch3 = html.match(/<time[^>]*datetime=["']([^"']+)["']/i);
    const publishedDate = dateMatch?.[1] || dateMatch2?.[1] || dateMatch3?.[1] || '';
    
    // Extrair descrição
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const description = ogDescMatch?.[1] || descMatch?.[1] || '';
    
    // Extrair site/publisher
    const siteMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
    const siteName = siteMatch?.[1] || new URL(url).hostname.replace('www.', '');
    
    // Formatar data
    let formattedDate = '';
    let accessDate = new Date().toLocaleDateString('pt-BR');
    
    if (publishedDate) {
      try {
        const date = new Date(publishedDate);
        formattedDate = date.toLocaleDateString('pt-BR');
      } catch {
        formattedDate = publishedDate;
      }
    }
    
    return {
      success: true,
      data: {
        title: title.trim(),
        author: author.trim(),
        publishedDate: formattedDate,
        description: description.trim(),
        siteName: siteName.trim(),
        url: url,
        accessDate: accessDate
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao extrair metadados'
    };
  }
}

// Função para gerar referência ABNT a partir dos metadados
function generateABNTReference(data: any): string {
  const { author, title, siteName, publishedDate, url, accessDate } = data;
  
  // Formatar autor (SOBRENOME, Nome)
  let formattedAuthor = author;
  if (author && author.includes(' ')) {
    const parts = author.split(' ');
    const lastName = parts.pop()?.toUpperCase();
    const firstName = parts.join(' ');
    formattedAuthor = `${lastName}, ${firstName}`;
  } else if (author) {
    formattedAuthor = author.toUpperCase();
  }
  
  // Montar referência ABNT para site
  let reference = '';
  
  if (formattedAuthor) {
    reference += `${formattedAuthor}. `;
  }
  
  if (title) {
    reference += `**${title}**. `;
  }
  
  if (siteName) {
    reference += `${siteName}, `;
  }
  
  if (publishedDate) {
    reference += `${publishedDate}. `;
  }
  
  reference += `Disponível em: ${url}. `;
  reference += `Acesso em: ${accessDate}.`;
  
  return reference;
}

// Endpoint POST /api/extract-url
router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: "URL é obrigatória" 
      });
    }
    
    // Validar URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ 
        success: false, 
        error: "URL inválida" 
      });
    }
    
    const result = await extractMetadata(url);
    
    if (result.success && result.data) {
      const abntReference = generateABNTReference(result.data);
      return res.json({
        ...result,
        abntReference
      });
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error("Erro ao extrair URL:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erro interno ao processar URL" 
    });
  }
});

export default router;
