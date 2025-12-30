import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

// Helper functions to interact with localStorage
const getSettingsFromStorage = () => {
  if (typeof window === 'undefined') return {}
  const settings = localStorage.getItem('app-settings')
  return settings ? JSON.parse(settings) : {}
}

const saveSettingsToStorage = (settings: object) => {
  localStorage.setItem('app-settings', JSON.stringify(settings))
}

function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
    const { apiUrl = '', apiToken = '', systemPrompt = '' } =
      getSettingsFromStorage()
    setApiUrl(apiUrl)
    setApiToken(apiToken)
    setSystemPrompt(systemPrompt)
  }, [])

  const showNotification = (
    message: string,
    type: 'success' | 'error',
    duration = 3000,
  ) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  const handleSave = () => {
    saveSettingsToStorage({ apiUrl, apiToken, systemPrompt })
    showNotification('设置已成功保存！', 'success')
  }

  const handleTestConnection = async () => {
    if (!apiUrl || !apiToken) {
      showNotification('请先填写 API URL 和 API Token。', 'error')
      return
    }

    // This is a generic test. It assumes an OpenAI-compatible API.
    // It sends a minimal payload to check for a successful (200) or auth-related (401, 403) response.
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          model: 'test', // A dummy model name
          messages: [],  // No actual prompt
          max_tokens: 1,
        }),
      })

      if (response.ok || [401, 403, 404, 400].includes(response.status)) {
        // OK, Unauthorized, Forbidden, Not Found, or Bad Request are all acceptable responses for a test
        // as they indicate the server is reachable and responding to the API format.
        showNotification('连接成功！API 端点可访问。', 'success')
      } else {
        throw new Error(`服务器返回状态: ${response.status}`)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      showNotification(
        `连接失败。请检查 URL、Token 和网络连接。`,
        'error',
      )
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {notification && (
          <div
            className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            应用设置
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            配置应用的 AI 后端和全局参数。
          </p>
        </header>

        <main className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>API 配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full gap-2">
                <Label htmlFor="api-url">API URL</Label>
                <Input
                  id="api-url"
                  type="url"
                  placeholder="https://api.example.com/v1/chat/completions"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="api-token">API Token</Label>
                <Input
                  id="api-token"
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>全局提示词</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-2">
                <Label htmlFor="system-prompt">系统提示词 (System Prompt)</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="你是一个专业的话术生成助手..."
                  className="min-h-[120px]"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleTestConnection}>
              测试连接
            </Button>
            <Button onClick={handleSave}>保存设置</Button>
          </div>
        </main>
      </div>
    </div>
  )
}
