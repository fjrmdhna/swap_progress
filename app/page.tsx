import { fetchSiteData } from './actions/siteActions'
import { SiteDataProvider } from './context/SiteDataContext'
import { Upload } from './components/UI/Upload'
import { CardFilter } from './components/SiteData/CardFilter'
import { CardBarChart } from './components/SiteData/CardBarChart'
import { SiteTable } from './components/SiteData/SiteTable'

export default async function Home() {
  const initialData = await fetchSiteData()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Swap Progress Dashboard
      </h1>
      
      <SiteDataProvider initialData={initialData}>
        <div className="space-y-8">
          <Upload />
          <div className="bg-white p-6 rounded-lg shadow">
            <CardFilter />
          </div>
          <CardBarChart />
          <SiteTable />
        </div>
      </SiteDataProvider>
    </main>
  )
}
