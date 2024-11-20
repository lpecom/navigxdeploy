export const formatDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return null;
  }
};

export const cleanPhone = (phone: string): string => {
  return phone?.replace(/[^\d]/g, '') || '';
};

export const cleanCPF = (cpf: string): string => {
  return String(cpf || '').replace(/[^\d]/g, '');
};