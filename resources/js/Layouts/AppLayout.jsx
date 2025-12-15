import Sidebar from '@/Components/Sidebar'
import Topbar from '@/Components/Topbar'

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
