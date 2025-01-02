import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/lib/supabase'

const prisma = new PrismaClient()

// Add type definition
type SiteData = {
  site_id: string;
  site_name: string;
  mc_cluster: string;
  province: string;
  dati_ii: string;
  scope_category: string;
  scope_of_work: string;
  ran_scope: string;
  latitude: number | null;
  longitude: number | null;
  nano_cluster: string;
  survey_ff: Date | null;
  survey_af: Date | null;
  mos_ff: Date | null;
  mos_bf: Date | null;
  mos_af: Date | null;
  cutover_ff: Date | null;
  cutover_bf: Date | null;
  cutover_af: Date | null;
  site_dismantle_ff: Date | null;
  site_dismantle_bf: Date | null;
  site_dismantle_af: Date | null;
}

async function migrateSiteData() {
  try {
    console.log('🚀 Starting migration...')

    // Get data from PostgreSQL with raw query to handle NaN values
    const sites = await prisma.$queryRaw<SiteData[]>`
      SELECT 
        site_id,
        site_name,
        mc_cluster,
        province,
        dati_ii,
        scope_category,
        scope_of_work,
        ran_scope,
        CASE 
          WHEN latitude IS NULL OR latitude::text = 'NaN' THEN NULL 
          ELSE latitude::float 
        END as latitude,
        CASE 
          WHEN longitude IS NULL OR longitude::text = 'NaN' THEN NULL 
          ELSE longitude::float 
        END as longitude,
        nano_cluster,
        survey_ff,
        survey_af,
        mos_ff,
        mos_bf,
        mos_af,
        cutover_ff,
        cutover_bf,
        cutover_af,
        site_dismantle_ff,
        site_dismantle_bf,
        site_dismantle_af
      FROM "Site"
    `

    console.log(`📊 Found ${sites.length} records to migrate`)

    // Batch size for insertion
    const batchSize = 100
    for (let i = 0; i < sites.length; i += batchSize) {
      const batch = sites.slice(i, i + batchSize)
      
      // Transform data and handle null values
      const transformedData = batch.map(site => ({
        site_id: site.site_id || null,
        site_name: site.site_name || null,
        mc_cluster: site.mc_cluster || null,
        province: site.province || null,
        dati_ii: site.dati_ii || null,
        scope_category: site.scope_category || null,
        scope_of_work: site.scope_of_work || null,
        ran_scope: site.ran_scope || null,
        latitude: site.latitude,
        longitude: site.longitude,
        nano_cluster: site.nano_cluster || null,
        survey_ff: site.survey_ff || null,
        survey_af: site.survey_af || null,
        mos_ff: site.mos_ff || null,
        mos_bf: site.mos_bf || null,
        mos_af: site.mos_af || null,
        cutover_ff: site.cutover_ff || null,
        cutover_bf: site.cutover_bf || null,
        cutover_af: site.cutover_af || null,
        site_dismantle_ff: site.site_dismantle_ff || null,
        site_dismantle_bf: site.site_dismantle_bf || null,
        site_dismantle_af: site.site_dismantle_af || null
      }))

      // Insert to Supabase
      const { error } = await supabase
        .from('site_data')
        .insert(transformedData)

      if (error) {
        console.error('Error inserting batch:', error)
        continue
      }

      console.log(`✅ Migrated records ${i + 1} to ${i + batch.length}`)
    }

    console.log('✨ Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateSiteData() 