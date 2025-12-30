import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { PanelLeft, Bot, Sparkles, FileDown } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

// The core combinatorial logic
function combineNodes(nodeVariations: string[][]): string[] {
  if (!nodeVariations || nodeVariations.length === 0) return []
  return nodeVariations.reduce(
    (acc, currentVariations) => {
      if (currentVariations.length === 0) return acc
      if (acc.length === 0) return currentVariations
      return acc.flatMap((accVariation) =>
        currentVariations.map(
          (currentVariation) => `${accVariation}\n${currentVariation}`,
        ),
      )
    },
    [] as string[],
  )
}

function App() {
  const [referenceText, setReferenceText] = useState(
    '你好，我是小王。\n我们最近有一个很棒的活动。\n感兴趣可以点击链接了解。',
  )
  const [rewritePrompt, setRewritePrompt] = useState(
    '请用更热情、更口语化的方式改写',
  )
  const [generationCount, setGenerationCount] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const handleGenerate = async () => {
    setIsLoading(true)
    setResults([])
    const nodes = referenceText.split('\n').filter((line) => line.trim() !== '')
    if (nodes.length === 0) {
      setIsLoading(false)
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const rewrittenNodes: string[][] = nodes.map((node) =>
      Array.from(
        { length: generationCount },
        (_, i) => `(${rewritePrompt}) -> "${node}" 的模拟改写 #${i + 1}`,
      ),
    )
    const finalCombinations = combineNodes(rewrittenNodes)
    setResults(finalCombinations)
    setIsLoading(false)
  }

  const handleExport = () => {
    if (results.length === 0) return
    const dataToExport = results.map((result, index) => ({
      ID: index + 1,
      话术: result,
    }))
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    worksheet['!cols'] = [{ wch: 5 }, { wch: 80 }]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '生成的话术')
    XLSX.writeFile(workbook, '话术生成结果.xlsx')
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Column: Controls */}
        <div className="flex flex-col p-4">
          <Card className="shadow-lg flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <PanelLeft className="h-6 w-6" />
                <span className="text-xl">控制面板</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-6">
              <div className="grid w-full gap-2 flex-grow">
                <Label htmlFor="reference-text" className="font-semibold">
                  参考话术 (每行一条)
                </Label>
                <Textarea
                  placeholder="在此输入你的参考话术..."
                  id="reference-text"
                  className="flex-grow text-base font-mono bg-slate-100"
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="rewrite-prompt" className="font-semibold">
                  AI 改写要求
                </Label>
                <Textarea
                  placeholder="例如：请用更热情、更口语化的方式改写..."
                  id="rewrite-prompt"
                  className="min-h-[60px] text-base bg-slate-100"
                  value={rewritePrompt}
                  onChange={(e) => setRewritePrompt(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="grid w-full sm:w-auto gap-2">
                  <Label htmlFor="generation-count" className="font-semibold">
                    生成数量
                  </Label>
                  <Input
                    id="generation-count"
                    type="number"
                    placeholder="例如: 3"
                    className="bg-slate-100 w-full sm:w-32"
                    value={generationCount}
                    onChange={(e) =>
                      setGenerationCount(Math.max(1, parseInt(e.target.value, 10)))
                    }
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-bold"
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? '正在生成...' : '开始智能生成'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col p-4">
          <Card className="shadow-lg flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6" />
                  <span className="text-xl">生成结果</span>
                </div>
                {results.length > 0 && (
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    共 {results.length} 条
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
              <div className="bg-slate-100 rounded-lg flex-grow border flex items-center justify-center relative">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                    <span>AI 正在努力创作中...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="absolute inset-0 p-4 overflow-y-auto space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm"
                      >
                        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                          {result}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <p>生成的话术组合将显示在这里</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base"
                disabled={isLoading || results.length === 0}
                onClick={handleExport}
              >
                <FileDown className="mr-2 h-4 w-4" />
                导出为 Excel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}