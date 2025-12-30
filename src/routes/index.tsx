import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

// The core combinatorial logic
function combineNodes(nodeVariations: string[][]): string[] {
  if (!nodeVariations || nodeVariations.length === 0) {
    return []
  }

  return nodeVariations.reduce(
    (acc, currentVariations) => {
      if (currentVariations.length === 0) return acc
      if (acc.length === 0) return currentVariations.map((v) => v) // Initialize with first node's variations

      const newCombinations: string[] = []
      acc.forEach((accVariation) => {
        currentVariations.forEach((currentVariation) => {
          newCombinations.push(`${accVariation}\n${currentVariation}`)
        })
      })
      return newCombinations
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

    // --- AI Generation Simulation ---
    // In a real app, this section would make API calls for each node.
    // Here, we simulate the delay and the results.
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    const rewrittenNodes: string[][] = nodes.map((node) => {
      const variations: string[] = []
      for (let i = 1; i <= generationCount; i++) {
        variations.push(`(${rewritePrompt}) -> "${node}" 的模拟改写 #${i}`)
      }
      return variations
    })
    // --- End Simulation ---

    const finalCombinations = combineNodes(rewrittenNodes)
    setResults(finalCombinations)
    setIsLoading(false)
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            智能话术生成引擎
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            通过 AI 批量改写和组合，快速生成多样化、高质量的营销话术。
          </p>
        </header>

        <main className="space-y-8">
          {/* Step 1: Input */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                  1
                </span>
                输入参考话术和改写要求
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full gap-2">
                <Label htmlFor="reference-text">
                  参考话术 (每行一条，代表一个节点)
                </Label>
                <Textarea
                  placeholder="例如：
你好，我是[你的名字]。
我们最近有一个很棒的活动。
感兴趣可以点击下面的链接了解详情。"
                  id="reference-text"
                  className="min-h-[150px] font-mono text-sm"
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                />
              </div>
              <div className="grid w-full gap-2">
                <Label htmlFor="rewrite-prompt">AI 改写要求</Label>
                <Textarea
                  placeholder="例如：请用更热情、更口语化的方式改写，突出活动的吸引力。"
                  id="rewrite-prompt"
                  className="min-h-[80px]"
                  value={rewritePrompt}
                  onChange={(e) => setRewritePrompt(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Generate */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                  2
                </span>
                设置并生成
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <div className="grid w-full sm:w-1/3 gap-2">
                <Label htmlFor="generation-count">生成数量 (每个节点)</Label>
                <Input
                  id="generation-count"
                  type="number"
                  placeholder="例如: 3"
                  value={generationCount}
                  onChange={(e) =>
                    setGenerationCount(Math.max(1, parseInt(e.target.value, 10)))
                  }
                />
              </div>
              <div className="flex-1 w-full sm:w-auto mt-4 sm:mt-0">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? '正在生成中...' : '开始智能生成'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Results */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    3
                  </span>
                  生成结果
                </div>
                {results.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    共生成 {results.length} 条话术
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-md min-h-[200px] border max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">AI 正在努力创作中...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-md border shadow-sm"
                      >
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {result}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      生成的话术组合将显示在这里...
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-right">
                <Button
                  variant="outline"
                  disabled={isLoading || results.length === 0}
                >
                  导出为 Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
