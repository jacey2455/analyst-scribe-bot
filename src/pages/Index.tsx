import { useState, useCallback } from 'react';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import { Company, Announcement, AnalysisReport } from '@/data/mockData';

const PROGRESS_LABELS = [
  '读取公告全文...',
  'AI识别行业及可比标的...',
  '构建知识库：抓取历史公告...',
  '构建知识库：抓取同行业公告...',
  '检索历史相似案例...',
  'AI生成分析报告...',
];

type StepStatus = 'pending' | 'active' | 'done';

export default function Index() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [progressSteps, setProgressSteps] = useState<{ label: string; status: StepStatus }[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);

  const handleAnalyze = useCallback((company: Company, announcement: Announcement) => {
    // 1. 初始化状态
    setCurrentCompany(company);
    setCurrentAnnouncement(announcement);
    setReport(null);
    setIsAnalyzing(true);

    // 2. 初始化进度条
    const initialSteps = PROGRESS_LABELS.map((label) => ({ label, status: 'pending' as StepStatus }));
    setProgressSteps(initialSteps);

    let currentStep = 0;
    
    // 3. 模拟进度条更新的计时器
    const interval = setInterval(() => {
      setProgressSteps((prev) =>
        prev.map((s, i) => {
          if (i < currentStep) return { ...s, status: 'done' as StepStatus };
          if (i === currentStep) return { ...s, status: 'active' as StepStatus };
          return { ...s, status: 'pending' as StepStatus };
        })
      );
      
      currentStep++;
      
      // 如果超过了步骤数组长度，停止计时器
      if (currentStep >= PROGRESS_LABELS.length) {
        clearInterval(interval);
      }
    }, 1500);

    // 4. 调用后端 API
    fetch('https://fininsight-backend-production.up.railway.app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stock_code: company.code,
        org_id: (company as any).orgId, // 兼容处理字段名
        company_name: company.name,
        announcement_url: announcement.url,
        announcement_title: announcement.title,
        announcement_date: announcement.date,
      })
    })
      .then((r) => {
        if (!r.ok) throw new Error('网络请求失败');
        return r.json();
      })
      .then((data) => {
        // 请求成功：停止计时器，将所有步骤设为完成
        clearInterval(interval);
        setProgressSteps((prev) => prev.map(s => ({ ...s, status: 'done' as StepStatus })));
        
        setTimeout(() => {
          setReport(data);
          setIsAnalyzing(false);
        }, 500);
      })
      .catch((err) => {
        // 请求失败：停止计时器，重置状态
        console.error("分析出错:", err);
        clearInterval(interval);
        setIsAnalyzing(false);
        alert("分析请求失败，请检查后端服务是否启动");
      });
  }, []); // 这里的括号和逗号现在是正确的了

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* 左侧面板 */}
      <div className="w-[38%] min-w-[320px] max-w-[420px] border-r border-border p-5 flex flex-col bg-card/50">
        <LeftPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      {/* 右侧面板 */}
      <div className="flex-1 p-6 overflow-hidden">
        <RightPanel
          report={report}
          progressSteps={progressSteps}
          isAnalyzing={isAnalyzing}
          companyName={currentCompany?.name}
          announcementTitle={currentAnnouncement?.title}
        />
      </div>
    </div>
  );
}