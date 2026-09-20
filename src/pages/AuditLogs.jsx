import { useState, useEffect } from 'react';
import { getAuditLogs } from '../api/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Formatea el string JSON para mostrarlo identado en el modal
  const formatJson = (jsonString) => {
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString; // Retorna el texto original si no es un JSON válido
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Cargando logs de auditoría...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-[#003876]">Bitácora de Auditoría Centralizada</h1>
        <p className="text-xs text-slate-500 mt-1">Registro cronológico de eventos generados por microservicios y Kafka.</p>
      </div>

      <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#003876] text-white text-xs uppercase tracking-wider">
              <th className="p-4">Servicio Origen</th>
              <th className="p-4">Evento</th>
              <th className="p-4">ID Entidad</th>
              <th className="p-4">Payload de Transacción</th>
              <th className="p-4">Fecha y Hora</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-blue-900 text-xs">{log.sourceService}</td>
                <td className="p-4 font-mono text-xs font-semibold text-slate-800">{log.eventType}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{log.entityId || 'N/A'}</td>
                <td className="p-4 font-mono text-xs text-slate-600 max-w-xs truncate" title={log.payload}>
                  {log.payload}
                </td>
                <td className="p-4 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="px-3 py-1 text-xs font-semibold text-[#003876] bg-blue-50 border border-blue-200 rounded-md hover:bg-[#003876] hover:text-white transition-colors"
                  >
                    Ver JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Inspección JSON */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-fadeIn">
            <div className="bg-[#003876] px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold text-base">Detalle del Evento: {selectedLog.eventType}</h3>
                <p className="text-xs text-blue-100 mt-0.5">Servicio: {selectedLog.sourceService}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span><strong>ID Entidad:</strong> {selectedLog.entityId || 'N/A'}</span>
                <span><strong>Fecha:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</span>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payload JSON</label>
                  <button
                    onClick={() => handleCopy(formatJson(selectedLog.payload))}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded bg-blue-50 border border-blue-100"
                  >
                    {copied ? '¡Copiado!' : 'Copiar JSON'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-96 shadow-inner leading-relaxed">
                  {formatJson(selectedLog.payload)}
                </pre>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 flex justify-end border-t border-slate-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}