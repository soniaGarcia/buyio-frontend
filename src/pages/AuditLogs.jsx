import { useState, useEffect } from 'react';
import { getAuditLogs } from '../api/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}