import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Cloud,
  LogOut,
  Folder,
  FolderCheck,
  FileCheck
} from 'lucide-react';
import { googleSignIn, googleLogout } from '../services/googleAuth';
import { FichaSyncResult, TARGET_DRIVE_FOLDER_NAME, getEffectiveDriveFolderUrl } from '../services/googleSheetsSync';
import { User as FirebaseUser } from 'firebase/auth';

interface GoogleDriveSyncCardProps {
  currentFicha: string;
  googleUser: FirebaseUser | null;
  googleToken: string | null;
  onAuthChange: (user: FirebaseUser | null, token: string | null) => void;
  onManualSync: () => Promise<FichaSyncResult>;
  lastSyncResult: FichaSyncResult | null;
  isAutoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  onOpenExcelViewer?: () => void;
}

export const GoogleDriveSyncCard: React.FC<GoogleDriveSyncCardProps> = ({
  currentFicha,
  googleUser,
  googleToken,
  onAuthChange,
  onManualSync,
  lastSyncResult,
  isAutoSyncEnabled,
  onToggleAutoSync,
  onOpenExcelViewer
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onAuthChange(result.user, result.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'No se pudo completar la autenticación con la cuenta de Google.'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await googleLogout();
      onAuthChange(null, null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncClick = async () => {
    if (!googleToken) {
      await handleConnect();
      return;
    }
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const result = await onManualSync();
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante la sincronización');
    } finally {
      setIsSyncing(false);
    }
  };

  const folderName = lastSyncResult?.folderName || TARGET_DRIVE_FOLDER_NAME;
  const folderUrl = getEffectiveDriveFolderUrl(
    lastSyncResult?.folderUrl ||
    (lastSyncResult?.folderId
      ? `https://drive.google.com/drive/folders/${lastSyncResult.folderId}`
      : undefined)
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Information Block */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900]">
            <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
              <Cloud className="w-3.5 h-3.5" />
              Sincronización Google Workspace
            </span>
            <a
              href={folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200/70 dark:border-amber-800/60 font-bold transition-all cursor-pointer group shadow-2xs"
              title="Abrir la carpeta BOOT CAMP INDUCCIÓN en Google Drive"
            >
              <Folder className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Carpeta Drive: {folderName}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Ficha {currentFicha}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Ficha {currentFicha} - Guardado automático en Drive</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              .xlsx + Google Sheets
            </span>
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Los datos de los aprendices (Caracterización, Progreso Módulos y Evaluación) se guardan automáticamente como archivos Excel organizados en filas y columnas dentro de la carpeta institucional <strong className="text-slate-800 dark:text-slate-200 font-semibold">{folderName}</strong> de Google Drive.
          </p>

          {/* Sync status info */}
          {lastSyncResult && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              {lastSyncResult.success ? (
                <>
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>Sincronizado: {lastSyncResult.timestamp}</span>
                  </span>
                  {lastSyncResult.excelFileId && (
                    <span className="text-teal-700 dark:text-teal-300 flex items-center gap-1 font-medium bg-teal-50 dark:bg-teal-950/40 px-2 py-1 rounded-md border border-teal-200/50 dark:border-teal-800/50">
                      <FileCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Excel (.xlsx) actualizado en Drive</span>
                    </span>
                  )}
                </>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-md border border-rose-200/50 dark:border-rose-800/50">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Error: {lastSyncResult.message}</span>
                </span>
              )}
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200/50 dark:border-rose-800/50">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Right Actions Block */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenExcelViewer && (
            <button
              type="button"
              onClick={onOpenExcelViewer}
              className="px-3.5 py-2 bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Visualizar la hoja de cálculo interactiva con pestañas de Caracterización, Módulos y Evaluación"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Visualizar Excel</span>
            </button>
          )}

          {!googleUser ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isConnecting ? 'Conectando...' : 'Conectar con Google Drive'}</span>
              </button>

              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="Abrir la carpeta BOOT CAMP INDUCCIÓN en Google Drive"
              >
                <FolderCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Carpeta Drive</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Connected Google Email badge */}
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
                <span className="truncate max-w-[170px] font-medium" title={googleUser.email || ''}>
                  {googleUser.email}
                </span>
                <button
                  onClick={handleDisconnect}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                  title="Desconectar cuenta"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>

              {/* Open Folder in Drive Button */}
              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                title="Abrir la carpeta BOOT CAMP INDUCCIÓN en Google Drive"
              >
                <FolderCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Carpeta Drive</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {/* Open Direct Excel (.xlsx) File in Drive */}
              {lastSyncResult?.excelFileUrl && (
                <a
                  href={lastSyncResult.excelFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-900 dark:text-teal-200 text-xs font-bold rounded-xl border border-teal-300 dark:border-teal-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  title="Abrir el archivo Excel (.xlsx) guardado en Google Drive"
                >
                  <FileCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Ver Excel en Drive</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {/* Open in Google Sheets Link */}
              {lastSyncResult?.spreadsheetUrl && (
                <a
                  href={lastSyncResult.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Abrir hoja de cálculo de Google en Google Drive"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Abrir Sheets</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {/* Manual Synchronize Button */}
              <button
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="px-3.5 py-2 bg-[#39A900] hover:bg-[#2d7a04] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Guardando en Drive...' : 'Guardar en BOOT CAMP INDUCCIÓN'}</span>
              </button>

              {/* Auto sync toggle */}
              <label
                className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer px-2 py-1 select-none"
                title="Sincronización y guardado automático al responder o avanzar en la inducción"
              >
                <input
                  type="checkbox"
                  checked={isAutoSyncEnabled}
                  onChange={(e) => onToggleAutoSync(e.target.checked)}
                  className="rounded border-slate-300 text-[#39A900] focus:ring-[#39A900] w-3.5 h-3.5"
                />
                <span className="font-medium">Auto-guardar</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
