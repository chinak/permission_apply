import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, FileText, Download, Clock, User, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../components/ui/Dialog';
import { cn } from '../../lib/utils';
import { getEnabledReasons } from '../utils/mockData';

// 会签审批人
export interface Approver {
  role: string;        // 职能名称，如 "运营中心风控评估"
  name: string;        // 实际处理人姓名（pending时可留空）
  org: string;         // 所属机构
  status: 'pending' | 'approved' | 'rejected';
  time: string;        // 处理时间，pending时为 '-'
  comment?: string;    // 驳回原因（仅 rejected 时有值）
}

// 流程节点
export interface FlowStep {
  label: string;
  nodeType: 'serial' | 'counter-sign';
  actor?: string;
  time?: string;
  approvers?: Approver[];
  type?: 'done' | 'current' | 'reject';
  reason?: string;
}

// 会签节点状态聚合：一票否决
function getCounterSignStatus(approvers: Approver[]): 'approved' | 'rejected' | 'processing' {
  if (approvers.some(a => a.status === 'rejected')) return 'rejected';
  if (approvers.every(a => a.status === 'approved')) return 'approved';
  return 'processing';
}

export interface AuditData {
  id: string;
  exchangeName: string;
  contract: string;
  lots: number;
  direction: string;
  type: string;
  applyDate: string;
  status: string;
  statusText: string;
  rejectReason?: string;
  // 是否经历过驳回重提
  hasResubmit?: boolean;
  // 会签节点审批人列表
  counterSignApprovers?: Approver[];
  // 交易所列表
  selectedExchanges?: string[];
  // 合约类别
  contractType?: string;
  // 移仓日期
  transferDate?: string;
  // 移出方信息 (direction=IN时使用)
  outBrokerMemberId?: string;
  outBrokerName?: string;
  outClientTradingCodes?: Record<string, string>;
  outClientNames?: Record<string, string>;
  // 移入方信息 (direction=OUT时使用)
  inBrokerMemberId?: string;
  inBrokerName?: string;
  inClientTradingCodes?: Record<string, string>;
  inClientName?: string;
  // 实控组移仓
  actualControlOutAccount?: string;
  actualControlOutName?: string;
  actualControlInAccount?: string;
  actualControlInName?: string;
  // 大商所特定字段
  dceTransferByQuantity?: string;
  transferReason?: string;
  // 合约明细
  positions?: { id: string; exchange?: string; varietyName: string; contractCode: string; positionDirection: string; hedgeType: string; lots: number; transferFunds: number; remark: string }[];
  // 补充说明
  remark?: string;
  // 附件
  attachments?: { name: string; size: string }[];
}

const EXCHANGE_LABELS: Record<string, string> = {
  DCE: '大连商品交易所',
  CZCE: '郑州商品交易所',
  SHFE: '上海期货交易所',
};

const DEFAULT_ATTACHMENTS = [
  { name: '移仓业务申请表_盖章.pdf', size: '2.5 MB' },
  { name: '客户身份证明.pdf', size: '1.8 MB' },
  { name: '持仓证明.pdf', size: '1.2 MB' },
];

const VerifyItem = ({ label, ok, detail }: { label: string, ok: boolean, detail?: string }) => (
  <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0">
    <div>
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      {detail && <p className="text-xs text-slate-500 mt-1">{detail}</p>}
    </div>
    {ok ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> 满足
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> 不满足
      </span>
    )}
  </div>
);

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-sm shadow-sm border border-slate-200">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-sm" />
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function WarehouseAudit({
  isModal = false,
  hideTitle = false,
  onClose,
  data: propData,
}: {
  isModal?: boolean;
  hideTitle?: boolean;
  onClose?: () => void;
  data?: AuditData;
} = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const data: AuditData = propData || (location.state as AuditData) || {
    id: 'WH-20260623-001',
    exchangeName: '大连商品交易所',
    contract: 'rb2501',
    lots: 50,
    direction: 'IN',
    type: '跨期货公司转移',
    applyDate: '2026-06-23 10:30',
    status: 'processing',
    statusText: '审核中',
  };

  const [actionModal, setActionModal] = useState<{ open: boolean; type: 'reject' | 'defer' | '' }>({ open: false, type: '' });
  const [selectedReasonId, setSelectedReasonId] = useState('');
  const [customReason, setCustomReason] = useState('');
  const enabledReasons = getEnabledReasons('trade_permission');

  // 会签节点审批人状态（支持交互变更）
  const DEFAULT_APPROVERS: Approver[] = [
    { role: '运营中心风控评估', name: '', org: '运营中心', status: 'pending', time: '-' },
    { role: '运营中心交割评估', name: '', org: '运营中心', status: 'pending', time: '-' },
    { role: '运营中心结算评估', name: '', org: '运营中心', status: 'pending', time: '-' },
  ];
  const [approvers, setApprovers] = useState<Approver[]>(
    data.counterSignApprovers ? data.counterSignApprovers.map(a => ({ ...a })) : DEFAULT_APPROVERS
  );

  // 当前会签节点的处理进度
  const approvedCount = approvers.filter(a => a.status === 'approved').length;
  const csStatus = getCounterSignStatus(approvers);

  // 判断当前状态是否在会签节点
  const currentStatusText = data.statusText || data.status;
  const isCounterSignCurrent = currentStatusText === '运营中心会签';

  // 模拟当前登录用户是第一个 pending 的审批人
  const currentApproverIdx = approvers.findIndex(a => a.status === 'pending');
  const currentApproverRole = currentApproverIdx >= 0 ? approvers[currentApproverIdx].role : '';

  // 按行交易所计算手数标签
  const getLotsLabelForRow = (exchange: string) => {
    if (exchange === 'CZCE' || exchange === 'SHFE') return '预估移仓手数';
    if (exchange === 'DCE' && data.dceTransferByQuantity === 'NO') return '预估移仓手数';
    return '移仓手数';
  };
  // 表格列头：所有行一致时用对应标签，混合时用通用标签
  const getLotsHeaderLabel = () => {
    if (!data.positions || data.positions.length === 0) return '移仓手数';
    const labels = new Set(data.positions.map(p => getLotsLabelForRow(p.exchange || '')));
    return labels.size === 1 ? labels.values().next().value : '移仓手数';
  };

  const handleActionConfirm = () => {
    const finalReason = selectedReasonId === 'other' ? customReason : enabledReasons.find(r => r.id === selectedReasonId)?.content;

    // 会签节点的驳回（一票否决）
    if (isCounterSignCurrent && currentApproverIdx >= 0) {
      setApprovers(prev => prev.map((a, i) =>
        i === currentApproverIdx
          ? { ...a, status: 'rejected' as const, time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), name: '当前用户', comment: finalReason || '无' }
          : a
      ));
      alert(`运营中心会签 - ${currentApproverRole} 已驳回\n原因：${finalReason || '无'}\n（一票否决，会签节点已驳回）`);
    } else {
      alert(`操作：${actionModal.type === 'reject' ? '驳回' : '办理失败'}\n原因：${finalReason || '无'}`);
    }
    setActionModal({ open: false, type: '' });
    setSelectedReasonId('');
    setCustomReason('');
  };

  // 会签节点审核通过
  const handleCounterSignApprove = () => {
    if (!isCounterSignCurrent || currentApproverIdx < 0) {
      alert('审核已通过');
      return;
    }
    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const role = approvers[currentApproverIdx].role;
    setApprovers(prev => prev.map((a, i) =>
      i === currentApproverIdx
        ? { ...a, status: 'approved' as const, time: now, name: '当前用户' }
        : a
    ));

    // 检查是否全部通过
    const remaining = approvers.filter((a, i) => i !== currentApproverIdx && a.status !== 'approved');
    if (remaining.length === 0) {
      alert(`运营中心会签 - ${role} 已通过\n全部审批人已通过，会签节点完成，流程推进至下一节点。`);
    } else {
      alert(`运营中心会签 - ${role} 已通过\n当前进度：${approvedCount + 1}/${approvers.length}，等待其他审批人处理。`);
    }
  };

  const handleClose = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/warehouse-audit-list');
    }
  };

  return (
    <div className={isModal ? 'bg-slate-50 relative flex flex-col min-h-full' : 'w-full mx-auto space-y-6 pb-32 px-4'}>
      {!hideTitle && (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">移仓业务总部审核</h1>
              <p className="text-sm text-slate-500">流水号：{data.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-sm text-sm font-medium border border-blue-200">
              <Clock className="w-4 h-4" />
              {data.statusText}
            </span>
          </div>
        </div>
      )}

      {/* All content in sequence (no tabs) */}
      <div className={cn(isModal ? 'flex flex-col gap-4 px-6 pt-6 pb-6' : 'space-y-6')}>

        {/* 客户信息校验 */}
        <Card className="p-8 shadow-sm border-slate-200 bg-white rounded-sm">
          <div>
            <h2 className="text-base font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-6">
              客户信息校验
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              <VerifyItem label="机构证件信息" ok={true} />
              <VerifyItem label="开户授权人信息" ok={true} />
              <VerifyItem label="产品相关信息" ok={true} />
              <VerifyItem label="法人信息" ok={false} />
              <VerifyItem label="联系信息" ok={true} />
              <VerifyItem label="受益人信息" ok={false} />
            </div>
          </div>
        </Card>

        {/* 基本资料 */}
        <Card className="p-8 shadow-sm border-slate-200 bg-white rounded-sm">
          <div>
            <h2 className="text-base font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-6">
              基本资料
            </h2>
            <table className="w-full text-sm border-collapse border border-slate-200">
              <tbody>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">客户名称</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900 w-[30%]">张三科技有限公司</td>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">客户类型</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900 w-[30%]">一般单位客户</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">资产账号</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-blue-600 font-medium">85171680</td>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium"></td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900"></td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">所属分支</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">上海浦东分公司</td>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">适当性等级</td>
                  <td className="border border-slate-200 py-2.5 px-4 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">普通投资者C4</span>
                      <span className="text-xs text-slate-500">有效期至 2027-01-01</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">账户状态</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">正常</td>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">休眠状态</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">否</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">账户规范状态</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">规范</td>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">反洗钱风险等级</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">低风险</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 text-slate-600 font-medium">机构证件有效期止</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900" colSpan={3}>2050-12-31</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 申请信息 */}
        <SectionCard title="移仓信息">
          <div className="space-y-6">
            {/* 移仓基本信息 */}
            <table className="w-full text-sm border-collapse border border-slate-200">
              <tbody>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-40 text-slate-600 font-medium">移仓交易所</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900">
                    {(data.selectedExchanges && data.selectedExchanges.length > 0
                      ? data.selectedExchanges.map(e => EXCHANGE_LABELS[e] || e).join('、')
                      : data.exchangeName)}
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-40 text-slate-600 font-medium">移仓方向</td>
                  <td className="border border-slate-200 py-2.5 px-4 text-slate-900" colSpan={1}>
                    {data.direction === 'IN' ? '移入我司' : data.direction === 'OUT' ? '移出我司' : '实控组移仓'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 移出 / 移入方信息 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-4">移出 / 移入方信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-sm p-4">
                  <h5 className="text-sm font-semibold text-slate-800 mb-3">移出方</h5>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-slate-500">期货公司会员号</span><span className="text-slate-900">{data.outBrokerMemberId || '-'}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500">期货公司全称</span><span className="text-slate-900">{data.outBrokerName || '-'}</span></p>
                    {data.selectedExchanges?.length && (data.direction === 'IN' || data.direction === 'OUT') ? (
                      data.selectedExchanges.map(ex => (
                        <React.Fragment key={ex}>
                          <p className="flex justify-between"><span className="text-slate-500">{EXCHANGE_LABELS[ex] || ex} 客户交易编码</span><span className="text-slate-900">{data.outClientTradingCodes?.[ex] || '-'}</span></p>
                          <p className="flex justify-between"><span className="text-slate-500">{EXCHANGE_LABELS[ex] || ex} 客户全称</span><span className="text-slate-900">{data.outClientNames?.[ex] || '-'}</span></p>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <p className="flex justify-between"><span className="text-slate-500">客户交易编码</span><span className="text-slate-900">-</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">客户全称</span><span className="text-slate-900">-</span></p>
                      </>
                    )}
                  </div>
                </div>
                <div className="border border-slate-200 rounded-sm p-4">
                  <h5 className="text-sm font-semibold text-slate-800 mb-3">移入方</h5>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-slate-500">期货公司会员号</span><span className="text-slate-900">{data.inBrokerMemberId || '-'}</span></p>
                    <p className="flex justify-between"><span className="text-slate-500">期货公司全称</span><span className="text-slate-900">{data.inBrokerName || '-'}</span></p>
                    {data.selectedExchanges && data.selectedExchanges.length > 0
                      ? data.selectedExchanges.map(ex => (
                        <p key={ex} className="flex justify-between"><span className="text-slate-500">{EXCHANGE_LABELS[ex] || ex} 客户交易编码</span><span className="text-slate-900">{data.inClientTradingCodes?.[ex] || '-'}</span></p>
                      ))
                      : (
                        <p className="flex justify-between"><span className="text-slate-500">客户交易编码</span><span className="text-slate-900">-</span></p>
                      )}
                    <p className="flex justify-between"><span className="text-slate-500">客户全称</span><span className="text-slate-900">{data.inClientName || '-'}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 实控组信息 — direction=ACTUAL_CONTROL 时额外显示 */}
            {data.direction === 'ACTUAL_CONTROL' && (data.actualControlOutAccount || data.actualControlInAccount) && (
              <div>
                <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-4">实控组账户信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.actualControlOutAccount && (
                    <div className="border border-slate-200 rounded-sm p-4">
                      <h5 className="text-sm font-semibold text-slate-800 mb-3">移出方</h5>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span className="text-slate-500">移出账号</span><span className="text-slate-900">{data.actualControlOutAccount}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">客户全称</span><span className="text-slate-900">{data.actualControlOutName || '-'}</span></p>
                      </div>
                    </div>
                  )}
                  {data.actualControlInAccount && (
                    <div className="border border-slate-200 rounded-sm p-4">
                      <h5 className="text-sm font-semibold text-slate-800 mb-3">移入方</h5>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span className="text-slate-500">移入账号</span><span className="text-slate-900">{data.actualControlInAccount}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">客户全称</span><span className="text-slate-900">{data.actualControlInName || '-'}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 交易所特定字段 — 实控组移仓不显示 */}
            {data.direction !== 'ACTUAL_CONTROL' && (
              <div className="space-y-4">
                {/* 移出我司：统一申请理由 */}
                {data.direction === 'OUT' && data.transferReason && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-2">申请理由</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 border border-slate-200 rounded-sm">{data.transferReason}</p>
                  </div>
                )}

                {/* 大商所是否按量移仓 - 非移出我司时显示 */}
                {data.selectedExchanges?.includes('DCE') && data.direction !== 'OUT' && data.dceTransferByQuantity && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-2">大商所是否按量移仓</h4>
                    <p className="text-sm text-slate-700">{data.dceTransferByQuantity === 'YES' ? '是' : '否'}</p>
                  </div>
                )}
              </div>
            )}

            {/* 合约明细 */}
            {data.positions && data.positions.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-4">合约明细</h4>
                <table className="w-full text-sm border-collapse border border-slate-200">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">品种/合约名称</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">品种/合约代码</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">持仓方向</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">持仓类型</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">{getLotsHeaderLabel()}</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">转移资金</th>
                      <th className="border border-slate-200 py-2 px-3 font-medium text-left">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.positions.map((pos) => (
                      <tr key={pos.id}>
                        <td className="border border-slate-200 py-2 px-3">{pos.varietyName}</td>
                        <td className="border border-slate-200 py-2 px-3">{pos.contractCode}</td>
                        <td className="border border-slate-200 py-2 px-3">{pos.positionDirection === 'BUY' ? '买' : pos.positionDirection === 'SELL' ? '卖' : '全部'}</td>
                        <td className="border border-slate-200 py-2 px-3">{pos.hedgeType === 'SPEC' ? '投机' : pos.hedgeType === 'HEDGE' ? '套保' : '-'}</td>
                        <td className="border border-slate-200 py-2 px-3">{pos.lots}</td>
                        <td className="border border-slate-200 py-2 px-3">{pos.transferFunds > 0 ? pos.transferFunds.toLocaleString() : '-'}</td>
                        <td className="border border-slate-200 py-2 px-3 text-slate-400">{pos.remark || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 补充说明 */}
            {data.remark && (
              <div>
                <h4 className="text-sm font-bold text-slate-800 border-l-4 border-blue-600 pl-3 leading-none mb-2">补充说明</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 border border-slate-200 rounded-sm">{data.remark}</p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 附件资料 */}
        <SectionCard title="附件资料">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data.attachments && data.attachments.length > 0 ? data.attachments : DEFAULT_ATTACHMENTS).map((file, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-slate-200 rounded-sm hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate" title={file.name}>{file.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{file.size}</span>
                  </div>
                </div>
                <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="下载">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 审批流程 */}
        <SectionCard title="审批流程">
          {(() => {
            const STATUS_ORDER = ['营业部审核', '运营中心会签', '总部经办', '总部复核', '已完成'] as const;
            const currentStatus = data.statusText || data.status;
            const currentRegularIdx = STATUS_ORDER.indexOf(currentStatus as any);

            // 构建流程节点
            const steps: FlowStep[] = [
              { label: '发起申请', nodeType: 'serial', actor: '张三 (客户)', time: `${data.applyDate} 10:00:00` },
            ];

            if (data.hasResubmit) {
              steps.push(
                { label: '营业部审核', nodeType: 'serial', actor: '王审核 (上海浦东分公司)', time: '2026-06-23 11:05:18' },
                { label: '营业部审核', nodeType: 'serial', actor: '王审核 (上海浦东分公司)', time: '2026-06-23 14:15:00', type: 'reject', reason: data.rejectReason || '驳回原因未记录' },
                { label: '重新提交申请', nodeType: 'serial', actor: '张三 (客户)', time: '2026-06-24 09:10:00' },
              );
            }

            steps.push(
              { label: '营业部审核', nodeType: 'serial', actor: '王审核 (上海浦东分公司)', time: '-' },
              { label: '运营中心会签', nodeType: 'counter-sign', approvers },
              { label: '总部经办', nodeType: 'serial', actor: '李经办 (总部)', time: '-' },
              { label: '总部复核', nodeType: 'serial', actor: '郑复核 (总部)', time: '-' },
            );

            const extraSteps = data.hasResubmit ? 3 : 0;
            const currentStepIdx = currentRegularIdx >= 0 ? 1 + extraSteps + currentRegularIdx : 0;
            const isCompleted = currentRegularIdx >= STATUS_ORDER.length;

            return (
              <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                {steps.slice(0, currentStepIdx + 1).map((step, idx) => {
                  const isCurrent = idx === currentStepIdx && !isCompleted;
                  const isReject = step.type === 'reject';

                  // ===== 会签节点渲染 =====
                  if (step.nodeType === 'counter-sign') {
                    const stepApprovers = step.approvers || [];
                    const stepCsStatus = getCounterSignStatus(stepApprovers);
                    const stepApprovedCount = stepApprovers.filter(a => a.status === 'approved').length;
                    const stepRejectedApprover = stepApprovers.find(a => a.status === 'rejected');

                    // 会签节点被驳回（一票否决）
                    if (stepCsStatus === 'rejected') {
                      return (
                        <div key={`${step.label}-cs-reject-${idx}`} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-red-600 text-sm">{step.label} (已驳回)</span>
                              <span className="text-[10px] text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-sm leading-none">{stepApprovedCount}/{stepApprovers.length}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{stepRejectedApprover?.time || '-'}</span>
                          </div>
                          {/* 子项列表 */}
                          <div className="relative ml-1 border-l border-slate-200 pl-4 space-y-3 pb-1">
                            {stepApprovers.map((appr, ai) => (
                              <div key={ai} className="relative">
                                {appr.status === 'approved' && (
                                  <>
                                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        <span className="text-sm font-medium text-slate-700">{appr.role}</span>
                                        <span className="text-xs text-green-600">已通过</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">{appr.name}</span>
                                        <span className="text-xs text-slate-400 font-mono">{appr.time}</span>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {appr.status === 'rejected' && (
                                  <>
                                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm z-10"></div>
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                                        <span className="text-sm font-medium text-slate-700">{appr.role}</span>
                                        <span className="text-xs text-red-600">已驳回</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">{appr.name}</span>
                                        <span className="text-xs text-slate-400 font-mono">{appr.time}</span>
                                      </div>
                                    </div>
                                    {appr.comment && (
                                      <div className="bg-red-50 border border-red-100 rounded-sm text-xs text-slate-700 p-2.5 flex items-start gap-1.5 mt-1">
                                        <FileText className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>驳回原因：{appr.comment}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                                {appr.status === 'pending' && (
                                  <>
                                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white shadow-sm z-10"></div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                                        <span className="text-sm font-medium text-slate-400">{appr.role}</span>
                                        <span className="text-xs text-slate-400">待处理</span>
                                      </div>
                                      <span className="text-xs text-slate-400 font-mono">-</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // 会签节点处理中（当前节点）
                    if (isCurrent && stepCsStatus === 'processing') {
                      return (
                        <div key={`${step.label}-cs-current-${idx}`} className="relative pl-6">
                          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-50 border-2 border-blue-500 shadow-sm z-10 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-600 text-sm">{step.label} (处理中)</span>
                              <span className="text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm leading-none">当前节点</span>
                              <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm leading-none">{stepApprovedCount}/{stepApprovers.length}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">-</span>
                          </div>
                          {/* 子项列表 */}
                          <div className="relative ml-1 border-l border-slate-200 pl-4 space-y-3 pb-1">
                            {stepApprovers.map((appr, ai) => (
                              <div key={ai} className="relative">
                                {appr.status === 'approved' && (
                                  <>
                                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        <span className="text-sm font-medium text-slate-700">{appr.role}</span>
                                        <span className="text-xs text-green-600">已通过</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">{appr.name}</span>
                                        <span className="text-xs text-slate-400 font-mono">{appr.time}</span>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {appr.status === 'pending' && (
                                  <>
                                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white shadow-sm z-10"></div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                                        <span className="text-sm font-medium text-slate-400">{appr.role}</span>
                                        <span className="text-xs text-slate-400">待处理</span>
                                      </div>
                                      <span className="text-xs text-slate-400 font-mono">-</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // 会签节点已通过（done）
                    return (
                      <div key={`${step.label}-cs-done-${idx}`} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 text-sm">{step.label}</span>
                            <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-sm leading-none">{stepApprovedCount}/{stepApprovers.length}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">
                            {stepApprovers[stepApprovers.length - 1]?.time || '-'}
                          </span>
                        </div>
                        {/* 子项列表 */}
                        <div className="relative ml-1 border-l border-slate-200 pl-4 space-y-3 pb-1">
                          {stepApprovers.map((appr, ai) => (
                            <div key={ai} className="relative">
                              <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"></div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                  <span className="text-sm font-medium text-slate-700">{appr.role}</span>
                                  <span className="text-xs text-green-600">已通过</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-slate-500">{appr.name}</span>
                                  <span className="text-xs text-slate-400 font-mono">{appr.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // ===== 串行节点渲染（原有逻辑） =====
                  if (isReject) {
                    return (
                      <div key={`${step.label}-reject-${idx}`} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <span className="font-medium text-red-600 text-sm">{step.label} (已驳回)</span>
                          <span className="text-xs text-slate-500 font-mono">{step.time}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {step.actor}
                        </div>
                        {step.reason && (
                          <div className="bg-red-50 border border-red-100 rounded-sm text-xs text-slate-700 p-2.5 flex items-start gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>驳回原因：{step.reason}</span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (isCurrent) {
                    return (
                      <div key={`${step.label}-current-${idx}`} className="relative pl-6">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-50 border-2 border-blue-500 shadow-sm z-10 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-600 text-sm">{step.label} (处理中)</span>
                            <span className="text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm leading-none">当前节点</span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">-</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" /> 等待处理
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`${step.label}-done-${idx}`} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <span className="font-medium text-slate-800 text-sm">{step.label}</span>
                        <span className="text-xs text-slate-500 font-mono">{step.time}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {step.actor}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </SectionCard>

      </div>

      {/* Audit Actions - sticky bottom */}
      <div className={cn(
        isModal
          ? 'sticky bottom-0 z-50 w-full bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'
          : 'fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50'
      )}>
        <button
          className="px-8 py-2.5 rounded-sm border border-slate-300 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm"
          onClick={() => setActionModal({ open: true, type: 'reject' })}
        >
          {isCounterSignCurrent ? `驳回 (${currentApproverRole})` : '驳回'}
        </button>
        <button
          className="px-8 py-2.5 rounded-sm border border-amber-200 bg-amber-50 text-amber-600 font-medium hover:bg-amber-100 transition-colors shadow-sm"
          onClick={() => setActionModal({ open: true, type: 'defer' })}
        >
          办理失败
        </button>
        <button
          className="px-8 py-2.5 rounded-sm bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => {
            if (isCounterSignCurrent) {
              handleCounterSignApprove();
            } else {
              alert('审核已通过');
            }
          }}
        >
          {isCounterSignCurrent ? `审核通过 (${currentApproverRole})` : '审核通过'}
        </button>
      </div>

      {/* Action Modal */}
      <Dialog open={actionModal.open} onOpenChange={(open) => setActionModal({ open, type: actionModal.type })}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {actionModal.type === 'reject' ? '确认驳回' : '确认办理失败'}
            </DialogTitle>
            <DialogDescription className="sr-only">选择原因</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  <span className="text-red-500 mr-1">*</span>快捷选择原因
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedReasonId}
                    onChange={(e) => setSelectedReasonId(e.target.value)}
                  >
                    <option value="" disabled>请选择{actionModal.type === 'reject' ? '驳回' : '暂缓'}原因...</option>
                    {enabledReasons.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.content}</option>
                    ))}
                    <option value="other">其他原因 (手动输入)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              {selectedReasonId === 'other' && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <textarea
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="请详细描述具体原因..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setActionModal({ open: false, type: '' })} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button
              className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8"
              disabled={!selectedReasonId || (selectedReasonId === 'other' && !customReason.trim())}
              onClick={handleActionConfirm}
            >
              确定办理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
