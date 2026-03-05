import { useState, useCallback } from 'react';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import { Company, Announcement, AnalysisReport, getMockReport } from '@/data/mockData';

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
    setCurrentCompany(company);
    setCurrentAnnouncement(announcement);
    setReport(null);
    setIsAnalyzing(true);

    const steps = PROGRESS_LABELS.map((label) => ({ label, status: 'pending' as StepStatus }));
    setProgressSteps(steps);

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgressSteps((prev) => {
        const next = prev.map((s, i) => {
          if (i < currentStep) return { ...s, status: 'done' as StepStatus };
          if (i === currentStep) return { ...s, status: 'active' as StepStatus };
          return { ...s, status: 'pending' as StepStatus };
        });
        return next;
      });

      currentStep++;

      if (currentStep > PROGRESS_LABELS.length) {
        clearInterval(interval);
        setProgressSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as StepStatus })));
        setTimeout(() => {
          setReport(getMockReport(company.code));
          setIsAnalyzing(false);
        }, 500);
      }
    }, 1500);
  }, []);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Panel */}
      <div className="w-[38%] min-w-[320px] max-w-[420px] border-r border-border p-5 flex flex-col bg-card/50">
        <LeftPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      {/* Right Panel */}
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
