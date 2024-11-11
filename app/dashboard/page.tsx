import { WorldOverview } from "@/app/dashboard/components/world-overview"
import { RecentEntities } from "@/app/dashboard/components/recent-entities"
import { QuickCreate } from "@/app/dashboard/components/quick-create"
import { EntityStatistics } from "@/app/dashboard/components/entity-statistics"
import { EntityList } from "@/app/dashboard/components/entity-list"

export default function DashboardPage() {
  return (
    <main className="h-[100dvh] flex flex-col">
      <header className="flex items-center h-14 border-b px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </header>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content  */}
            <div className="col-span-12 lg:col-span-9">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7">
                  <QuickCreate />
                </div>
                <div className="col-span-12 lg:col-span-5">
                  <WorldOverview />
                </div>
              </div>
              <div className="mt-6">
                <EntityList />
              </div>
            </div>

            {/* Sidebar - 3 columns on large screens */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <RecentEntities />
              <EntityStatistics />
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
