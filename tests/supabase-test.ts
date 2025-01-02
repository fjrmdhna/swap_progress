import 'dotenv/config'
import { supabase } from '@/lib/supabase'

async function testConnection() {
  try {
    // Test basic query
    const { data, error } = await supabase
      .from('site_data')
      .select('site_id, site_name')
      .limit(1)
    
    if (error) {
      console.error('Connection Error:', error.message)
      return
    }
    
    console.log('✅ Connection successful!')
    console.log('Data:', data)
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run test
testConnection() 