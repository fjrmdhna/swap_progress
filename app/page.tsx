import { fetchSiteData } from './actions/siteActions'
import { SiteDataProvider } from './context/SiteDataContext'
import { Upload } from './components/UI/Upload'
import { CardFilter } from './components/SiteData/CardFilter'
import { CardBarChart } from './components/SiteData/CardBarChart'
import { SiteTable } from './components/SiteData/SiteTable'
import { CardMatrix } from './components/SiteData/CardMatrix'
import { CardMap } from '@/app/components/SiteData/CardMap'
import { 
  Upload as UploadIcon, 
  Filter, 
  BarChart3, 
  Grid, 
  Table, 
  Map,
  ArrowUpFromLine
} from 'lucide-react'

export default async function Home() {
  const initialData = await fetchSiteData()

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="dashboard-title text-3xl md:text-4xl lg:text-5xl">
          <ArrowUpFromLine className="inline-block" size={32} />
          Swap Progress Dashboard
        </h1>
        
        <SiteDataProvider initialData={initialData}>
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="dashboard-card">
              <h2 className="section-title text-lg md:text-xl">
                <UploadIcon className="inline-block mr-2 mb-1" size={24} />
                Upload Data
              </h2>
              <Upload />
            </div>
            
            <div className="dashboard-card overflow-x-auto">
              <h2 className="section-title text-lg md:text-xl">
                <Filter className="inline-block mr-2 mb-1" size={24} />
                Filter Options
              </h2>
              <CardFilter />
            </div>
            
            <div className="dashboard-card">
              <h2 className="section-title text-lg md:text-xl">
                <BarChart3 className="inline-block mr-2 mb-1" size={24} />
                Progress Chart
              </h2>
              <div className="overflow-x-auto">
                <CardBarChart />
              </div>
            </div>
            
            <div className="dashboard-card">
              <h2 className="section-title text-lg md:text-xl">
                <Grid className="inline-block mr-2 mb-1" size={24} />
                Matrix View
              </h2>
              <div className="overflow-x-auto">
                <CardMatrix />
              </div>
            </div>
            
            <div className="dashboard-card">
              <h2 className="section-title text-lg md:text-xl">
                <Table className="inline-block mr-2 mb-1" size={24} />
                Site Data
              </h2>
              <div className="overflow-x-auto">
                <SiteTable />
              </div>
            </div>
            
            <div className="dashboard-card">
              <h2 className="section-title text-lg md:text-xl">
                <Map className="inline-block mr-2 mb-1" size={24} />
                Geographic Overview
              </h2>
              <CardMap />
            </div>
          </div>
        </SiteDataProvider>
      </div>
    </main>
  )
}

