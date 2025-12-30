import { Link } from '@tanstack/react-router'
import { BotMessageSquare, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <BotMessageSquare className="h-6 w-6 text-gray-800" />
            <span className="text-xl font-semibold text-gray-800">
              话术生成器
            </span>
          </Link>
          <div className="flex items-center">
            <Link
              to="/settings"
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              title="设置"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
