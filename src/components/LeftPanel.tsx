import { useState, useCallback, useEffect } from 'react';
import { Search, ChevronDown, Loader2, Database, Building2, FileText } from 'lucide-react';

const API_BASE = 'https://fininsight-backend-production.up.railway.app';

interface Company {
  name: string;
  code: string;
  orgId: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  url: string;
}

interface KbCompany { name: string; code: string; count: number; }
interface KbData { totalAnnouncements: number; totalCompanies: number; companies: KbCompany[]; }

interface LeftPanelProps {
  onAnalyze: (company: Company, announcement: Announcement) => void;
  isAnalyzing: boolean;
}

export default function LeftPanel({ onAnalyze, isAnalyzing }: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [kbExpanded, setKbExpanded] = useState(false);
  const [kb, setKb] = useState<KbData>({ totalAnnouncements: 0, totalCompanies: 0, companies: [] });

  useEffect(() => {
    fetch(`${API_BASE}/api/kb`)
      .then(r => r.json())
      .then(setKb)
      .catch(() => {});
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedCompany(null);
    setSelectedAnnouncement(null);
    setAnnouncements([]);
    setSearchResults([]);
    if (value.trim().length < 2) return;
    setIsSearching(true);
    fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: value.trim() })
    })
      .then(r => r.json())
      .then(data => { setSearchResults(data.results || []); setIsSearching(false); })
      .catch(() => setIsSearching(false));
  }, []);

  const handleSelectCompany = useCallback((company: Company) => {
    setSelectedCompany(company);
    setSelectedAnnouncement(null);
    setIsLoadingAnnouncements(true);
    fetch(`${API_BASE}/api/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_code: company.code, org_id: company.orgId })
    })
      .then(r => r.json())
      .then(data => { setAnnouncements(data.announcements || []); setIsLoadingAnnouncements(false); })
      .catch(() => setIsLoadingAnnouncements(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">FinInsight</h1>
        <p className="text-xs text-muted-foreground mt-1">AI投研公告分析助手</p>
      </div>

      <div className="space-y-3 flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="输入股票代码或公司名..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
        </div>

        {searchResults.length > 0 && !selectedCompany && (
          <div className="animate-fade-slide-up">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">选择公司</label>
            <div className="space-y-1">
              {searchResults.map((c) => (
                <button key={c.code} onClick={() => handleSelectCompany(c)}
                  className="w-full text-left px-3 py-2.5 rounded-lg bg-secondary hover:bg-primary/10 hover:border-primary/30 border border-transparent text-sm transition-all flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground font-medium">{c.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">({c.code})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCompany && (
          <div className="animate-fade-slide-up">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">已选公司</label>
            <div className="px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground font-medium">{selectedCompany.name}</span>
              <span className="text-muted-foreground font-mono text-xs">({selectedCompany.code})</span>
              <button onClick={() => { setSelectedCompany(null); setAnnouncements([]); setSelectedAnnouncement(null); }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground">更换</button>
            </div>
          </div>
        )}

        {isLoadingAnnouncements && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />加载公告列表...
          </div>
        )}

        {announcements.length > 0 && !isLoadingAnnouncements && (
          <div className="animate-fade-slide-up">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">选择公告</label>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {announcements.map((a) => (
                <button key={a.id} onClick={() => setSelectedAnnouncement(a)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    selectedAnnouncement?.id === a.id
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-secondary border-transparent hover:bg-primary/5 hover:border-primary/20'}`}>
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-foreground leading-snug truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{a.date}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCompany && selectedAnnouncement && (
          <div className="animate-fade-slide-up pt-2">
            <button onClick={() => onAnalyze(selectedCompany, selectedAnnouncement)} disabled={isAnalyzing}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                isAnalyzing
                  ? 'bg-primary/60 text-primary-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse'}`}>
              {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin" />分析中...</> : '🔍 开始分析'}
            </button>
          </div>
        )}
      </div>

      <div className="kb-panel mt-4">
        <button onClick={() => setKbExpanded(!kbExpanded)} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">知识库</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">{kb.totalAnnouncements} 篇 · {kb.totalCompanies} 家</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${kbExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>
        {kbExpanded && (
          <div className="mt-3 space-y-1.5 animate-fade-slide-up">
            {kb.companies.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-md bg-card/50">
                <span className="text-foreground">{c.name}</span>
                <span className="text-muted-foreground font-mono">{c.count}篇</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
