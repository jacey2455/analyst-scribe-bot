import { Download, TrendingUp, AlertTriangle, History, BarChart3, Zap, Shield, Users } from 'lucide-react';
import type { AnalysisReport } from '@/data/mockData';

interface RightPanelProps {
  report: AnalysisReport | null;
  progressSteps: { label: string; status: 'pending' | 'active' | 'done' }[];
  isAnalyzing: boolean;
  companyName?: string;
  announcementTitle?: string;
}

export default function RightPanel({ report, progressSteps, isAnalyzing, companyName, announcementTitle }: RightPanelProps) {
  const sentimentConfig = {
    positive: { emoji: '🟢', label: '正面', className: 'sentiment-positive' },
    neutral: { emoji: '🟡', label: '中性', className: 'sentiment-neutral' },
    negative: { emoji: '🔴', label: '负面', className: 'sentiment-negative' },
  };

  const handleDownload = () => {
    if (!report) return;
    const s = sentimentConfig[report.sentiment];
    const md = `# ${companyName} · ${announcementTitle}\n\n## 行业：${report.industry}\n## 可比标的：${report.comparables.join('、')}\n\n---\n\n### 一句话事件\n${report.oneLiner}\n\n### 影响判断\n${s.emoji} ${s.label}：${report.sentimentReason}\n\n### 你需要做的\n- **持仓者**：${report.actionHolders}\n- **未持仓者**：${report.actionNonHolders}\n\n### 最需要关注的风险\n${report.keyRisk}\n\n### 历史对比\n${report.historyComparison}\n\n### 同业对比\n${report.peerComparison}\n\n### 关键数据\n${report.keyData.map((d) => `- **${d.label}**：${d.value}`).join('\n')}\n`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName}_分析报告.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Empty state
  if (!isAnalyzing && !report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">选择公告，开始分析</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            在左侧搜索公司，选择一篇公告后点击分析。AI将自动识别行业、检索历史与同业案例，生成结构化投研简报。
          </p>
        </div>
      </div>
    );
  }

  // Progress state
  if (isAnalyzing && !report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-sm">
          <h2 className="text-lg font-semibold text-foreground mb-1">正在分析</h2>
          <p className="text-sm text-muted-foreground mb-6">{companyName} · {announcementTitle}</p>
          <div className="space-y-1">
            {progressSteps.map((step, i) => (
              <div key={i} className={`progress-step ${step.status}`}>
                {step.status === 'active' && (
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                )}
                {step.status === 'done' && (
                  <div className="w-4 h-4 rounded-full bg-sentiment-positive flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-card" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {step.status === 'pending' && (
                  <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;
  const s = sentimentConfig[report.sentiment];

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="space-y-4 pb-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 animate-fade-slide-up">
          <span className="badge-industry">🏭 {report.industry}</span>
          {report.comparables.map((c) => (
            <span key={c} className="badge-comparable">对比 {c}</span>
          ))}
        </div>

        {/* Recall Panel */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            知识库召回
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5">同公司历史</p>
              <div className="flex flex-wrap gap-1.5">
                {report.recalls.filter(r => r.source === 'self').map((r, i) => (
                  <span key={i} className="badge-recall-self">{r.title} · {r.date}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5">同行业</p>
              <div className="flex flex-wrap gap-1.5">
                {report.recalls.filter(r => r.source === 'peer').map((r, i) => (
                  <span key={i} className="badge-recall-peer">{r.company} · {r.title.replace(/.*?\d{4}年/, '')}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* One-liner */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            一句话事件
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{report.oneLiner}</p>
        </div>

        {/* Sentiment */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            影响判断
          </h3>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <span className={`text-sm font-semibold ${s.className}`}>{s.label}</span>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{report.sentimentReason}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            你需要做的
          </h3>
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">持仓</span>
              <p className="text-sm text-foreground leading-relaxed">{report.actionHolders}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-medium text-accent-violet bg-accent-violet/10 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">观望</span>
              <p className="text-sm text-foreground leading-relaxed">{report.actionNonHolders}</p>
            </div>
          </div>
        </div>

        {/* Key Risk */}
        <div className="report-section animate-fade-slide-up border-sentiment-negative/20" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            最需要关注的风险
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{report.keyRisk}</p>
        </div>

        {/* History & Peer Comparison */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            历史对比
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1">① 与自身历史对比</p>
              <p className="text-sm text-foreground leading-relaxed">{report.historyComparison}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">② 与同业对比</p>
              <p className="text-sm text-foreground leading-relaxed">{report.peerComparison}</p>
            </div>
          </div>
        </div>

        {/* Key Data */}
        <div className="report-section animate-fade-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            关键数据
          </h3>
          <div className="space-y-2">
            {report.keyData.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{d.label}</span>
                <span className="text-sm font-mono font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="w-full py-2.5 rounded-lg border border-border bg-card hover:bg-secondary text-sm font-medium text-foreground flex items-center justify-center gap-2 transition-all animate-fade-slide-up"
          style={{ animationDelay: '0.45s' }}
        >
          <Download className="w-4 h-4" />
          下载分析报告 (.md)
        </button>
      </div>
    </div>
  );
}
