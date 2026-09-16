import { useState, useEffect } from 'react';
import axiosClient, { AUDIT_URL } from '../api/axiosClient';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axiosClient.get(AUDIT_URL);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Cargando auditoría...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Logs de Auditoría Centralizada</h2>
      <div className="bg-white shadow border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b text-slate-700 uppercase text-xs">
              <th className="p-4">Servicio Origen</th>
              <th className="p-4">Tipo Evento</th>
              <th className="p-4">ID Entidad</th>
              <th className="p-4">Payload</th>
              <th className="p-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-slate-50">
                <td className="p-4 text-sm font-semibold text-indigo-600">{log.sourceService}</td>
                <td className="p-4 text-sm font-mono">{log.eventType}</td>
                <td className="p-4 text-xs font-mono text-gray-600">{log.entityId || 'N/A'}</td>
                <td className="p-4 text-xs font-mono max-w-xs truncate text-gray-500" title={log.payload}>
                  {log.payload}
                </td>
                <td className="p-4 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}