import { fetchSiteData } from './actions/siteActions'
import { SiteDataProvider } from './context/SiteDataContext'
import { Upload } from './components/UI/Upload'
import { CardFilter } from './components/SiteData/CardFilter'
import { CardBarChart } from './components/SiteData/CardBarChart'
import { SiteTable } from './components/SiteData/SiteTable'
import { CardMatrix } from './components/SiteData/CardMatrix'

export default async function Home() {
  const initialData = await fetchSiteData()

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-xl font-bold text-center mb-4">
        Swap Progress Dashboard
      </h1>
      
      <SiteDataProvider initialData={initialData}>
        <div className="space-y-4">
          <Upload />
          <div className="bg-white p-4 rounded-lg shadow">
            <CardFilter />
          </div>
          <CardBarChart />
          <CardMatrix />
          <SiteTable />
        </div>
      </SiteDataProvider>
    </main>
  )
}
