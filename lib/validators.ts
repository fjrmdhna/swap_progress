import * as XLSX from 'xlsx'

export interface ExcelValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any[];
}

export function validateExcelData(worksheet: any): ExcelValidationResult {
  try {
    // Ambil data mentah termasuk baris header
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      raw: false,
      blankrows: false
    });

    // Ambil data mulai dari baris ke-3, gunakan header dari baris ke-2
    const rows = XLSX.utils.sheet_to_json(worksheet, { 
      header: rawData[1] as string[],
      range: 2,
      raw: false,
      defval: '',
      blankrows: false
    });
    
    // Validasi data rows
    const errors: string[] = [];
    rows.forEach((row: any, index: number) => {
      // Konversi nilai undefined/null menjadi string kosong
      const site_id = (row.site_id ?? '').toString().trim();
      const site_name = (row.site_name ?? '').toString().trim();
      
      // Hanya validasi jika ada minimal salah satu nilai
      if (site_id || site_name) {
        if (!site_id) {
          errors.push(`Baris ${index + 3}: site_id tidak boleh kosong`);
        }
        if (!site_name) {
          errors.push(`Baris ${index + 3}: site_name tidak boleh kosong`);
        }
      }
    });

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Konversi semua nilai null/undefined menjadi string kosong
    const cleanedData = rows.map(row => {
      const cleanRow = { ...(row as object) } as Record<string, any>;
      Object.keys(cleanRow).forEach(key => {
        cleanRow[key] = cleanRow[key] ?? '';
      });
      return cleanRow;
    });

    return {
      isValid: true,
      errors: [],
      data: cleanedData
    };

  } catch (error) {
    console.error('Validation error:', error)
    return {
      isValid: false,
      errors: ['Terjadi kesalahan saat memvalidasi file']
    }
  }
} 