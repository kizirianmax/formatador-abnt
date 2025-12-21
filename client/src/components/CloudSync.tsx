import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Loader2,
  Upload,
  Download
} from "lucide-react";
import { useReferenceLibrary, Reference } from "@/hooks/useReferenceLibrary";

interface CloudSyncProps {
  userId?: string;
}

export default function CloudSync({ userId }: CloudSyncProps) {
  const { references, importReferences } = useReferenceLibrary();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  // Carregar último sync do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastCloudSync');
    if (saved) {
      setLastSync(saved);
    }
  }, []);

  const syncToCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      const response = await fetch('/api/references/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          references,
          userId: userId || 'anonymous'
        }),
      });

      const result = await response.json();

      if (result.success) {
        const syncTime = new Date().toLocaleString('pt-BR');
        setLastSync(syncTime);
        localStorage.setItem('lastCloudSync', syncTime);
        setSyncStatus('success');
        setSyncMessage(`${references.length} referência(s) sincronizada(s)`);
      } else {
        setSyncStatus('error');
        setSyncMessage(result.error || 'Erro ao sincronizar');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Erro de conexão com o servidor');
    } finally {
      setIsSyncing(false);
      // Limpar status após 3 segundos
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    }
  };

  const validateReferences = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    
    try {
      let validCount = 0;
      let invalidCount = 0;
      
      for (const ref of references) {
        const response = await fetch('/api/references/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference: ref.text }),
        });
        
        const result = await response.json();
        if (result.isValid) {
          validCount++;
        } else {
          invalidCount++;
        }
      }
      
      setSyncStatus('success');
      setSyncMessage(`${validCount} válida(s), ${invalidCount} com problemas`);
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Erro ao validar referências');
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 5000);
    }
  };

  const exportBackup = () => {
    const backup = {
      references,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referencias-abnt-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSyncStatus('success');
    setSyncMessage('Backup exportado com sucesso');
    setTimeout(() => {
      setSyncStatus('idle');
      setSyncMessage('');
    }, 3000);
  };

  const importBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        
        if (backup.references && Array.isArray(backup.references)) {
          // Mesclar com referências existentes
          const existingIds = new Set(references.map(r => r.id));
          const newRefs = backup.references.filter((r: Reference) => !existingIds.has(r.id));
          
          if (newRefs.length > 0) {
            importReferences(newRefs);
            setSyncStatus('success');
            setSyncMessage(`${newRefs.length} nova(s) referência(s) importada(s)`);
          } else {
            setSyncStatus('success');
            setSyncMessage('Nenhuma referência nova encontrada');
          }
        } else {
          setSyncStatus('error');
          setSyncMessage('Arquivo de backup inválido');
        }
      } catch (error) {
        setSyncStatus('error');
        setSyncMessage('Erro ao ler arquivo de backup');
      }
      
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    };
    
    input.click();
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cloud className="h-5 w-5 text-green-600" />
          Sincronização
        </CardTitle>
        <CardDescription>
          Sincronize suas referências e faça backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status */}
        {syncMessage && (
          <div className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
            syncStatus === 'success' ? 'bg-green-100 text-green-700' :
            syncStatus === 'error' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {syncStatus === 'success' && <Check className="h-4 w-4" />}
            {syncStatus === 'error' && <AlertCircle className="h-4 w-4" />}
            {syncMessage}
          </div>
        )}

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={syncToCloud}
            disabled={isSyncing || references.length === 0}
            className="flex items-center gap-2"
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sincronizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={validateReferences}
            disabled={isSyncing || references.length === 0}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Validar ABNT
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportBackup}
            disabled={references.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={importBackup}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
        </div>

        {/* Última sincronização */}
        {lastSync && (
          <p className="text-xs text-gray-500 text-center">
            Última sincronização: {lastSync}
          </p>
        )}

        {/* Contador */}
        <p className="text-xs text-gray-500 text-center">
          {references.length} referência(s) na biblioteca
        </p>
      </CardContent>
    </Card>
  );
}
