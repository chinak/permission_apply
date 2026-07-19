import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { UploadCloud, X, FileText, CheckCircle2, Plus, Trash2, FileDown, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';
import { useWarehouseContext, type PositionRow, type WarehouseExchange } from '../store/WarehouseContext';
import { WarehouseConfigPanel } from '../components/WarehouseConfigPanel';
import { LicenseConfirmDialog } from '../components/LicenseConfirmDialog';

const EXCHANGE_OPTIONS = [
  { value: 'DCE', label: '大连商品交易所' },
  { value: 'CZCE', label: '郑州商品交易所' },
  { value: 'SHFE', label: '上海期货交易所' },
];

const DIRECTION_OPTIONS = [
  { value: 'IN', label: '移入我司（持仓从其他期货公司转入国泰君安）' },
  { value: 'OUT', label: '移出我司（持仓从国泰君安转出至其他期货公司）' },
  { value: 'ACTUAL_CONTROL', label: '大商所我司实控组移仓（实际控制关系账户之间移仓）' },
];

const HEDGE_OPTIONS = [
  { value: 'SPEC', label: '投机' },
  { value: 'HEDGE', label: '套保' },
];

// Mock 实控组账号数据库
export const ACTUAL_CONTROL_ACCOUNT_DB: Record<string, string> = {
  '85171680': '张三科技有限公司',
  '95281791': '张三投资合伙企业',
  '95281792': '李四贸易有限公司',
  '85171681': '王五实业有限公司',
  '85171682': '赵六科技集团',
};

const DIRECTION_POSITION_OPTIONS = [
  { value: 'BUY', label: '买' },
  { value: 'SELL', label: '卖' },
  { value: 'ALL', label: '全部' },
];

const YES_NO_OPTIONS = [
  { value: 'YES', label: '是' },
  { value: 'NO', label: '否' },
];

const BUSINESS_TIPS = [
  '移仓前一日结算后可用资金不能为负，账户需处于活跃状态且交易编码正常。',
  '移仓转入的品种，您需在我司已具备相应的交易权限。',
  '移仓当日结算后若出现可用资金为负，我司可能采取提高保证金、限制出金、冻结资金、强行平仓等措施。',
  '移仓后因计算规则差异，逐笔和逐日结算单中的数据可能存在不同。',
  '郑商所同一属性及方向的合约持仓，仅支持全部持仓转移，不支持部分转移和区分投机/套保类型。',
  '交割、期权行权履约等导致持仓变化的业务，可能使移仓失败或结果与申请内容有出入。',
];

const isAfterDeadline = () => new Date().getHours() >= 14;

const EXCHANGE_LABELS: Record<WarehouseExchange, string> = {
  DCE: '大连商品交易所',
  CZCE: '郑州商品交易所',
  SHFE: '上海期货交易所',
};

// ---- Multi-select dropdown for exchanges ----
function MultiSelectExchanges() {
  const { selectedExchanges, toggleExchange, selectAll, deselectAll } = useMultiSelectExchange();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const allSelected = selectedExchanges.length === EXCHANGE_OPTIONS.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            'flex w-full items-center justify-between rounded-sm border border-slate-300 bg-white min-h-[2.25rem] px-3 py-1.5 text-sm',
            'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          )}
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selectedExchanges.length === 0 ? (
              <span className="text-slate-400">请选择交易所</span>
            ) : (
              selectedExchanges.map(exchange => (
                <span
                  key={exchange}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-sm text-xs border border-blue-200"
                >
                  {EXCHANGE_LABELS[exchange]}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExchange(exchange);
                    }}
                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0"
        style={{ width: triggerRef.current ? triggerRef.current.offsetWidth : 'auto' }}
      >
        <div className="p-1">
          <label className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 border-b border-slate-100">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => {
                if (allSelected) {
                  deselectAll();
                } else {
                  selectAll();
                }
              }}
            />
            <span className="text-slate-700 font-medium">全选</span>
          </label>
          {EXCHANGE_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100"
            >
              <Checkbox
                checked={selectedExchanges.includes(opt.value)}
                onCheckedChange={() => toggleExchange(opt.value)}
              />
              <span className="text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---- Hook: bridge between WarehouseContext and MultiSelect ----
function useMultiSelectExchange() {
  const ctx = useWarehouseContext();
  return {
    selectedExchanges: ctx.selectedExchanges,
    selectAll: () => ctx.setSelectedExchanges(EXCHANGE_OPTIONS.map(o => o.value)),
    deselectAll: () => ctx.setSelectedExchanges([]),
    toggleExchange: (ex: WarehouseExchange) => {
      if (ctx.selectedExchanges.includes(ex)) {
        ctx.setSelectedExchanges(ctx.selectedExchanges.filter(e => e !== ex));
      } else {
        ctx.setSelectedExchanges([...ctx.selectedExchanges, ex]);
      }
    },
  };
}

export function WarehouseApply() {
  const navigate = useNavigate();
  const ctx = useWarehouseContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tipsExpanded, setTipsExpanded] = useState(false);
  // 实控组账号查询状态: '' | 'found' | 'notfound' | 'nopermission'
  const [outAccountStatus, setOutAccountStatus] = useState('');
  const [inAccountStatus, setInAccountStatus] = useState('');

  // 实控组账号查询：输入账号后带出全称
  const lookupActualControlAccount = (account: string, isOut: boolean) => {
    const trimmed = account.trim();
    if (!trimmed) {
      if (isOut) { ctx.setActualControlOutName(''); setOutAccountStatus(''); }
      else { ctx.setActualControlInName(''); setInAccountStatus(''); }
      return;
    }
    const name = ACTUAL_CONTROL_ACCOUNT_DB[trimmed];
    if (!name) {
      if (isOut) { ctx.setActualControlOutName(''); setOutAccountStatus('notfound'); }
      else { ctx.setActualControlInName(''); setInAccountStatus('notfound'); }
      return;
    }
    // 权限控制：无权限不能反显
    if (!ctx.hasPermissionForAccount(trimmed)) {
      if (isOut) { ctx.setActualControlOutName(''); setOutAccountStatus('nopermission'); }
      else { ctx.setActualControlInName(''); setInAccountStatus('nopermission'); }
      return;
    }
    if (isOut) { ctx.setActualControlOutName(name); setOutAccountStatus('found'); }
    else { ctx.setActualControlInName(name); setInAccountStatus('found'); }
  };

  const isCZCE = ctx.selectedExchanges.includes('CZCE');
  // 仅选择大商所或上期所时，才能选择实控组移仓
  const canSelectActualControl = ctx.selectedExchanges.length === 1 && (ctx.selectedExchanges.includes('DCE') || ctx.selectedExchanges.includes('SHFE'));

  // 动态计算移仓手数列头：根据每行所属交易所分别决定
  const getLotsLabel = (exchange: string) => {
    if (exchange === 'CZCE' || exchange === 'SHFE') return '预估移仓手数';
    if (exchange === 'DCE' && ctx.dceTransferByQuantity === 'NO') return '预估移仓手数';
    return '移仓手数';
  };

  // 根据选择的交易所自动生成/删除合约明细行
  React.useEffect(() => {
    const selectedSet = new Set<string>(ctx.selectedExchanges);
    // 先过滤掉已被移除的交易所对应的行（exchange 为空的行保留）
    const filteredPositions = ctx.positions.filter(p => !p.exchange || selectedSet.has(p.exchange));
    const positionsChanged = filteredPositions.length !== ctx.positions.length;

    if (ctx.selectedExchanges.length > 0) {
      const existingExchanges = new Set(filteredPositions.filter(p => p.exchange).map(p => p.exchange));
      const missingExchanges = ctx.selectedExchanges.filter(ex => !existingExchanges.has(ex));
      if (missingExchanges.length > 0 && filteredPositions.length === 0) {
        // 首次选择交易所，生成默认行
        const newRows: PositionRow[] = ctx.selectedExchanges.map(ex => ({
          id: Math.random().toString(36).substring(2, 9),
          exchange: ex,
          varietyName: '',
          contractCode: '',
          positionDirection: 'BUY' as PositionRow['positionDirection'],
          hedgeType: (ex === 'CZCE' ? '' : 'SPEC') as PositionRow['hedgeType'],
          lots: 0,
          transferFunds: 0,
          remark: '',
        }));
        ctx.setPositions(newRows);
      } else if (missingExchanges.length > 0) {
        // 追加缺失的交易所行
        const newRows: PositionRow[] = missingExchanges.map(ex => ({
          id: Math.random().toString(36).substring(2, 9),
          exchange: ex,
          varietyName: '',
          contractCode: '',
          positionDirection: 'BUY' as PositionRow['positionDirection'],
          hedgeType: (ex === 'CZCE' ? '' : 'SPEC') as PositionRow['hedgeType'],
          lots: 0,
          transferFunds: 0,
          remark: '',
        }));
        ctx.setPositions([...filteredPositions, ...newRows]);
      } else if (positionsChanged) {
        // 仅有行被删除，无新增行
        ctx.setPositions(filteredPositions);
      }
    } else if (positionsChanged) {
      // 所有交易所都被取消，清空有交易所的行
      ctx.setPositions(filteredPositions);
    }
  }, [ctx.selectedExchanges]);

  const addPosition = () => {
    const newRow: PositionRow = {
      id: Math.random().toString(36).substring(2, 9),
      exchange: '',
      varietyName: '',
      contractCode: '',
      positionDirection: 'BUY',
      hedgeType: isCZCE ? '' : 'SPEC',
      lots: 0,
      transferFunds: 0,
      remark: '',
    };
    ctx.setPositions([...ctx.positions, newRow]);
  };

  const updatePosition = (id: string, field: keyof PositionRow, value: any) => {
    ctx.setPositions(ctx.positions.map(p => {
      if (p.id !== id) return p;
      const next = { ...p, [field]: value };
      if (p.exchange === 'CZCE') { next.hedgeType = ''; }
      return next;
    }));
  };

  const removePosition = (id: string) => {
    ctx.setPositions(ctx.positions.filter(p => p.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(2)} MB` }));
      ctx.setAttachments([...ctx.attachments, ...newFiles]);
    }
  };

  const removeAttachment = (idx: number) => {
    ctx.setAttachments(ctx.attachments.filter((_, i) => i !== idx));
  };

  const validation = useMemo(() => {
    const msgs: Record<string, string> = {};
    if (ctx.selectedExchanges.length === 0) msgs.exchange = '请至少选择一个移仓交易所';
    if (!ctx.direction) msgs.direction = '请选择移仓方向';

    if (ctx.direction === 'ACTUAL_CONTROL') {
      if (!ctx.actualControlOutAccount.trim()) msgs.actualControlOutAccount = '请输入实控组-移出账号';
      if (!ctx.actualControlOutName.trim()) msgs.actualControlOutName = '请输入实控组-移出客户全称';
      if (!ctx.actualControlInAccount.trim()) msgs.actualControlInAccount = '请输入实控组-移入账号';
      if (!ctx.actualControlInName.trim()) msgs.actualControlInName = '请输入实控组-移入客户全称';
    } else if (ctx.direction === 'OUT') {
      if (!ctx.inBrokerMemberId.trim()) msgs.inBrokerMemberId = '请输入移入期货公司会员号';
      if (!ctx.inBrokerName.trim()) msgs.inBrokerName = '请输入移入期货公司名称';
      ctx.selectedExchanges.forEach(ex => {
        if (!(ctx.inClientTradingCodes[ex] || '').trim()) {
          msgs[`inClientTradingCode_${ex}`] = `请输入${EXCHANGE_LABELS[ex]}移入客户交易编码`;
        }
      });
      if (!ctx.inClientName.trim()) msgs.inClientName = '请输入移入客户全称';
    } else if (ctx.direction === 'IN') {
      if (!ctx.outBrokerMemberId.trim()) msgs.outBrokerMemberId = '请输入移出期货公司会员号';
      if (!ctx.outBrokerName.trim()) msgs.outBrokerName = '请输入移出期货公司名称';
      ctx.selectedExchanges.forEach(ex => {
        if (!(ctx.outClientTradingCodes[ex] || '').trim()) {
          msgs[`outClientTradingCode_${ex}`] = `请输入${EXCHANGE_LABELS[ex]}移出客户交易编码`;
        }
        if (!(ctx.outClientNames[ex] || '').trim()) {
          msgs[`outClientName_${ex}`] = `请输入${EXCHANGE_LABELS[ex]}移出客户全称`;
        }
      });
    }

    // 移出我司申请理由验证（统一一个输入框）
    if (ctx.direction === 'OUT') {
      if (!ctx.transferReason.trim()) {
        msgs.transferReason = '请填写申请理由';
      }
    }

    // 大商所特定字段验证（实控组移仓不需要填写）
    if (ctx.direction !== 'ACTUAL_CONTROL' && ctx.selectedExchanges.includes('DCE')) {
      // 非移出我司：需要填写是否按量移仓
      if (ctx.direction !== 'OUT') {
        if (!ctx.dceTransferByQuantity) {
          msgs.dceTransferByQuantity = '请选择大商所是否按量移仓';
        }
      }
    }

    if (ctx.positions.length === 0) msgs.positions = '请至少添加一条需移仓的合约';
    ctx.positions.forEach((pos, idx) => {
      if (!pos.varietyName.trim()) msgs[`pos_${idx}_name`] = '请输入品种名称';
      if (!pos.contractCode.trim()) msgs[`pos_${idx}_code`] = '请输入合约代码';
      if (!pos.lots || pos.lots <= 0) msgs[`pos_${idx}_lots`] = '手数必须大于 0';
    });

    if (!ctx.confirmed) msgs.confirmed = '请阅读并勾选确认声明';

    return msgs;
  }, [ctx]);

  const isFormValid = Object.keys(validation).length === 0;

  const handleSubmit = () => {
    setErrors(validation);
    if (!isFormValid) {
      const firstKey = Object.keys(validation)[0];
      document.querySelector(`[data-error="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setConfirmOpen(true);
  };

  // 当交易所选择不满足实控组条件时，自动清除实控组方向选择
  React.useEffect(() => {
    if (!canSelectActualControl && ctx.direction === 'ACTUAL_CONTROL') {
      ctx.setDirection('');
    }
  }, [canSelectActualControl]);

  const fieldError = (key: string) => errors[key] ? 'border-red-300 focus-visible:ring-red-200' : '';

  return (
    <div className="w-full mx-auto space-y-5 pb-32 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6 pb-2">
        <h1 className="text-lg font-bold text-slate-800">交易所移仓业务申请</h1>
      </div>

      {/* ====== 1. 移仓基本信息 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            选择移仓的交易所和方向
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {/* Row 1: Exchange + Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2" data-error="exchange">
              <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移仓交易所</Label>
              <MultiSelectExchanges />
              {errors.exchange && <p className="text-xs text-red-500">{errors.exchange}</p>}
            </div>
            <div className="space-y-2" data-error="direction">
              <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移仓方向</Label>
              <Select value={ctx.direction} onValueChange={(v) => ctx.setDirection(v as any)}>
                <SelectTrigger className="rounded-sm h-9">
                  <SelectValue placeholder="请选择方向" />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTION_OPTIONS.filter(o => {
                    // 如果是实控组选项，检查是否满足条件
                    if (o.value === 'ACTUAL_CONTROL') {
                      return canSelectActualControl; // 只有满足条件时才显示
                    }
                    return true;
                  }).map(o => {
                    let label = o.label;
                    if (o.value === 'ACTUAL_CONTROL') {
                      const exLabel = ctx.selectedExchanges.includes('DCE') ? '大商所' : '上期所';
                      label = `${exLabel}我司实控组移仓（实际控制关系账户之间移仓）`;
                    }
                    return <SelectItem key={o.value} value={o.value}>{label}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              {errors.direction && <p className="text-xs text-red-500">{errors.direction}</p>}
            </div>
          </div>

          {/* Row 2: 移出方/移入方信息 */}
          {/* 移出我司：需要填写移入方信息（移入期货公司、移入客户） */}
          {ctx.direction === 'OUT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2" data-error="inBrokerMemberId">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移入期货公司会员号</Label>
                <Input
                  placeholder="请输入移入期货公司会员号"
                  value={ctx.inBrokerMemberId}
                  onChange={(e) => ctx.setInBrokerMemberId(e.target.value)}
                  className={cn('rounded-sm', fieldError('inBrokerMemberId'))}
                />
                {errors.inBrokerMemberId && <p className="text-xs text-red-500">{errors.inBrokerMemberId}</p>}
              </div>
              <div className="space-y-2" data-error="inBrokerName">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移入期货公司名称</Label>
                <Input
                  placeholder="请输入移入期货公司名称"
                  value={ctx.inBrokerName}
                  onChange={(e) => ctx.setInBrokerName(e.target.value)}
                  className={cn('rounded-sm', fieldError('inBrokerName'))}
                />
                {errors.inBrokerName && <p className="text-xs text-red-500">{errors.inBrokerName}</p>}
              </div>
              {ctx.selectedExchanges.map(ex => (
                <div className="space-y-2" data-error={`inClientTradingCode_${ex}`} key={ex}>
                  <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>{EXCHANGE_LABELS[ex]} 移入客户交易编码</Label>
                  <Input
                    placeholder={`请输入${EXCHANGE_LABELS[ex]}移入客户交易编码`}
                    value={ctx.inClientTradingCodes[ex] || ''}
                    onChange={(e) => ctx.setInClientTradingCodes({ ...ctx.inClientTradingCodes, [ex]: e.target.value })}
                    className={cn('rounded-sm', fieldError(`inClientTradingCode_${ex}`))}
                  />
                  {errors[`inClientTradingCode_${ex}`] && <p className="text-xs text-red-500">{errors[`inClientTradingCode_${ex}`]}</p>}
                </div>
              ))}
              <div className="space-y-2" data-error="inClientName">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移入客户全称</Label>
                <Input
                  placeholder="请输入移入客户全称"
                  value={ctx.inClientName}
                  onChange={(e) => ctx.setInClientName(e.target.value)}
                  className={cn('rounded-sm', fieldError('inClientName'))}
                />
                {errors.inClientName && <p className="text-xs text-red-500">{errors.inClientName}</p>}
              </div>
            </div>
          )}

          {/* 移入我司：需要填写移出方信息（移出期货公司、移出客户） */}
          {ctx.direction === 'IN' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2" data-error="outBrokerMemberId">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移出期货公司会员号</Label>
                <Input
                  placeholder="请输入移出期货公司会员号"
                  value={ctx.outBrokerMemberId}
                  onChange={(e) => ctx.setOutBrokerMemberId(e.target.value)}
                  className={cn('rounded-sm', fieldError('outBrokerMemberId'))}
                />
                {errors.outBrokerMemberId && <p className="text-xs text-red-500">{errors.outBrokerMemberId}</p>}
              </div>
              <div className="space-y-2" data-error="outBrokerName">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>移出期货公司名称</Label>
                <Input
                  placeholder="请输入移出期货公司名称"
                  value={ctx.outBrokerName}
                  onChange={(e) => ctx.setOutBrokerName(e.target.value)}
                  className={cn('rounded-sm', fieldError('outBrokerName'))}
                />
                {errors.outBrokerName && <p className="text-xs text-red-500">{errors.outBrokerName}</p>}
              </div>
              {ctx.selectedExchanges.map(ex => (
                <React.Fragment key={ex}>
                  <div className="space-y-2" data-error={`outClientTradingCode_${ex}`}>
                    <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>{EXCHANGE_LABELS[ex]} 移出客户交易编码</Label>
                    <Input
                      placeholder={`请输入${EXCHANGE_LABELS[ex]}移出客户交易编码`}
                      value={ctx.outClientTradingCodes[ex] || ''}
                      onChange={(e) => ctx.setOutClientTradingCodes({ ...ctx.outClientTradingCodes, [ex]: e.target.value })}
                      className={cn('rounded-sm', fieldError(`outClientTradingCode_${ex}`))}
                    />
                    {errors[`outClientTradingCode_${ex}`] && <p className="text-xs text-red-500">{errors[`outClientTradingCode_${ex}`]}</p>}
                  </div>
                  <div className="space-y-2" data-error={`outClientName_${ex}`}>
                    <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>{EXCHANGE_LABELS[ex]} 移出客户全称</Label>
                    <Input
                      placeholder={`请输入${EXCHANGE_LABELS[ex]}移出客户全称`}
                      value={ctx.outClientNames[ex] || ''}
                      onChange={(e) => ctx.setOutClientNames({ ...ctx.outClientNames, [ex]: e.target.value })}
                      className={cn('rounded-sm', fieldError(`outClientName_${ex}`))}
                    />
                    {errors[`outClientName_${ex}`] && <p className="text-xs text-red-500">{errors[`outClientName_${ex}`]}</p>}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* 交易所特定字段 - 仅当交易所和方向都选择了才显示，实控组移仓除外 */}
          {ctx.direction && ctx.direction !== 'ACTUAL_CONTROL' && (ctx.selectedExchanges.length > 1 || ctx.selectedExchanges.includes('DCE') || ctx.selectedExchanges.includes('CZCE') || ctx.selectedExchanges.includes('SHFE')) && (
            <div className="space-y-4">
          {/* 移出我司：统一申请理由输入框 */}
          {ctx.direction === 'OUT' && (
            <div data-error="transferReason">
              <Label className="text-sm font-medium text-slate-700">
                <span className="text-red-500 mr-1">*</span>申请理由
              </Label>
              <textarea
                rows={3}
                placeholder="请说明移仓原因"
                value={ctx.transferReason}
                onChange={(e) => ctx.setTransferReason(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none mt-1.5',
                  fieldError('transferReason')
                )}
              />
              {errors.transferReason && <p className="text-xs text-red-500 mt-1">{errors.transferReason}</p>}
            </div>
          )}

          {/* 大商所特定字段 - 非移出我司时显示是否按量移仓 */}
          {ctx.selectedExchanges.includes('DCE') && ctx.direction !== 'OUT' && (
            <div data-error="dceTransferByQuantity">
              <Label className="text-sm font-medium text-slate-700">
                <span className="text-red-500 mr-1">*</span>大商所是否按量移仓
              </Label>
              <Select value={ctx.dceTransferByQuantity} onValueChange={(v) => ctx.setDceTransferByQuantity(v as any)}>
                <SelectTrigger className="rounded-sm h-9 mt-1.5">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dceTransferByQuantity && <p className="text-xs text-red-500 mt-1">{errors.dceTransferByQuantity}</p>}
            </div>
          )}
            </div>
          )}

          {ctx.direction === 'ACTUAL_CONTROL' && (
            <div className="space-y-5">
              {/* 权限提示：已改为按账号独立控制，不再显示全局提示 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2" data-error="actualControlOutAccount">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>实控组-移出账号</Label>
                <Input
                  placeholder="请输入移出账号"
                  value={ctx.actualControlOutAccount}
                  onChange={(e) => { ctx.setActualControlOutAccount(e.target.value); setOutAccountStatus(''); ctx.setActualControlOutName(''); }}
                  onBlur={() => lookupActualControlAccount(ctx.actualControlOutAccount, true)}
                  className={cn('rounded-sm', fieldError('actualControlOutAccount'))}
                />
                {outAccountStatus === 'notfound' && <p className="text-xs text-red-500">账号不存在，请检查后重新输入</p>}
                {outAccountStatus === 'nopermission' && <p className="text-xs text-orange-600">无权限查看该账号信息</p>}
                {errors.actualControlOutAccount && <p className="text-xs text-red-500">{errors.actualControlOutAccount}</p>}
              </div>
              <div className="space-y-2" data-error="actualControlOutName">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>实控组-移出客户全称</Label>
                <Input
                  placeholder={outAccountStatus === 'nopermission' ? '无权限查看' : '输入账号后自动带出'}
                  value={ctx.actualControlOutName}
                  onChange={(e) => ctx.setActualControlOutName(e.target.value)}
                  readOnly={outAccountStatus === 'found'}
                  className={cn('rounded-sm', outAccountStatus === 'found' && 'bg-slate-50 text-slate-600', fieldError('actualControlOutName'))}
                />
                {errors.actualControlOutName && <p className="text-xs text-red-500">{errors.actualControlOutName}</p>}
              </div>
              <div className="space-y-2" data-error="actualControlInAccount">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>实控组-移入账号</Label>
                <Input
                  placeholder="请输入移入账号"
                  value={ctx.actualControlInAccount}
                  onChange={(e) => { ctx.setActualControlInAccount(e.target.value); setInAccountStatus(''); ctx.setActualControlInName(''); }}
                  onBlur={() => lookupActualControlAccount(ctx.actualControlInAccount, false)}
                  className={cn('rounded-sm', fieldError('actualControlInAccount'))}
                />
                {inAccountStatus === 'notfound' && <p className="text-xs text-red-500">账号不存在，请检查后重新输入</p>}
                {inAccountStatus === 'nopermission' && <p className="text-xs text-orange-600">无权限查看该账号信息</p>}
                {errors.actualControlInAccount && <p className="text-xs text-red-500">{errors.actualControlInAccount}</p>}
              </div>
              <div className="space-y-2" data-error="actualControlInName">
                <Label className="text-sm font-medium text-slate-700"><span className="text-red-500 mr-1">*</span>实控组-移入客户全称</Label>
                <Input
                  placeholder={inAccountStatus === 'nopermission' ? '无权限查看' : '输入账号后自动带出'}
                  value={ctx.actualControlInName}
                  onChange={(e) => ctx.setActualControlInName(e.target.value)}
                  readOnly={inAccountStatus === 'found'}
                  className={cn('rounded-sm', inAccountStatus === 'found' && 'bg-slate-50 text-slate-600', fieldError('actualControlInName'))}
                />
                {errors.actualControlInName && <p className="text-xs text-red-500">{errors.actualControlInName}</p>}
              </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====== 3. 合约明细 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200" data-error="positions">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            合约明细
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addPosition} className="rounded-sm text-blue-600 border-blue-200 hover:bg-blue-50 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> 添加一行
          </Button>
        </div>
        <div className="p-4 overflow-x-auto">
          {errors.positions && <p className="text-xs text-red-500 mb-3">{errors.positions}</p>}

          {ctx.positions.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-sm">
              暂无合约明细，请点击右上角「添加一行」按钮
            </div>
          ) : (
            <div className="space-y-3">
              {ctx.positions.map((pos, idx) => {
                const isRowCZCE = pos.exchange === 'CZCE';
                return (
                <div key={pos.id} className="flex flex-wrap items-end gap-3 p-3 bg-slate-50/50 border border-slate-200 rounded-sm">
                  {/* 交易所 */}
                  <div className="space-y-1" style={{ minWidth: 120 }}>
                    <Label className="text-xs text-slate-500">交易所</Label>
                    <select
                      value={pos.exchange}
                      onChange={(e) => updatePosition(pos.id, 'exchange', e.target.value)}
                      className="w-full h-8 px-2 border border-slate-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      {EXCHANGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  {/* 品种名称 */}
                  <div className="space-y-1 min-w-0 flex-1" data-error={`pos_${idx}_name`}>
                    <Label className="text-xs text-slate-500">品种名称</Label>
                    <Input value={pos.varietyName} onChange={(e) => updatePosition(pos.id, 'varietyName', e.target.value)} className={cn('rounded-sm h-8', fieldError(`pos_${idx}_name`))} />
                  </div>
                  {/* 合约代码 */}
                  <div className="space-y-1 min-w-0 flex-1" data-error={`pos_${idx}_code`}>
                    <Label className="text-xs text-slate-500">合约代码</Label>
                    <Input value={pos.contractCode} onChange={(e) => updatePosition(pos.id, 'contractCode', e.target.value)} className={cn('rounded-sm h-8', fieldError(`pos_${idx}_code`))} />
                  </div>
                  {/* 持仓方向 */}
                  <div className="space-y-1" style={{ minWidth: 80 }}>
                    <Label className="text-xs text-slate-500">持仓方向</Label>
                    <select
                      value={pos.positionDirection}
                      onChange={(e) => updatePosition(pos.id, 'positionDirection', e.target.value)}
                      className="w-full h-8 px-2 border border-slate-300 rounded-sm text-sm"
                    >
                      {DIRECTION_POSITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  {/* 持仓类型 */}
                  <div className="space-y-1" style={{ minWidth: 80 }}>
                    <Label className="text-xs text-slate-500">持仓类型</Label>
                    {isRowCZCE ? (
                      <select
                        disabled
                        value=""
                        className="w-full h-8 px-2 border border-slate-200 rounded-sm text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
                      >
                        <option value="">—</option>
                      </select>
                    ) : (
                      <select
                        value={pos.hedgeType}
                        onChange={(e) => updatePosition(pos.id, 'hedgeType', e.target.value)}
                        className="w-full h-8 px-2 border border-slate-300 rounded-sm text-sm"
                      >
                        {HEDGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    )}
                  </div>
                  {/* 手数 */}
                  <div className="space-y-1" style={{ minWidth: 80 }} data-error={`pos_${idx}_lots`}>
                    <Label className="text-xs text-slate-500">{getLotsLabel(pos.exchange)}</Label>
                    <Input type="number" min={0} value={pos.lots || ''} onChange={(e) => updatePosition(pos.id, 'lots', Number(e.target.value))} className={cn('rounded-sm h-8', fieldError(`pos_${idx}_lots`))} />
                  </div>
                  {/* 转移资金 */}
                  <div className="space-y-1" style={{ minWidth: 120 }}>
                    <Label className="text-xs text-slate-500">转移资金（元）</Label>
                    <Input type="number" min={0} placeholder="选填" value={pos.transferFunds || ''} onChange={(e) => updatePosition(pos.id, 'transferFunds', Number(e.target.value))} className="rounded-sm h-8" />
                  </div>
                  {/* 操作 */}
                  <div className="space-y-1 flex items-end pb-0.5">
                    <button onClick={() => removePosition(pos.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors" title="删除此行">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}

          {/* CZCE note */}
          {isCZCE && ctx.positions.length > 0 && (
            <p className="mt-3 text-xs text-orange-600 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-500 inline-block"></span>
              郑商所仅支持该合约全部持仓转移，不支持部分转移和区分投机/套保类型
            </p>
          )}
        </div>
      </section>

      {/* ====== 4. 补充信息 & 附件 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            补充信息与附件<span className="text-slate-400 font-normal text-xs ml-1">（选填）</span>
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {/* 备注 */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">补充说明<span className="text-slate-400 font-normal ml-1">（选填）</span></Label>
            <textarea
              rows={3}
              placeholder="如有特殊说明，如：实控关系组内转移等，请在此处说明"
              value={ctx.remark}
              onChange={(e) => ctx.setRemark(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* 附件 */}
          <div>
            <button
              type="button"
              className="border border-dashed border-slate-300 rounded-sm bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center justify-center py-6 w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-slate-700 text-sm font-medium mb-1">点击或将文件拖拽至此处上传</p>
              <p className="text-slate-400 text-xs">支持 JPG, PNG, PDF, DOC 格式，单个文件不超过 10MB</p>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
            </button>
            {ctx.attachments.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">已上传附件</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ctx.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAttachment(idx); }}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== 5. 业务提示（可折叠） ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <button
          type="button"
          className="w-full px-5 py-3 flex items-center justify-between text-left"
          onClick={() => setTipsExpanded(!tipsExpanded)}
        >
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            业务办理须知
          </h2>
          <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', tipsExpanded && 'rotate-180')} />
        </button>
        {tipsExpanded && (
          <div className="px-5 pb-5 border-t border-slate-100">
            <ol className="pt-4 space-y-1.5 text-sm text-slate-600 list-decimal pl-4">
              {BUSINESS_TIPS.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ol>
          </div>
        )}
      </section>

      {/* ====== 6. 确认声明 ====== */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200" data-error="confirmed">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Checkbox id="warehouse-confirm" checked={ctx.confirmed} onCheckedChange={(c) => ctx.setConfirmed(!!c)} />
            <Label htmlFor="warehouse-confirm" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
              <span className="text-red-500 mr-1">*</span>本人/本单位确认，以上申请内容真实有效。本人/本单位已知晓并同意贵司有权根据市场行情及账户情况拒绝办理移仓业务，由此带来的一切后果由本人/本单位承担。
            </Label>
          </div>
          {errors.confirmed && <p className="text-xs text-red-500 mt-2">{errors.confirmed}</p>}
        </div>
      </section>

      {/* ====== 提交按钮栏 ====== */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button
          size="lg"
          className="rounded-sm px-8"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          提交申请
        </Button>
      </div>

      {/* 营业执照信息确认弹窗 */}
      <LicenseConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => setSuccessOpen(true)}
      />

      {/* 提交成功弹窗 */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md rounded-sm p-6 border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg text-slate-800 mb-2">提交成功</DialogTitle>
              <DialogDescription className="text-slate-600 text-sm leading-relaxed mb-6">
                您的移仓业务申请已提交成功！运营中心将在审核后向您反馈办理结果，预计 1-2 个工作日。
              </DialogDescription>
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="rounded-sm px-6" onClick={() => { setSuccessOpen(false); navigate('/'); }}>
                  返回首页
                </Button>
                <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={() => { setSuccessOpen(false); navigate('/warehouse-list'); }}>
                  查看办理进度
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <WarehouseConfigPanel />
    </div>
  );
}
