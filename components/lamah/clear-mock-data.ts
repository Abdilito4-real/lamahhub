import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Clears all mock data from the database.
 * WARNING: This action is irreversible.
 */
async function clearMockData() {
  console.log('🚀 Connecting to Supabase to erase mock data...');
  
  // List of tables to clear based on your Navigation sections
  const tables = ['experiences', 'pitches', 'events', 'gallery', 'bookings'];

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', -1); // This ensures we target all records

    if (error) {
      console.error(`❌ Error clearing table "${table}":`, error.message);
    } else {
      console.log(`✅ Successfully erased all records from "${table}".`);
    }
  }
}

clearMockData()
  .then(() => {
    console.log('✨ Cleanup process finished.');
    process.exit(0);
  });