import { ApprenticeProfile, CohortLearner, EvaluationResult } from '../types/induction';
import { createCohortExcelBuffer } from '../utils/excelExporter';

export const TARGET_DRIVE_FOLDER_NAME = 'BOOT CAMP INDUCCIÓN';
export const TARGET_DRIVE_FOLDER_ALT = 'BOOT CAMP INDUCCÓN';

export interface DriveFolderInfo {
  id: string;
  name: string;
  url: string;
}

export interface FichaSyncResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  excelFileId?: string;
  excelFileUrl?: string;
  folderId?: string;
  folderName?: string;
  folderUrl?: string;
  message: string;
  timestamp: string;
}

const FICHA_CACHE_PREFIX = 'sena_ficha_sheet_';

export const getCachedFichaSheet = (ficha: string): { id: string; url: string } | null => {
  try {
    const raw = localStorage.getItem(`${FICHA_CACHE_PREFIX}${ficha}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedFichaSheet = (ficha: string, data: { id: string; url: string }) => {
  try {
    localStorage.setItem(`${FICHA_CACHE_PREFIX}${ficha}`, JSON.stringify(data));
  } catch {}
};

const FICHA_SYNC_CACHE_PREFIX = 'sena_ficha_sync_res_';

export const getCachedFichaSyncResult = (ficha: string): FichaSyncResult | null => {
  try {
    const raw = localStorage.getItem(`${FICHA_SYNC_CACHE_PREFIX}${ficha}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedFichaSyncResult = (ficha: string, result: FichaSyncResult) => {
  try {
    localStorage.setItem(`${FICHA_SYNC_CACHE_PREFIX}${ficha}`, JSON.stringify(result));
    if (result.folderId) {
      localStorage.setItem('sena_drive_folder_id', result.folderId);
    }
    if (result.folderUrl) {
      localStorage.setItem('sena_drive_folder_url', result.folderUrl);
    }
    if (result.folderName) {
      localStorage.setItem('sena_drive_folder_name', result.folderName);
    }
  } catch {}
};

/**
 * Returns a guaranteed valid URL to the BOOT CAMP INDUCCIÓN Google Drive folder.
 * Uses explicitUrl -> cached URL -> cached folder ID -> Drive search fallback.
 */
export const getEffectiveDriveFolderUrl = (explicitUrl?: string | null): string => {
  if (explicitUrl && explicitUrl.trim() !== '') {
    return explicitUrl;
  }
  try {
    const cachedUrl = localStorage.getItem('sena_drive_folder_url');
    if (cachedUrl && cachedUrl.trim() !== '') {
      return cachedUrl;
    }
    const cachedId = localStorage.getItem('sena_drive_folder_id');
    if (cachedId && cachedId.trim() !== '') {
      return `https://drive.google.com/drive/folders/${cachedId}`;
    }
  } catch {}
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(TARGET_DRIVE_FOLDER_NAME)}`;
};

/**
 * Finds or creates the target folder in Google Drive named "BOOT CAMP INDUCCIÓN"
 * (also recognizing "BOOT CAMP INDUCCÓN" and updating it to canonical spelling).
 */
export const getOrCreateDriveFolder = async (
  accessToken: string,
  preferredName: string = TARGET_DRIVE_FOLDER_NAME
): Promise<DriveFolderInfo> => {
  // Check cached folder ID
  const cachedFolderId = localStorage.getItem('sena_drive_folder_id');
  if (cachedFolderId) {
    try {
      const checkRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${cachedFolderId}?fields=id,name,webViewLink,trashed`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (checkRes.ok) {
        const folder = await checkRes.json();
        if (!folder.trashed) {
          // If the cached folder had the typo name 'BOOT CAMP INDUCCÓN', update it to 'BOOT CAMP INDUCCIÓN'
          if (folder.name === TARGET_DRIVE_FOLDER_ALT) {
            try {
              await fetch(`https://www.googleapis.com/drive/v3/files/${folder.id}`, {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: TARGET_DRIVE_FOLDER_NAME })
              });
              folder.name = TARGET_DRIVE_FOLDER_NAME;
            } catch {}
          }

          const resolvedInfo: DriveFolderInfo = {
            id: folder.id,
            name: folder.name || preferredName,
            url: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`
          };
          localStorage.setItem('sena_drive_folder_id', resolvedInfo.id);
          localStorage.setItem('sena_drive_folder_url', resolvedInfo.url);
          localStorage.setItem('sena_drive_folder_name', resolvedInfo.name);
          return resolvedInfo;
        }
      }
    } catch {}
  }

  // 1. Search existing folder by exact or alternative name
  const query = `mimeType = 'application/vnd.google-apps.folder' and (name = '${TARGET_DRIVE_FOLDER_NAME}' or name = '${TARGET_DRIVE_FOLDER_ALT}' or name = 'BOOT CAMP INDUCCION') and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,webViewLink)&orderBy=createdTime desc`;

  try {
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        const found = data.files[0];

        // Ensure name is standardized to 'BOOT CAMP INDUCCIÓN'
        if (found.name === TARGET_DRIVE_FOLDER_ALT) {
          try {
            await fetch(`https://www.googleapis.com/drive/v3/files/${found.id}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name: TARGET_DRIVE_FOLDER_NAME })
            });
            found.name = TARGET_DRIVE_FOLDER_NAME;
          } catch {}
        }

        const resolvedInfo: DriveFolderInfo = {
          id: found.id,
          name: found.name || TARGET_DRIVE_FOLDER_NAME,
          url: found.webViewLink || `https://drive.google.com/drive/folders/${found.id}`
        };
        localStorage.setItem('sena_drive_folder_id', resolvedInfo.id);
        localStorage.setItem('sena_drive_folder_url', resolvedInfo.url);
        localStorage.setItem('sena_drive_folder_name', resolvedInfo.name);
        return resolvedInfo;
      }
    }
  } catch (err) {
    console.warn('Error al buscar carpeta en Google Drive:', err);
  }

  // 2. Create the folder if it does not exist
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: TARGET_DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error al crear la carpeta '${TARGET_DRIVE_FOLDER_NAME}' en Google Drive: ${errText}`);
  }

  const newFolder = await createRes.json();
  const folderInfo: DriveFolderInfo = {
    id: newFolder.id,
    name: TARGET_DRIVE_FOLDER_NAME,
    url: newFolder.webViewLink || `https://drive.google.com/drive/folders/${newFolder.id}`
  };
  localStorage.setItem('sena_drive_folder_id', folderInfo.id);
  localStorage.setItem('sena_drive_folder_url', folderInfo.url);
  localStorage.setItem('sena_drive_folder_name', folderInfo.name);
  return folderInfo;
};

/**
 * Ensures a file in Google Drive is located in the target folder.
 */
export const moveFileToFolder = async (
  accessToken: string,
  fileId: string,
  targetFolderId: string
): Promise<void> => {
  try {
    const getRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,parents`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!getRes.ok) return;
    const fileData = await getRes.json();
    const parents: string[] = fileData.parents || [];
    if (parents.includes(targetFolderId)) {
      return; // Already in target folder
    }

    const previousParents = parents.join(',');
    const patchUrl = previousParents
      ? `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${targetFolderId}&removeParents=${previousParents}&fields=id,parents`
      : `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${targetFolderId}&fields=id,parents`;

    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!patchRes.ok) {
      // Fallback: simple addParents without removeParents
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${targetFolderId}&fields=id,parents`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    }
  } catch (err) {
    console.warn('Error al mover archivo a la carpeta de Drive:', err);
  }
};

/**
 * Saves/updates an Excel workbook (.xlsx) directly inside the specified Google Drive folder.
 * Uses a rock-solid 2-step media upload to guarantee exact binary preservation.
 */
export const saveExcelWorkbookToDrive = async (
  accessToken: string,
  folderId: string,
  ficha: string,
  learners: CohortLearner[]
): Promise<{ fileId: string; fileUrl: string }> => {
  const fileName = `Ficha ${ficha} - BOOT CAMP INDUCCIÓN.xlsx`;
  const excelBuffer = createCohortExcelBuffer(ficha, learners);
  const excelBlob = new Blob([excelBuffer.buffer as ArrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // 1. Check if an Excel file with this ficha name exists in folder or drive
  let existingFileId: string | null = null;
  let existingWebLink: string | null = null;

  try {
    const query = `'${folderId}' in parents and (name = '${fileName}' or name = 'Ficha_${ficha}_Induccion_SENA.xlsx' or name = 'Ficha ${ficha} - BOOT CAMP INDUCCÓN.xlsx') and trashed = false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,webViewLink)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        existingFileId = data.files[0].id;
        existingWebLink = data.files[0].webViewLink;
      }
    }
  } catch (err) {
    console.warn('Error buscando archivo Excel en carpeta:', err);
  }

  // If not found in folder, check if it was previously created outside the folder
  if (!existingFileId) {
    try {
      const generalQuery = `name = '${fileName}' and trashed = false`;
      const generalRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(generalQuery)}&fields=files(id,name,webViewLink,parents)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (generalRes.ok) {
        const generalData = await generalRes.json();
        if (generalData.files && generalData.files.length > 0) {
          const fileFound = generalData.files[0];
          existingFileId = fileFound.id;
          existingWebLink = fileFound.webViewLink;
          if (fileFound.id) {
            await moveFileToFolder(accessToken, fileFound.id, folderId);
          }
        }
      }
    } catch {}
  }

  if (existingFileId) {
    // Ensure file is inside the target folder
    await moveFileToFolder(accessToken, existingFileId, folderId);

    // Update existing file content directly
    const updateRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: excelBlob
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Error al actualizar archivo Excel en Google Drive: ${errText}`);
    }

    return {
      fileId: existingFileId,
      fileUrl: existingWebLink || `https://drive.google.com/file/d/${existingFileId}/view`
    };
  } else {
    // 2-Step File Creation:
    // Step 1: Create file metadata inside target folder
    const createRes = await fetch(
      'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fileName,
          parents: [folderId],
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      }
    );

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Error al registrar el archivo Excel en Google Drive: ${errText}`);
    }

    const createdData = await createRes.json();
    const newFileId = createdData.id;

    // Step 2: Upload media stream to the newly created file
    const uploadRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: excelBlob
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Error al cargar datos del archivo Excel en Google Drive: ${errText}`);
    }

    // Ensure it is properly linked inside target folder
    await moveFileToFolder(accessToken, newFileId, folderId);

    return {
      fileId: newFileId,
      fileUrl: createdData.webViewLink || `https://drive.google.com/file/d/${newFileId}/view`
    };
  }
};

/**
 * Dedicated standalone action to upload and save Excel workbook directly into the Drive folder.
 */
export const uploadFichaExcelToDrive = async (
  accessToken: string,
  ficha: string,
  learners: CohortLearner[]
): Promise<{
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  folderId?: string;
  folderUrl?: string;
  folderName?: string;
  message: string;
}> => {
  try {
    const folder = await getOrCreateDriveFolder(accessToken);
    const result = await saveExcelWorkbookToDrive(accessToken, folder.id, ficha, learners);
    return {
      success: true,
      fileId: result.fileId,
      fileUrl: result.fileUrl,
      folderId: folder.id,
      folderUrl: folder.url,
      folderName: folder.name,
      message: `Archivo Excel (.xlsx) guardado exitosamente en la carpeta '${folder.name}'.`
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error al guardar el archivo Excel en Google Drive.'
    };
  }
};

/**
 * Searches for a spreadsheet named "Ficha [numero] - Inducción SENA".
 * If it doesn't exist, creates it with 3 tabs and formatted headers.
 */
export const findOrCreateFichaSpreadsheet = async (
  accessToken: string,
  ficha: string,
  folderId?: string
): Promise<{ id: string; url: string; isNew: boolean }> => {
  const targetTitle = `Ficha ${ficha} - BOOT CAMP INDUCCIÓN`;
  const legacyTitle = `Ficha ${ficha} - Inducción SENA`;

  // 1. Search in Google Drive
  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `(name = '${targetTitle}' or name = '${legacyTitle}') and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    )}&fields=files(id,name,webViewLink,parents)`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const found = searchData.files[0];
        const result = {
          id: found.id,
          url: found.webViewLink || `https://docs.google.com/spreadsheets/d/${found.id}/edit`,
          isNew: false
        };
        setCachedFichaSheet(ficha, result);

        if (folderId) {
          await moveFileToFolder(accessToken, found.id, folderId);
        }

        return result;
      }
    }
  } catch (err) {
    console.warn('Error al buscar hoja en Drive, intentando crear...', err);
  }

  // 2. Create new spreadsheet with 3 required tabs
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: targetTitle
      },
      sheets: [
        { properties: { title: 'Caracterización', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Progreso Módulos', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Evaluación', gridProperties: { frozenRowCount: 1 } } }
      ]
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error al crear la hoja de cálculo en Drive: ${errText}`);
  }

  const newSheet = await createRes.json();
  const spreadsheetId = newSheet.spreadsheetId;
  const spreadsheetUrl =
    newSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Move spreadsheet into target folder
  if (folderId) {
    await moveFileToFolder(accessToken, spreadsheetId, folderId);
  }

  // 3. Populate Header rows in all 3 tabs
  const headersPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Caracterización!A1:L1',
        values: [
          [
            'Documento',
            'Tipo Doc',
            'Nombre Completo',
            'Correo Institucional',
            'Teléfono',
            'Ciudad',
            'Dirección',
            'Género',
            'Tipo de Población',
            'Ficha',
            'Programa de Formación',
            'Fecha de Registro'
          ]
        ]
      },
      {
        range: 'Progreso Módulos!A1:I1',
        values: [
          [
            'Documento',
            'Nombre Completo',
            'Ficha',
            'Módulos Completados',
            'Porcentaje de Avance (%)',
            'Estado Inducción',
            'Pacto Convivencia 2026',
            'Fecha Firma Pacto',
            'Última Actividad'
          ]
        ]
      },
      {
        range: 'Evaluación!A1:I1',
        values: [
          [
            'Documento',
            'Nombre Completo',
            'Ficha',
            'Calificación (%)',
            'Resultado',
            'Preguntas Correctas',
            'Total Preguntas',
            'Código de Constancia',
            'Fecha de Evaluación'
          ]
        ]
      }
    ]
  };

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(headersPayload)
    }
  );

  const result = { id: spreadsheetId, url: spreadsheetUrl, isNew: true };
  setCachedFichaSheet(ficha, result);
  return result;
};

/**
 * Upsert rows in a target sheet by Document Number (column A).
 */
const upsertSheetRows = async (
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  rows: (string | number)[][]
) => {
  if (rows.length === 0) return;

  // Read existing Document Numbers in Column A
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    sheetName
  )}!A:A`;
  const readRes = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const existingDocs: string[] = [];
  if (readRes.ok) {
    const valData = await readRes.json();
    if (valData.values) {
      valData.values.forEach((row: any[]) => {
        existingDocs.push(row[0] ? String(row[0]).trim() : '');
      });
    }
  }

  const updates: { range: string; values: any[][] }[] = [];
  const toAppend: any[][] = [];

  for (const row of rows) {
    const docNum = String(row[0]).trim();
    const existingIndex = existingDocs.findIndex((d, idx) => idx > 0 && d === docNum);

    if (existingIndex !== -1) {
      // Row exists (1-indexed, existingIndex + 1)
      const rowNumber = existingIndex + 1;
      const endColLetter = String.fromCharCode(65 + row.length - 1);
      updates.push({
        range: `${sheetName}!A${rowNumber}:${endColLetter}${rowNumber}`,
        values: [row]
      });
    } else {
      toAppend.push(row);
      existingDocs.push(docNum);
    }
  }

  // Execute batch updates for existing rows
  if (updates.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: updates
        })
      }
    );
  }

  // Execute append for new rows
  if (toAppend.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        sheetName
      )}!A:A:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: toAppend
        })
      }
    );
  }
};

/**
 * Synchronizes an entire cohort of learners + the active apprentice's data.
 * Automatically saves both the Google Sheets spreadsheet and the native Excel (.xlsx) file
 * directly inside the Google Drive folder "BOOT CAMP INDUCCÓN".
 */
export const syncCohortToDrive = async (
  accessToken: string,
  ficha: string,
  cohortLearners: CohortLearner[],
  activeApprentice?: ApprenticeProfile | null,
  activeEvaluation?: EvaluationResult | null
): Promise<FichaSyncResult> => {
  const timestamp = new Date().toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'medium'
  });

  try {
    // 1. Locate or create folder 'BOOT CAMP INDUCCÓN'
    const folder = await getOrCreateDriveFolder(accessToken);

    // 2. Locate or create Google Sheets spreadsheet inside the folder
    const { id: spreadsheetId, url: spreadsheetUrl } = await findOrCreateFichaSpreadsheet(
      accessToken,
      ficha,
      folder.id
    );

    // Merge active apprentice if belongs to this ficha
    const combinedLearnersMap = new Map<string, any>();

    cohortLearners.forEach((l) => {
      combinedLearnersMap.set(l.documentNumber, { ...l });
    });

    if (activeApprentice && activeApprentice.ficha === ficha) {
      const existing = combinedLearnersMap.get(activeApprentice.documentNumber) || {};
      combinedLearnersMap.set(activeApprentice.documentNumber, {
        ...existing,
        ...activeApprentice,
        progressPercentage: Math.round((activeApprentice.completedModules.length / 5) * 100),
        completedModulesCount: activeApprentice.completedModules.length
      });
    }

    const allLearners: CohortLearner[] = Array.from(combinedLearnersMap.values());

    // 3. Prepare Caracterización Rows
    const caracterizacionRows = allLearners.map((l) => [
      l.documentNumber || '',
      l.documentType || 'CC',
      l.fullName || '',
      l.email || '',
      l.phone || 'No registrado',
      l.city || 'No registrada',
      l.address || 'No registrada',
      l.gender || 'No especificado',
      l.populationType || 'General',
      l.ficha || ficha,
      l.programName || 'Análisis y Desarrollo de Software (ADSO)',
      timestamp
    ]);

    // 4. Prepare Progreso Módulos Rows
    const progresoRows = allLearners.map((l) => {
      const completedCount =
        l.completedModulesCount ??
        (l.progressPercentage === 100 ? 5 : Math.round((l.progressPercentage / 100) * 5));
      const pct = l.progressPercentage ?? Math.round((completedCount / 5) * 100);
      return [
        l.documentNumber || '',
        l.fullName || '',
        l.ficha || ficha,
        `${completedCount}/5`,
        `${pct}%`,
        l.status === 'aprobado'
          ? 'Aprobado'
          : l.status === 'requiere_refuerzo'
          ? 'Requiere Refuerzo'
          : 'En Inducción',
        l.hasSignedPact2026 ? 'Sí, Firmado' : 'Pendiente',
        l.pactSignedAt || (l.hasSignedPact2026 ? 'Firmado en sesión' : 'Sin firmar'),
        timestamp
      ];
    });

    // 5. Prepare Evaluación Rows
    const evaluacionRows: any[][] = [];
    allLearners.forEach((l) => {
      const hasActiveEval =
        activeEvaluation &&
        activeApprentice &&
        l.documentNumber === activeApprentice.documentNumber;

      const score = hasActiveEval ? activeEvaluation.score : l.evaluationScore;
      const completedDate = hasActiveEval
        ? activeEvaluation.completedAt
        : l.evaluationDate;
      const certCode = hasActiveEval
        ? activeEvaluation.certificateCode || `SENA-IND-${ficha}-${l.documentNumber.slice(-4)}`
        : l.status === 'aprobado'
        ? `SENA-IND-${ficha}-${l.documentNumber.slice(-4)}`
        : 'N/A';

      if (score !== undefined) {
        evaluacionRows.push([
          l.documentNumber || '',
          l.fullName || '',
          l.ficha || ficha,
          `${score}%`,
          score >= 80 ? 'Aprobado' : 'Requiere Refuerzo',
          hasActiveEval ? activeEvaluation.correctAnswersCount : Math.round((score / 100) * 10),
          hasActiveEval ? activeEvaluation.totalQuestions : 10,
          certCode,
          completedDate || timestamp
        ]);
      }
    });

    // 6. Execute upsert into all 3 sheets of Google Sheets
    await upsertSheetRows(accessToken, spreadsheetId, 'Caracterización', caracterizacionRows);
    await upsertSheetRows(accessToken, spreadsheetId, 'Progreso Módulos', progresoRows);
    if (evaluacionRows.length > 0) {
      await upsertSheetRows(accessToken, spreadsheetId, 'Evaluación', evaluacionRows);
    }

    // 7. Save/update the native Excel (.xlsx) file in folder "BOOT CAMP INDUCCÓN"
    let excelFileId: string | undefined;
    let excelFileUrl: string | undefined;

    try {
      const excelRes = await saveExcelWorkbookToDrive(accessToken, folder.id, ficha, allLearners);
      excelFileId = excelRes.fileId;
      excelFileUrl = excelRes.fileUrl;
    } catch (excelErr) {
      console.warn('Advertencia al guardar archivo Excel .xlsx en carpeta de Drive:', excelErr);
    }

    const finalResult: FichaSyncResult = {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      excelFileId,
      excelFileUrl,
      folderId: folder.id,
      folderName: folder.name,
      folderUrl: folder.url,
      message: `Archivos de la Ficha ${ficha} guardados en Drive carpeta '${folder.name}' (${allLearners.length} aprendices organizados).`,
      timestamp
    };

    setCachedFichaSyncResult(ficha, finalResult);

    return finalResult;
  } catch (error: any) {
    console.error('Error al sincronizar con Google Drive:', error);
    return {
      success: false,
      message: error.message || 'Error al conectar con Google Drive',
      timestamp
    };
  }
};
