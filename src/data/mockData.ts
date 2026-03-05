// Mock data for the FinInsight application

export interface Company {
  code: string;
  name: string;
  market: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface KnowledgeBase {
  totalAnnouncements: number;
  totalCompanies: number;
  companies: { name: string; code: string; count: number }[];
}

export interface RecallItem {
  title: string;
  date: string;
  source: 'self' | 'peer';
  company?: string;
}

export interface AnalysisReport {
  industry: string;
  comparables: string[];
  recalls: RecallItem[];
  oneLiner: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentReason: string;
  actionHolders: string;
  actionNonHolders: string;
  keyRisk: string;
  historyComparison: string;
  peerComparison: string;
  keyData: { label: string; value: string }[];
}

export const MOCK_SEARCH_RESULTS: Record<string, Company[]> = {
  '600036': [{ code: '600036', name: '招商银行', market: 'SH' }],
  '招商银行': [{ code: '600036', name: '招商银行', market: 'SH' }],
  '601398': [{ code: '601398', name: '工商银行', market: 'SH' }],
  '工商银行': [{ code: '601398', name: '工商银行', market: 'SH' }],
  '000858': [{ code: '000858', name: '五粮液', market: 'SZ' }],
  '五粮液': [{ code: '000858', name: '五粮液', market: 'SZ' }],
  '600519': [{ code: '600519', name: '贵州茅台', market: 'SH' }],
  '贵州茅台': [{ code: '600519', name: '贵州茅台', market: 'SH' }],
};

export const MOCK_ANNOUNCEMENTS: Record<string, Announcement[]> = {
  '600036': [
    { id: '1', title: '2024年年度报告', date: '2025-03-28', type: '年报' },
    { id: '2', title: '关于2024年度利润分配方案的公告', date: '2025-03-28', type: '分红' },
    { id: '3', title: '2025年第一季度报告', date: '2025-04-29', type: '季报' },
    { id: '4', title: '关于发行500亿元金融债券的公告', date: '2025-02-15', type: '融资' },
    { id: '5', title: '关于副行长辞任的公告', date: '2025-01-20', type: '人事' },
    { id: '6', title: '关于资本充足率的公告', date: '2025-01-10', type: '监管' },
    { id: '7', title: '2024年三季度报告', date: '2024-10-30', type: '季报' },
    { id: '8', title: '关于获得监管批复的公告', date: '2024-10-15', type: '监管' },
    { id: '9', title: '2024年中期报告', date: '2024-08-23', type: '中报' },
    { id: '10', title: '关于股东大会决议的公告', date: '2024-06-28', type: '治理' },
  ],
  '601398': [
    { id: '1', title: '2024年年度报告', date: '2025-03-30', type: '年报' },
    { id: '2', title: '关于2024年度利润分配预案的公告', date: '2025-03-30', type: '分红' },
    { id: '3', title: '关于发行绿色金融债券的公告', date: '2025-02-20', type: '融资' },
  ],
  '000858': [
    { id: '1', title: '2024年年度报告', date: '2025-04-10', type: '年报' },
    { id: '2', title: '关于2024年度利润分配方案的公告', date: '2025-04-10', type: '分红' },
    { id: '3', title: '关于投资建设新产能项目的公告', date: '2025-03-05', type: '投资' },
  ],
  '600519': [
    { id: '1', title: '2024年年度报告', date: '2025-03-29', type: '年报' },
    { id: '2', title: '关于提高出厂价的公告', date: '2025-01-02', type: '经营' },
  ],
};

export const MOCK_KNOWLEDGE_BASE: KnowledgeBase = {
  totalAnnouncements: 47,
  totalCompanies: 12,
  companies: [
    { name: '招商银行', code: '600036', count: 8 },
    { name: '工商银行', code: '601398', count: 6 },
    { name: '中国银行', code: '601988', count: 5 },
    { name: '建设银行', code: '601939', count: 5 },
    { name: '贵州茅台', code: '600519', count: 4 },
    { name: '五粮液', code: '000858', count: 4 },
    { name: '泸州老窖', code: '000568', count: 3 },
    { name: '平安银行', code: '000001', count: 3 },
    { name: '兴业银行', code: '601166', count: 3 },
    { name: '宁波银行', code: '002142', count: 2 },
    { name: '洋河股份', code: '002304', count: 2 },
    { name: '山西汾酒', code: '600809', count: 2 },
  ],
};

export const MOCK_REPORT_BANK: AnalysisReport = {
  industry: '银行业',
  comparables: ['工商银行', '中国银行', '建设银行'],
  recalls: [
    { title: '2024年中期报告', date: '2024-08-23', source: 'self' },
    { title: '2024年三季度报告', date: '2024-10-30', source: 'self' },
    { title: '2023年年度报告', date: '2024-03-25', source: 'self' },
    { title: '工商银行2024年年度报告', date: '2025-03-30', source: 'peer', company: '工商银行' },
    { title: '建设银行2024年年度报告', date: '2025-03-28', source: 'peer', company: '建设银行' },
  ],
  oneLiner: '招商银行2024年实现归母净利润1483.91亿元，同比增长1.22%，营业收入3374.90亿元，同比下降0.48%，不良贷款率0.95%保持稳定。',
  sentiment: 'neutral',
  sentimentReason: '营收微降但利润仍正增长，资产质量稳定，整体表现符合预期但缺乏亮点。',
  actionHolders: '继续持有观望，关注一季度零售业务恢复情况，若零售AUM增速回升可考虑加仓。',
  actionNonHolders: '可在估值回调至1.0x PB以下时逐步建仓，当前估值略高于历史中枢。',
  keyRisk: '零售贷款不良率边际上升，若消费复苏不及预期可能进一步侵蚀零售业务优势。',
  historyComparison: '与2023年相比，净利润增速从6.22%降至1.22%，营收从正增长转为微降，但不良率保持0.95%未恶化，拨备覆盖率维持在450%以上高位。整体盈利增速放缓但资产质量韧性较强。',
  peerComparison: '横向对比，招行净息差2.16%仍领先工行（1.48%）和建行（1.52%），ROE 15.8%在股份行中居首，但增速已落后于部分城商行。零售业务贡献占比55%，远超同业30-40%的水平。',
  keyData: [
    { label: '归母净利润', value: '1,483.91亿元 (+1.22%)' },
    { label: '营业收入', value: '3,374.90亿元 (-0.48%)' },
    { label: '不良贷款率', value: '0.95% (持平)' },
    { label: '净息差', value: '2.16% (-15bp)' },
    { label: '拨备覆盖率', value: '452.63% (+8.2pp)' },
  ],
};

export const MOCK_REPORT_LIQUOR: AnalysisReport = {
  industry: '白酒',
  comparables: ['贵州茅台', '泸州老窖'],
  recalls: [
    { title: '2024年中期报告', date: '2024-08-28', source: 'self' },
    { title: '2023年年度报告', date: '2024-04-10', source: 'self' },
    { title: '贵州茅台2024年年度报告', date: '2025-03-29', source: 'peer', company: '贵州茅台' },
    { title: '泸州老窖2024年年度报告', date: '2025-04-01', source: 'peer', company: '泸州老窖' },
  ],
  oneLiner: '五粮液2024年实现营收831.69亿元，同比增长9.12%，归母净利润312.56亿元，同比增长10.73%，经销商数量净减少87家。',
  sentiment: 'positive',
  sentimentReason: '营收利润双位数增长，在白酒行业调整期表现出较强韧性，但渠道端出现压力信号。',
  actionHolders: '维持持有，关注春节动销数据和批价走势，若批价企稳可考虑逢低加仓。',
  actionNonHolders: '当前PE约20倍处于历史中低位，可考虑分批建仓，但需跟踪渠道库存去化进度。',
  keyRisk: '经销商数量净减少叠加渠道库存偏高，若终端需求持续疲弱可能引发批价下行。',
  historyComparison: '与2023年相比，营收增速从12.58%降至9.12%，利润增速从13.76%降至10.73%，增速虽有放缓但仍保持双位数，在行业调整期表现优于多数同业。',
  peerComparison: '对比茅台（营收+15.7%）增速偏低，但优于泸州老窖（+7.8%）。净利率37.6%低于茅台（52.4%）但高于泸州老窖（35.1%），整体位于行业第二梯队领先位置。',
  keyData: [
    { label: '营业收入', value: '831.69亿元 (+9.12%)' },
    { label: '归母净利润', value: '312.56亿元 (+10.73%)' },
    { label: '净利率', value: '37.6% (+0.5pp)' },
    { label: '经销商数量变化', value: '净减少87家' },
    { label: '合同负债', value: '105.32亿元 (-12.3%)' },
  ],
};

export function getMockReport(companyCode: string): AnalysisReport {
  if (companyCode === '000858' || companyCode === '600519') {
    return MOCK_REPORT_LIQUOR;
  }
  return MOCK_REPORT_BANK;
}
