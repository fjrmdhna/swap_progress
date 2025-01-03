import { fetchSiteData } from '@/app/actions/siteActions'
import { SiteDataProvider } from '@/app/context/SiteDataContext'
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
import { LoadingProvider } from './context/LoadingContext'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const initialData = await fetchSiteData()

  return (
    <SiteDataProvider initialData={initialData}>
      <LoadingProvider>
        <main className="h-screen p-1 overflow-hidden">
          <div className="h-full flex flex-col gap-1">
            <div className="h-[4vh] flex justify-between items-center px-2">
              <h1 className="text-lg font-bold text-white">Swap Progress</h1>
              <form action="/auth/signout" method="post">
                <button type="submit" className="px-2 py-0.5 text-xs btn-reset">
                  Logout
                </button>
              </form>
            </div>

            <div className="h-[96vh] flex flex-col gap-1">
              <div className="h-[15vh] grid grid-cols-[20%_80%] gap-1">
                <div className="dashboard-card compact-card p-1 flex items-center">
                  <Upload />
                </div>
                <div className="dashboard-card compact-card p-1 overflow-hidden">
                  <CardFilter />
                </div>
              </div>

              <div className="h-[42vh] grid grid-cols-2 gap-1">
                <div className="dashboard-card compact-card p-1">
                  <div className="h-full overflow-hidden">
                    <CardBarChart />
                  </div>
                </div>
                <div className="dashboard-card compact-card p-1">
                  <div className="h-full overflow-hidden">
                    <CardMatrix />
                  </div>
                </div>
              </div>

              <div className="h-[39vh] grid grid-cols-2 gap-1">
                <div className="dashboard-card compact-card p-1">
                  <div className="h-full">
                    <CardMap />
                  </div>
                </div>
                <div className="dashboard-card compact-card p-1">
                  <div className="h-full overflow-auto">
                    <SiteTable />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </LoadingProvider>
    </SiteDataProvider>
  )
}

