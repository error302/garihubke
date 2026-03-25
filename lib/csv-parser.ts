export interface CSVRow {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  description: string;
  features: string;
  images: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const REQUIRED_FIELDS = [
  'title', 'make', 'model', 'year', 'price', 'mileage',
  'fuelType', 'transmission', 'description', 'features',
  'images', 'sellerName', 'sellerPhone', 'sellerLocation'
];

const VALID_FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'];
const VALID_TRANSMISSIONS = ['manual', 'automatic'];
const MAX_ROWS = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateCSV(content: string): { valid: boolean; errors: ValidationError[]; data: CSVRow[] } {
  const lines = content.trim().split('\n');
  const errors: ValidationError[] = [];
  const data: CSVRow[] = [];

  if (lines.length < 2) {
    errors.push({ row: 0, field: 'file', message: 'CSV must have header and at least one data row' });
    return { valid: false, errors, data };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!row[field]) {
        errors.push({ row: i + 1, field, message: `${field} is required` });
      }
    }

    // Validate year
    if (row.year && (isNaN(Number(row.year)) || Number(row.year) < 1900 || Number(row.year) > 2027)) {
      errors.push({ row: i + 1, field: 'year', message: 'Year must be between 1900 and 2027' });
    }

    // Validate price
    if (row.price && (isNaN(Number(row.price)) || Number(row.price) < 50000)) {
      errors.push({ row: i + 1, field: 'price', message: 'Price must be at least 50000' });
    }

    // Validate fuelType
    if (row.fueltype && !VALID_FUEL_TYPES.includes(row.fueltype.toLowerCase())) {
      errors.push({ row: i + 1, field: 'fuelType', message: `Must be one of: ${VALID_FUEL_TYPES.join(', ')}` });
    }

    // Validate transmission
    if (row.transmission && !VALID_TRANSMISSIONS.includes(row.transmission.toLowerCase())) {
      errors.push({ row: i + 1, field: 'transmission', message: `Must be one of: ${VALID_TRANSMISSIONS.join(', ')}` });
    }

    data.push(row as CSVRow);
  }

  return { valid: errors.length === 0, errors, data };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

export { MAX_ROWS, MAX_FILE_SIZE };