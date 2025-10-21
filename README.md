# 📚 Formatador ABNT Online

**Formate seus trabalhos acadêmicos automaticamente seguindo as normas ABNT NBR 14724:2011**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

---

## 🎯 Sobre o Projeto

O **Formatador ABNT Online** é uma ferramenta web que facilita a criação de trabalhos acadêmicos formatados automaticamente de acordo com as normas da ABNT (Associação Brasileira de Normas Técnicas).

### ✨ Funcionalidades

- ✅ **Formatação automática** seguindo ABNT NBR 14724:2011
- ✅ **Interface intuitiva** com abas organizadas
- ✅ **Geração de PDF** com formatação profissional
- ✅ **Capa automática** com todos os elementos obrigatórios
- ✅ **Resumo e palavras-chave** formatados corretamente
- ✅ **Estrutura completa**: Introdução, Desenvolvimento, Conclusão
- ✅ **Referências bibliográficas** organizadas
- ✅ **Contador de palavras** em tempo real
- ✅ **Validação de campos** obrigatórios
- ✅ **Design responsivo** (funciona em mobile e desktop)

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações suaves
- **Vite** - Build tool rápido

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem no servidor

### Ferramentas
- **pnpm** - Gerenciador de pacotes rápido
- **ESBuild** - Bundler ultra-rápido
- **Prettier** - Formatação de código

---

## 📋 Normas ABNT Implementadas

O formatador segue as seguintes especificações da **ABNT NBR 14724:2011**:

| Elemento | Especificação |
|----------|---------------|
| **Margens** | Superior e esquerda: 3cm / Inferior e direita: 2cm |
| **Fonte** | Arial ou Times New Roman, tamanho 12 |
| **Espaçamento** | 1,5 entre linhas |
| **Numeração** | A partir da introdução (páginas em algarismos arábicos) |
| **Capa** | Instituição, autor, título, local e ano |
| **Resumo** | 150 a 500 palavras |
| **Palavras-chave** | 3 a 5 palavras separadas por vírgula |
| **Referências** | Ordem alfabética, espaçamento simples |

---

## 🛠️ Instalação e Uso

### Pré-requisitos

- **Node.js** 18 ou superior
- **pnpm** (recomendado) ou npm

### Passo 1: Clone o repositório

```bash
git clone https://github.com/kizirianmax/formatador-abnt.git
cd formatador-abnt
```

### Passo 2: Instale as dependências

```bash
pnpm install
# ou
npm install
```

### Passo 3: Execute em modo desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em: **http://localhost:5000**

### Passo 4: Build para produção

```bash
pnpm build
# ou
npm run build
```

### Passo 5: Execute em produção

```bash
pnpm start
# ou
npm start
```

---

## 📖 Como Usar

### 1. Preencha os dados da Capa

- **Título do Trabalho** (obrigatório)
- **Autor** (obrigatório)
- **Instituição** (obrigatório)
- **Curso** (obrigatório)
- **Cidade** (obrigatório)
- **Ano** (obrigatório)

### 2. Escreva o Resumo

- Resumo do trabalho (150-500 palavras)
- Palavras-chave (3-5 palavras separadas por vírgula)

### 3. Adicione o Conteúdo

- **Introdução**: Apresentação do tema
- **Desenvolvimento**: Corpo do trabalho
- **Conclusão**: Considerações finais

### 4. Insira as Referências

- Cole as referências bibliográficas (uma por linha)
- Formato ABNT para livros, artigos, sites, etc.

### 5. Gere o PDF

- Clique em **"Gerar PDF"**
- O documento será gerado automaticamente com formatação ABNT

---

## 📁 Estrutura do Projeto

```
formatador-abnt/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   │   └── ui/        # Componentes UI (Radix + Tailwind)
│   │   ├── pages/         # Páginas da aplicação
│   │   │   └── Home.tsx   # Página principal
│   │   ├── App.tsx        # Componente raiz
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML base
├── server/                 # Backend Express
│   └── index.ts           # Servidor Node.js
├── shared/                # Código compartilhado
├── dist/                  # Build de produção
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração Vite
├── tsconfig.json          # Configuração TypeScript
├── tailwind.config.js     # Configuração Tailwind
└── README.md             # Este arquivo
```

---

## 🎨 Interface

A interface é dividida em **4 abas principais**:

### 📄 Capa
Campos para informações da capa do trabalho (instituição, autor, título, etc.)

### 📝 Resumo
Área para escrever o resumo e definir palavras-chave

### 📖 Conteúdo
Seções para introdução, desenvolvimento e conclusão

### 📚 Referências
Campo para inserir referências bibliográficas

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça login no [Vercel](https://vercel.com)
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente (se necessário)
4. Deploy automático!

### Outras plataformas

O projeto também pode ser deployado em:
- **Netlify**
- **Railway**
- **Render**
- **Heroku**
- **AWS**
- **Google Cloud**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Versão 1.0 (Atual)
- [x] Interface básica com abas
- [x] Formulário completo de dados
- [x] Validação de campos obrigatórios
- [x] Contador de palavras
- [ ] Geração de PDF (em desenvolvimento)

### Versão 2.0 (Planejado)
- [ ] Geração de PDF funcional
- [ ] Templates de trabalhos (TCC, Artigo, Monografia)
- [ ] Upload de imagens e tabelas
- [ ] Citações automáticas
- [ ] Sumário automático
- [ ] Lista de figuras e tabelas
- [ ] Exportar para Word (.docx)
- [ ] Salvar rascunhos no navegador
- [ ] Modo escuro

### Versão 3.0 (Futuro)
- [ ] Sistema de login
- [ ] Salvar trabalhos na nuvem
- [ ] Colaboração em tempo real
- [ ] Verificador de plágio
- [ ] Sugestões de melhoria de texto
- [ ] Integração com Zotero/Mendeley
- [ ] API pública

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Kizirianmax**

- GitHub: [@kizirianmax](https://github.com/kizirianmax)
- Projeto: [formatador-abnt](https://github.com/kizirianmax/formatador-abnt)

---

## 🙏 Agradecimentos

- **ABNT** - Pelas normas técnicas
- **React** - Framework incrível
- **Tailwind CSS** - Estilização rápida e eficiente
- **Radix UI** - Componentes acessíveis
- **Comunidade Open Source** - Por todo o suporte

---

## 📞 Suporte

Se você encontrou um bug ou tem uma sugestão:

1. Abra uma [Issue](https://github.com/kizirianmax/formatador-abnt/issues)
2. Descreva o problema ou sugestão
3. Aguarde feedback da comunidade

---

## ⭐ Gostou do projeto?

Se este projeto foi útil para você, considere dar uma ⭐ no repositório!

---

**Desenvolvido com ❤️ para facilitar a vida acadêmica**

