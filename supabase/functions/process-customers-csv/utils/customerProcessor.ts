import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { formatDate, cleanPhone, cleanCPF } from './dataFormatters.ts';
import { createColumnMappings } from './columnMapper.ts';

export const processCustomerBatch = async (
  batch: any[],
  columnMappings: Record<string, string | undefined>,
  supabase: ReturnType<typeof createClient>,
  activeRentalCpfs: Set<string>
): Promise<{ processed: number; errors: string[] }> => {
  const processedCustomers = batch
    .map((row: any) => {
      try {
        const cpf = cleanCPF(row[columnMappings.cpf || 'cpf']);
        if (!cpf) {
          throw new Error('CPF is required');
        }

        return {
          full_name: row[columnMappings.full_name || 'full_name'] || '',
          email: row[columnMappings.email || 'email'] || `${cpf}@placeholder.com`,
          cpf,
          phone: cleanPhone(row[columnMappings.phone || 'phone']),
          address: row[columnMappings.address || 'address'] || null,
          city: row[columnMappings.city || 'city'] || null,
          state: row[columnMappings.state || 'state'] || null,
          postal_code: row[columnMappings.postal_code || 'postal_code'] || null,
          rg: row[columnMappings.rg || 'rg'] || null,
          birth_date: formatDate(row[columnMappings.birth_date || 'birth_date']),
          nationality: row[columnMappings.nationality || 'nationality'] || null,
          gender: row[columnMappings.gender || 'gender'] || null,
          mobile_phone: cleanPhone(row[columnMappings.mobile_phone || 'mobile_phone']),
          other_phone: cleanPhone(row[columnMappings.other_phone || 'other_phone']),
          license_number: row[columnMappings.license_number || 'license_number'] || null,
          license_category: row[columnMappings.license_category || 'license_category'] || null,
          license_expiry: formatDate(row[columnMappings.license_expiry || 'license_expiry']),
          registration_type: row[columnMappings.registration_type || 'registration_type'] || 'regular',
          status: activeRentalCpfs.has(cpf) ? 'active_rental' : 'active'
        };
      } catch (error) {
        console.error('Error processing customer row:', error);
        throw error;
      }
    })
    .filter(Boolean);

  if (processedCustomers.length === 0) {
    return { processed: 0, errors: ['No valid customers to process'] };
  }

  try {
    const { error } = await supabase
      .from('customers')
      .upsert(processedCustomers, {
        onConflict: 'cpf',
        ignoreDuplicates: false
      });

    if (error) throw error;
    return { processed: processedCustomers.length, errors: [] };
  } catch (error) {
    console.error('Batch error:', error);
    return { processed: 0, errors: [`Batch error: ${error.message}`] };
  }
};