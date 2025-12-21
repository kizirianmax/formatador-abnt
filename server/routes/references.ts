import { Router } from "express";

const router = Router();

// Armazenamento em memória para referências (em produção, usar banco de dados)
// Como não temos banco de dados configurado, vamos usar localStorage no cliente
// e apenas validar/processar no servidor

interface Reference {
  id: string;
  text: string;
  type: "livro" | "artigo" | "site" | "tese" | "outro";
  project?: string;
  createdAt: string;
  userId?: string;
}

// POST /api/references/sync - Sincronizar referências do cliente
router.post("/sync", async (req, res) => {
  try {
    const { references, userId } = req.body;
    
    if (!Array.isArray(references)) {
      return res.status(400).json({ 
        success: false, 
        error: "Referências devem ser um array" 
      });
    }
    
    // Validar cada referência
    const validatedRefs = references.map((ref: any) => ({
      id: ref.id || crypto.randomUUID(),
      text: String(ref.text || ''),
      type: ['livro', 'artigo', 'site', 'tese', 'outro'].includes(ref.type) ? ref.type : 'outro',
      project: ref.project || null,
      createdAt: ref.createdAt || new Date().toISOString(),
      userId: userId || null
    }));
    
    // Em produção, salvar no banco de dados
    // Por agora, apenas retornar as referências validadas
    
    return res.json({
      success: true,
      message: "Referências sincronizadas com sucesso",
      references: validatedRefs,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Erro ao sincronizar referências:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erro interno ao sincronizar referências" 
    });
  }
});

// POST /api/references/format - Formatar referência para ABNT
router.post("/format", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ 
        success: false, 
        error: "Tipo e dados são obrigatórios" 
      });
    }
    
    let formattedReference = '';
    
    // Formatar autor (SOBRENOME, Nome)
    const formatAuthor = (author: string): string => {
      if (!author) return '';
      const parts = author.trim().split(' ');
      if (parts.length === 1) return parts[0].toUpperCase();
      const lastName = parts.pop()?.toUpperCase();
      const firstName = parts.join(' ');
      return `${lastName}, ${firstName}`;
    };
    
    switch (type) {
      case 'livro':
        // SOBRENOME, Nome. Título: subtítulo. Edição. Local: Editora, Ano.
        formattedReference = `${formatAuthor(data.author)}. **${data.title}**${data.subtitle ? `: ${data.subtitle}` : ''}. ${data.edition ? `${data.edition}. ed. ` : ''}${data.city || 'Local'}: ${data.publisher || 'Editora'}, ${data.year || 'Ano'}.`;
        break;
        
      case 'artigo':
        // SOBRENOME, Nome. Título do artigo. Nome da Revista, Local, v. X, n. X, p. X-X, mês ano.
        formattedReference = `${formatAuthor(data.author)}. ${data.title}. **${data.journal || 'Nome da Revista'}**, ${data.city || 'Local'}, v. ${data.volume || 'X'}, n. ${data.number || 'X'}, p. ${data.pages || 'X-X'}, ${data.month || ''} ${data.year || 'Ano'}.`;
        break;
        
      case 'site':
        // SOBRENOME, Nome. Título da página. Nome do site, ano. Disponível em: URL. Acesso em: data.
        formattedReference = `${formatAuthor(data.author)}. **${data.title}**. ${data.siteName || 'Nome do site'}, ${data.year || new Date().getFullYear()}. Disponível em: ${data.url || 'URL'}. Acesso em: ${data.accessDate || new Date().toLocaleDateString('pt-BR')}.`;
        break;
        
      case 'tese':
        // SOBRENOME, Nome. Título. Ano. Tipo (Grau) - Instituição, Local, Ano.
        formattedReference = `${formatAuthor(data.author)}. **${data.title}**. ${data.year || 'Ano'}. ${data.pages ? `${data.pages} f. ` : ''}${data.type || 'Dissertação'} (${data.degree || 'Mestrado'}) - ${data.institution || 'Instituição'}, ${data.city || 'Local'}, ${data.year || 'Ano'}.`;
        break;
        
      default:
        formattedReference = data.text || '';
    }
    
    return res.json({
      success: true,
      formattedReference,
      type
    });
  } catch (error: any) {
    console.error("Erro ao formatar referência:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erro interno ao formatar referência" 
    });
  }
});

// POST /api/references/validate - Validar formato ABNT
router.post("/validate", async (req, res) => {
  try {
    const { reference } = req.body;
    
    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        error: "Referência é obrigatória" 
      });
    }
    
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Verificações básicas de formato ABNT
    
    // 1. Verificar se começa com autor em maiúsculas
    if (!/^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]+,/.test(reference)) {
      issues.push("O sobrenome do autor deve estar em MAIÚSCULAS no início");
      suggestions.push("Inicie com: SOBRENOME, Nome.");
    }
    
    // 2. Verificar se tem ponto final
    if (!reference.trim().endsWith('.')) {
      issues.push("A referência deve terminar com ponto final");
    }
    
    // 3. Verificar se tem título em destaque (negrito ou itálico)
    if (!reference.includes('**') && !reference.includes('_')) {
      issues.push("O título principal deve estar em destaque (negrito)");
      suggestions.push("Use **Título** para destacar o título principal");
    }
    
    // 4. Verificar presença de ano
    if (!/\d{4}/.test(reference)) {
      issues.push("A referência deve conter o ano de publicação");
    }
    
    // 5. Verificar se é referência de site e tem acesso
    if (reference.toLowerCase().includes('disponível em') && !reference.toLowerCase().includes('acesso em')) {
      issues.push("Referências de sites devem incluir a data de acesso");
      suggestions.push("Adicione: Acesso em: DD mês. AAAA.");
    }
    
    const isValid = issues.length === 0;
    
    return res.json({
      success: true,
      isValid,
      issues,
      suggestions,
      score: Math.max(0, 100 - (issues.length * 20))
    });
  } catch (error: any) {
    console.error("Erro ao validar referência:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erro interno ao validar referência" 
    });
  }
});

export default router;
