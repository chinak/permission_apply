import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  ChevronLeft,
  FileText, Download,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../components/ui/Button';
import { ProcessRecord } from '../components/ProcessRecord';
import { type WarehouseExchange, type PositionRow } from '../store/WarehouseContext';

interface DetailData {
  id: string;
  status: string;
  statusText: string;
  rejectReason?: string;
  applyDate: string;
  selectedExchanges?: string[];
  direction?: string;
}

const EXCHANGE_LABELS: Record<WarehouseExchange, string> = {
  DCE: '大连商品交易所',
  CZCE: '郑州商品交易所',
  SHFE: '上海期货交易所',
};

const DIRECTION_LABELS: Record<string, string> = {
  IN: '移入我司（持仓从其他期货公司转入国泰君安）',
  OUT: '移出我司（持仓从国泰君安转出至其他期货公司）',
  ACTUAL_CONTROL: '大商所我司实控组移仓（实际控制关系账户之间移仓）',
};

const HEDGE_LABELS: Record<string, string> = {
  SPEC: '投机',
  HEDGE: '套保',
};

const POSITION_DIR_LABELS: Record<string, string> = {
  BUY: '买',
  SELL: '卖',
  ALL: '全部',
};

const MOCK_DETAIL = {
  selectedExchanges: [] as WarehouseExchange[],
  direction: '',
  contractType: 'FUTURES',
  transferDate: '',
  outBrokerMemberId: '',
  outBrokerName: '',
  outClientTradingCodes: { DCE: '', CZCE: '', SHFE: '' } as Record<WarehouseExchange, string>,
  outClientNames: { DCE: '', CZCE: '', SHFE: '' } as Record<WarehouseExchange, string>,
  inBrokerMemberId: '',
  inBrokerName: '',
  inClientTradingCodes: { DCE: '', CZCE: '', SHFE: '' } as Record<WarehouseExchange, string>,
  inClientName: '',
  actualControlOutAccount: '',
  actualControlOutName: '',
  actualControlInAccount: '',
  actualControlInName: '',
  dceTransferByQuantity: '' as 'YES' | 'NO' | '',
  transferReason: '',
  positions: [] as PositionRow[],
  attachments: [
    { name: '移仓业务申请表_盖章.pdf', size: '2.50 MB' },
    { name: '客户身份证明.pdf', size: '1.80 MB' },
  ],
  remark: '',
};

const MOCK_DETAILS: Record<string, typeof MOCK_DETAIL> = {
  'WH-20260623-001': {
    ...MOCK_DETAIL,
    selectedExchanges: ['DCE'],
    direction: 'IN',
    dceTransferByQuantity: 'YES',
    outBrokerMemberId: '0001',
    outBrokerName: '中信期货有限公司',
    outClientTradingCodes: { DCE: '012345678', CZCE: '', SHFE: '' },
    outClientNames: { DCE: '张三科技有限公司', CZCE: '', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '100001', CZCE: '', SHFE: '' },
    inClientName: '张三科技有限公司',
    positions: [
      { id: 'pos_1', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2501', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 50, transferFunds: 1250000, remark: '' },
    ],
    remark: '跨期货公司转移',
  },
  'WH-20260623-002': {
    ...MOCK_DETAIL,
    selectedExchanges: ['DCE', 'CZCE'],
    direction: 'IN',
    dceTransferByQuantity: 'YES',
    outBrokerMemberId: '0001',
    outBrokerName: '中信期货有限公司',
    outClientTradingCodes: { DCE: '012345678', CZCE: '112233445', SHFE: '' },
    outClientNames: { DCE: '张三科技有限公司', CZCE: '张三科技有限公司', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '100001', CZCE: '100002', SHFE: '' },
    inClientName: '张三科技有限公司',
    positions: [
      { id: 'pos_1', exchange: 'DCE', varietyName: '铁矿石', contractCode: 'i2505', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 80, transferFunds: 3000000, remark: '' },
      { id: 'pos_2', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR501', positionDirection: 'ALL', hedgeType: '', lots: 100, transferFunds: 2000000, remark: '' },
    ],
    remark: '跨期货公司转移',
  },
  'WH-20260622-003': {
    ...MOCK_DETAIL,
    selectedExchanges: ['SHFE'],
    direction: 'ACTUAL_CONTROL',
    actualControlOutAccount: '85171680',
    actualControlOutName: '张三科技有限公司',
    actualControlInAccount: '95281791',
    actualControlInName: '李四贸易有限公司',
    positions: [
      { id: 'pos_1', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'SELL', hedgeType: 'HEDGE', lots: 20, transferFunds: 500000, remark: '' },
    ],
    remark: '实控关系组内账户间转移',
  },
  'WH-20260621-004': {
    ...MOCK_DETAIL,
    selectedExchanges: ['DCE', 'SHFE', 'CZCE'],
    direction: 'OUT',
    inBrokerMemberId: '0002',
    inBrokerName: '银河期货有限公司',
    inClientTradingCodes: { DCE: '876543210', CZCE: '554433221', SHFE: '112233445' },
    inClientName: '李四贸易有限公司',
    outBrokerMemberId: '0000',
    outBrokerName: '国泰君安期货有限公司',
    outClientTradingCodes: { DCE: '700010', CZCE: '700011', SHFE: '700012' },
    outClientNames: { DCE: '李四贸易有限公司', CZCE: '李四贸易有限公司', SHFE: '李四贸易有限公司' },
    transferReason: '因业务调整需要转出持仓',
    positions: [
      { id: 'pos_1', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2501', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 100, transferFunds: 2500000, remark: '' },
      { id: 'pos_2', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'SELL', hedgeType: 'HEDGE', lots: 150, transferFunds: 3750000, remark: '' },
      { id: 'pos_3', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR501', positionDirection: 'ALL', hedgeType: '', lots: 100, transferFunds: 2000000, remark: '' },
    ],
    remark: '跨期货公司转移',
  },
  'WH-20260620-005': {
    ...MOCK_DETAIL,
    selectedExchanges: ['CZCE'],
    direction: 'IN',
    outBrokerMemberId: '0001',
    outBrokerName: '中信期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '112233445', SHFE: '' },
    outClientNames: { DCE: '', CZCE: '张三科技有限公司', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '100002', SHFE: '' },
    inClientName: '张三科技有限公司',
    positions: [
      { id: 'pos_1', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR501', positionDirection: 'ALL', hedgeType: '', lots: 100, transferFunds: 2000000, remark: '' },
    ],
    remark: '移仓合约已超出允许办理时间范围',
  },
  'WH-20260618-006': {
    ...MOCK_DETAIL,
    selectedExchanges: ['DCE', 'SHFE'],
    direction: 'IN',
    dceTransferByQuantity: 'YES',
    outBrokerMemberId: '0008',
    outBrokerName: '方正中期期货有限公司',
    outClientTradingCodes: { DCE: '778899001', CZCE: '', SHFE: '223344556' },
    outClientNames: { DCE: '明达资产管理有限公司', CZCE: '', SHFE: '明达资产管理有限公司' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '300003', CZCE: '', SHFE: '300004' },
    inClientName: '明达资产管理有限公司',
    positions: [
      { id: 'pos_1', exchange: 'DCE', varietyName: '豆粕', contractCode: 'm2505', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 70, transferFunds: 1400000, remark: '' },
      { id: 'pos_2', exchange: 'SHFE', varietyName: '白银', contractCode: 'ag2506', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 50, transferFunds: 3000000, remark: '' },
    ],
    remark: '大商所品种未满足套保额度要求',
  },
};

function ReadonlyField({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={cn('space-y-1', fullWidth && 'md:col-span-2')}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-900 font-medium">{value || '-'}</p>
    </div>
  );
}

export function WarehouseDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = (location.state as DetailData) || {
    id: 'WH-20260623-001',
    status: 'processing',
    statusText: '审核中',
    applyDate: '2026-06-23 10:30',
  };

  // 详情页根据传入的 id 匹配 mock 数据，找不到时用默认数据
  const ctx = (data.id && MOCK_DETAILS[data.id]) || MOCK_DETAIL;
  const isCZCE = ctx.selectedExchanges.includes('CZCE');
  // 按行交易所计算手数标签
  const getLotsLabelForRow = (exchange: string) => {
    if (exchange === 'CZCE' || exchange === 'SHFE') return '预估移仓手数';
    if (exchange === 'DCE' && ctx.dceTransferByQuantity === 'NO') return '预估移仓手数';
    return '移仓手数';
  };
  // 表格列头：所有行一致时用对应标签，混合时用通用标签
  const getLotsHeaderLabel = () => {
    const validPositions = ctx.positions.filter(p => p.varietyName.trim() || p.contractCode.trim());
    if (validPositions.length === 0) return '移仓手数';
    const labels = new Set(validPositions.map(p => getLotsLabelForRow(p.exchange)));
    return labels.size === 1 ? labels.values().next().value : '移仓手数';
  };

  return (
    <div className="w-full mx-auto space-y-5 pb-12 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6 pb-2">
        <button
          onClick={() => navigate('/warehouse-list')}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">移仓申请详情</h1>
            <p className="text-xs text-slate-400 mt-0.5">流水号：{data.id} · 提交时间：{data.applyDate}</p>
          </div>
        </div>
      </div>

      {/* ====== 1. 移仓基本信息 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm" />
            选择移仓的交易所和方向
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {/* Row 1: Exchange + Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-xs text-slate-500">移仓交易所</p>
              <div className="flex flex-wrap gap-1.5">
                {ctx.selectedExchanges.length === 0 ? (
                  <p className="text-sm text-slate-400">-</p>
                ) : (
                  ctx.selectedExchanges.map(exchange => (
                    <span
                      key={exchange}
                      className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-sm text-xs border border-blue-200"
                    >
                      {EXCHANGE_LABELS[exchange]}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">移仓方向</p>
              <p className={cn(
                'text-sm font-medium',
                ctx.direction === 'IN' ? 'text-green-600' : ctx.direction === 'OUT' ? 'text-orange-600' : ctx.direction === 'ACTUAL_CONTROL' ? 'text-blue-600' : 'text-slate-400'
              )}>
              {ctx.direction ? (ctx.direction === 'ACTUAL_CONTROL' 
                ? `${ctx.selectedExchanges.includes('DCE') ? '大商所' : '上期所'}我司实控组移仓（实际控制关系账户之间移仓）`
                : DIRECTION_LABELS[ctx.direction] || ctx.direction) : '-'}
              </p>
            </div>
          </div>

          {/* Row 2: 移出方/移入方信息 */}
          {/* 移出我司：显示移入方信息 */}
          {ctx.direction === 'OUT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ReadonlyField label="移入期货公司会员号" value={ctx.inBrokerMemberId} />
              <ReadonlyField label="移入期货公司名称" value={ctx.inBrokerName} />
              {ctx.selectedExchanges.map(ex => (
                <ReadonlyField key={ex} label={`${EXCHANGE_LABELS[ex]} 移入客户交易编码`} value={ctx.inClientTradingCodes?.[ex] || ''} />
              ))}
              <ReadonlyField label="移入客户全称" value={ctx.inClientName} />
            </div>
          )}

          {/* 移入我司：显示移出方信息 */}
          {ctx.direction === 'IN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ReadonlyField label="移出期货公司会员号" value={ctx.outBrokerMemberId} />
              <ReadonlyField label="移出期货公司名称" value={ctx.outBrokerName} />
              {ctx.selectedExchanges.map(ex => (
                <React.Fragment key={ex}>
                  <ReadonlyField label={`${EXCHANGE_LABELS[ex]} 移出客户交易编码`} value={ctx.outClientTradingCodes?.[ex] || ''} />
                  <ReadonlyField label={`${EXCHANGE_LABELS[ex]} 移出客户全称`} value={ctx.outClientNames?.[ex] || ''} />
                </React.Fragment>
              ))}
            </div>
          )}

          {/* 实控组移仓 */}
          {ctx.direction === 'ACTUAL_CONTROL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ReadonlyField label="实控组-移出账号" value={ctx.actualControlOutAccount} />
              <ReadonlyField label="实控组-移出客户全称" value={ctx.actualControlOutName} />
              <ReadonlyField label="实控组-移入账号" value={ctx.actualControlInAccount} />
              <ReadonlyField label="实控组-移入客户全称" value={ctx.actualControlInName} />
            </div>
          )}

          {/* 交易所特定字段 */}
          {ctx.direction && ctx.direction !== 'ACTUAL_CONTROL' && (ctx.selectedExchanges.length > 1 || ctx.selectedExchanges.includes('DCE') || ctx.selectedExchanges.includes('CZCE') || ctx.selectedExchanges.includes('SHFE')) && (
            <div className="space-y-4">
              {/* 移出我司：统一申请理由 */}
              {ctx.direction === 'OUT' && (
                <ReadonlyField label="申请理由" value={ctx.transferReason} fullWidth />
              )}

              {/* 大商所特定字段 - 非移出我司时显示是否按量移仓 */}
              {ctx.selectedExchanges.includes('DCE') && ctx.direction !== 'OUT' && (
                <ReadonlyField label="大商所是否按量移仓" value={ctx.dceTransferByQuantity === 'YES' ? '是' : ctx.dceTransferByQuantity === 'NO' ? '否' : '-'} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====== 3. 合约明细 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm" />
            合约明细
          </h2>
        </div>
        <div className="p-4 overflow-x-auto">
          {ctx.positions.length === 0 || ctx.positions.every(p => !p.varietyName.trim() && !p.contractCode.trim()) ? (
            <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-sm">
              暂无合约明细
            </div>
          ) : (
            <table className="w-full text-sm border-collapse border border-slate-200">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">交易所</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">品种名称</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">合约代码</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">持仓方向</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">持仓类型</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">{getLotsHeaderLabel()}</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">转移资金（元）</th>
                  <th className="border border-slate-200 py-2.5 px-3 font-medium text-left">备注</th>
                </tr>
              </thead>
              <tbody>
                {ctx.positions.filter(p => p.varietyName.trim() || p.contractCode.trim()).map((pos, idx) => {
                  const isRowCZCE = pos.exchange === 'CZCE';
                  return (
                  <tr key={pos.id}>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900">{pos.exchange ? (EXCHANGE_LABELS[pos.exchange as WarehouseExchange] || pos.exchange) : '-'}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900">{pos.varietyName || '-'}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900 font-medium">{pos.contractCode || '-'}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900">{POSITION_DIR_LABELS[pos.positionDirection] || pos.positionDirection}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900">{isRowCZCE ? '—' : (HEDGE_LABELS[pos.hedgeType] || '-')}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900 font-medium">{pos.lots || '-'}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-900">{pos.transferFunds ? pos.transferFunds.toLocaleString() : '-'}</td>
                    <td className="border border-slate-200 py-2 px-3 text-slate-400">{pos.remark || '-'}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}

          {isCZCE && ctx.positions.length > 0 && ctx.positions.some(p => p.varietyName.trim() || p.contractCode.trim()) && (
            <p className="mt-3 text-xs text-orange-600 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-500 inline-block"></span>
              郑商所仅支持该合约全部持仓转移，不支持部分转移和区分投机/套保类型
            </p>
          )}
        </div>
      </section>

      {/* ====== 4. 补充信息与附件 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm" />
            补充信息与附件
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {/* 补充说明 */}
          <div>
            <p className="text-xs text-slate-500 mb-1">补充说明</p>
            <p className="text-sm text-slate-600 leading-relaxed">{ctx.remark || '-'}</p>
          </div>

          {/* 附件 */}
          <div>
            <p className="text-xs text-slate-500 mb-2">附件资料</p>
            {ctx.attachments.length === 0 ? (
              <p className="text-sm text-slate-400">-</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ctx.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border border-slate-200 rounded-sm hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className={cn('w-5 h-5', file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{file.size}</p>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="下载">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== 5. 流程记录 ====== */}
      <ProcessRecord status={data.status} rejectReason={data.rejectReason} submitDate={data.applyDate} />

      {/* 底部操作 */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" className="rounded-sm px-8" onClick={() => navigate('/warehouse-list')}>
          返回列表
        </Button>
      </div>
    </div>
  );
}
