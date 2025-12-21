import { useState, useEffect, useCallback } from "react";

export interface Reference {
  id: string;
  text: string;
  type: "site" | "livro" | "artigo" | "tese" | "outro";
  title?: string;
  author?: string;
  createdAt: string;
  tags?: string[];
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

const LIBRARY_KEY = "abnt_reference_library";
const PROJECTS_KEY = "abnt_projects";

export function useReferenceLibrary() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedRefs = localStorage.getItem(LIBRARY_KEY);
      if (savedRefs) {
        setReferences(JSON.parse(savedRefs));
      }

      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    }
  }, []);

  // Salvar referências
  const saveReferences = useCallback((refs: Reference[]) => {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(refs));
      setReferences(refs);
    } catch (error) {
      console.error("Erro ao salvar referências:", error);
    }
  }, []);

  // Salvar projetos
  const saveProjects = useCallback((projs: Project[]) => {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projs));
      setProjects(projs);
    } catch (error) {
      console.error("Erro ao salvar projetos:", error);
    }
  }, []);

  // Adicionar referência
  const addReference = useCallback((
    text: string,
    type: Reference["type"] = "outro",
    title?: string,
    author?: string,
    projectId?: string,
    tags?: string[]
  ) => {
    const newRef: Reference = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      type,
      title,
      author,
      createdAt: new Date().toISOString(),
      projectId,
      tags
    };

    const updated = [newRef, ...references];
    saveReferences(updated);
    return newRef;
  }, [references, saveReferences]);

  // Remover referência
  const removeReference = useCallback((id: string) => {
    const updated = references.filter(ref => ref.id !== id);
    saveReferences(updated);
  }, [references, saveReferences]);

  // Atualizar referência
  const updateReference = useCallback((id: string, updates: Partial<Reference>) => {
    const updated = references.map(ref => 
      ref.id === id ? { ...ref, ...updates } : ref
    );
    saveReferences(updated);
  }, [references, saveReferences]);

  // Buscar referências
  const searchReferences = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return references.filter(ref =>
      ref.text.toLowerCase().includes(lowerQuery) ||
      ref.title?.toLowerCase().includes(lowerQuery) ||
      ref.author?.toLowerCase().includes(lowerQuery) ||
      ref.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [references]);

  // Filtrar por projeto
  const getByProject = useCallback((projectId: string | null) => {
    if (!projectId) return references;
    return references.filter(ref => ref.projectId === projectId);
  }, [references]);

  // Filtrar por tipo
  const getByType = useCallback((type: Reference["type"]) => {
    return references.filter(ref => ref.type === type);
  }, [references]);

  // Adicionar projeto
  const addProject = useCallback((name: string) => {
    const newProject: Project = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date().toISOString()
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    return newProject;
  }, [projects, saveProjects]);

  // Remover projeto
  const removeProject = useCallback((id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    
    // Remover projectId das referências associadas
    const updatedRefs = references.map(ref =>
      ref.projectId === id ? { ...ref, projectId: undefined } : ref
    );
    saveReferences(updatedRefs);
  }, [projects, references, saveProjects, saveReferences]);

  // Exportar referências como texto
  const exportAsText = useCallback((refIds?: string[]) => {
    const toExport = refIds 
      ? references.filter(ref => refIds.includes(ref.id))
      : references;
    
    return toExport.map(ref => ref.text).join("\n\n");
  }, [references]);

  // Importar referências (para backup/sync)
  const importReferences = useCallback((newRefs: Reference[]) => {
    const existingIds = new Set(references.map(r => r.id));
    const uniqueNewRefs = newRefs.filter(r => !existingIds.has(r.id));
    const updated = [...uniqueNewRefs, ...references];
    saveReferences(updated);
    return uniqueNewRefs.length;
  }, [references, saveReferences]);

  // Limpar tudo
  const clearAll = useCallback(() => {
    localStorage.removeItem(LIBRARY_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    setReferences([]);
    setProjects([]);
  }, []);

  return {
    references,
    projects,
    addReference,
    removeReference,
    updateReference,
    searchReferences,
    getByProject,
    getByType,
    addProject,
    removeProject,
    exportAsText,
    importReferences,
    clearAll,
    totalCount: references.length
  };
}
