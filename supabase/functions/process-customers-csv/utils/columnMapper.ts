import { fieldMappings } from './fieldMappings.ts';

export const findColumnName = (field: string, headers: string[]): string | undefined => {
  const variations = fieldMappings[field];
  if (!variations) return undefined;
  return headers.find(header => variations.includes(header.toLowerCase().trim()));
};

export const createColumnMappings = (headers: string[]): Record<string, string | undefined> => {
  return Object.keys(fieldMappings).reduce((acc, field) => {
    acc[field] = findColumnName(field, headers);
    return acc;
  }, {} as Record<string, string | undefined>);
};