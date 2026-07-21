import React, { useState, useEffect } from 'react';
import { Download, Eye, ChevronDown, FileText, RefreshCw, User, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from './ui/Dialog';
import { getEnabledReasons } from '../utils/mockData';

type Field = { label: string; value: string; danger?: boolean };

// 申请内容层级结构：交易所编码（父）→ 具体权限（子）
type PermNode = { name: string; hasPermission: boolean; original: boolean; checked: boolean };
type ExchangeNode = { exchange: string; code: string; codeOriginal: boolean; codeChecked: boolean; codeWithPerm?: boolean; permissions: PermNode[] };

// 初始申请内容（original = 客户提交时的勾选，业务人员只能在此基础上取消勾选）
const buildInitialApplyContent = (): ExchangeNode[] => [
  {
    exchange: '上海期货交易所', code: '0012345', codeOriginal: false, codeChecked: false,
    permissions: [
      { name: '特定品种', hasPermission: true, original: true, checked: true },
      { name: '商品期权', hasPermission: false, original: false, checked: false },
    ],
  },
  {
    exchange: '大连商品交易所', code: '0034567', codeOriginal: true, codeChecked: true,
    permissions: [
      { name: '特定品种', hasPermission: true, original: true, checked: true },
      { name: '商品期权', hasPermission: false, original: false, checked: false },
    ],
  },
  {
    exchange: '郑州商品交易所', code: '0023456', codeOriginal: false, codeChecked: false,
    permissions: [
      { name: '特定品种', hasPermission: true, original: true, checked: true },
      { name: '商品期权', hasPermission: true, original: true, checked: true },
    ],
  },
  {
    exchange: '上海国际能源交易中心', code: '0045678', codeOriginal: false, codeChecked: false,
    permissions: [
      { name: '原油品种', hasPermission: true, original: true, checked: true },
      { name: '非原油品种', hasPermission: true, original: false, checked: false },
    ],
  },
  {
    exchange: '中国金融期货交易所', code: '0056789', codeOriginal: true, codeChecked: true, codeWithPerm: true,
    permissions: [],
  },
];

// 全量权限表（展示客户当前各交易所的权限持有情况）
const FULL_EXCHANGE_PERMISSIONS = [
  {
    id: 'czce', name: '郑州商品交易所', shortName: '郑商所',
    permissions: [
      { id: 'czce_opt', name: '郑州期权', checked: true },
      { id: 'pta', name: 'PTA', checked: true },
      { id: 'rapeseed', name: '菜籽花生', checked: true },
      { id: 'px_old', name: '对二甲苯瓶片短纤(旧)', checked: true },
      { id: 'px', name: '对二甲苯瓶片短纤', checked: true },
    ],
  },
  {
    id: 'dce', name: '大连商品交易所', shortName: '大商所',
    permissions: [
      { id: 'dce_opt', name: '大连期权', checked: true },
      { id: 'iron', name: '铁矿石', checked: true },
      { id: 'palm', name: '棕榈油', checked: true },
      { id: 'soy', name: '豆类特定品种', checked: true },
    ],
  },
  {
    id: 'shfe', name: '上海期货交易所', shortName: '上期所',
    permissions: [
      { id: 'shfe_opt', name: '上海期权', checked: true },
      { id: 'nickel_1d', name: '镍（旧）', checked: true },
      { id: 'nickel', name: '镍', checked: true },
    ],
  },
  {
    id: 'gfex', name: '广州期货交易所', shortName: '广期所',
    permissions: [
      { id: 'gfex_opt', name: '广州期权', checked: false },
      { id: 'lithium_old', name: '碳酸锂（旧）', checked: false },
      { id: 'lithium', name: '碳酸锂', checked: false },
    ],
  },
  {
    id: 'ine', name: '上海国际能源交易中心', shortName: '能源中心',
    permissions: [
      { id: 'ine_100k_opt', name: '能源中心10万商品期权', checked: true },
      { id: 'ine_100k_spec', name: '能源中心10万特定品种', checked: true },
      { id: 'crude_futures', name: '原油期货', checked: true },
      { id: 'crude_options', name: '原油期权', checked: true },
    ],
  },
  {
    id: 'cffex', name: '中国金融期货交易所', shortName: '中金所',
    permissions: [
      { id: 'stock_idx_futures', name: '股指期货', checked: true },
      { id: 'stock_idx_options', name: '股指期权', checked: true },
      { id: 'treasury_futures', name: '国债期货', checked: true },
    ],
  },
];

// 可复用的标签/值网格：每个单元格上方为标签（浅色底），下方为值；空值显示红色“空”
function FieldGrid({ fields, gridClass }: { fields: Field[]; gridClass: string }) {
  return (
    <div className={`grid ${gridClass} border-l border-t border-slate-200`}>
      {fields.map((f, i) => (
        <div key={i} className="border-r border-b border-slate-200 min-w-0">
          <div className="px-3 py-2 bg-slate-50 text-xs font-medium text-slate-500 text-center border-b border-slate-200 truncate" title={f.label}>
            {f.label}
          </div>
          <div className="px-3 py-3 text-sm text-center truncate" title={f.value || undefined}>
            {f.value === '' || f.value == null
              ? <span className="text-red-500 font-medium">空</span>
              : <span className={f.danger ? 'text-red-500 font-medium' : 'text-slate-700'}>{f.value}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function IdCardImage({ side, className }: { side: 'front' | 'back'; className?: string }) {
  return (
    <svg viewBox="0 0 340 214" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect x="1" y="1" width="338" height="212" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      {side === 'front' ? (
        <>
          <text x="24" y="40" fill="#334155" fontSize="15" fontWeight="600">居民身份证</text>
          {/* 字段占位 */}
          <g fill="#94a3b8">
            <rect x="24" y="62" width="40" height="9" rx="2" />
            <rect x="74" y="62" width="70" height="9" rx="2" fill="#cbd5e1" />
            <rect x="24" y="86" width="40" height="9" rx="2" />
            <rect x="74" y="86" width="50" height="9" rx="2" fill="#cbd5e1" />
            <rect x="24" y="110" width="40" height="9" rx="2" />
            <rect x="74" y="110" width="110" height="9" rx="2" fill="#cbd5e1" />
            <rect x="24" y="134" width="160" height="9" rx="2" fill="#cbd5e1" />
          </g>
          {/* 公民身份号码 */}
          <text x="24" y="180" fill="#64748b" fontSize="10">公民身份号码</text>
          <rect x="24" y="188" width="200" height="11" rx="2" fill="#94a3b8" />
          {/* 照片框 */}
          <rect x="244" y="56" width="76" height="100" rx="4" fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx="282" cy="92" r="18" fill="#cbd5e1" />
          <path d="M258 150c0-16 12-26 24-26s24 10 24 26z" fill="#cbd5e1" />
        </>
      ) : (
        <>
          {/* 国徽占位 */}
          <circle cx="170" cy="58" r="22" fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx="170" cy="58" r="9" fill="#cbd5e1" />
          <text x="170" y="104" fill="#334155" fontSize="14" fontWeight="600" textAnchor="middle">中华人民共和国</text>
          <text x="170" y="124" fill="#334155" fontSize="13" fontWeight="600" textAnchor="middle">居民身份证</text>
          <g fill="#94a3b8">
            <rect x="70" y="150" width="56" height="9" rx="2" />
            <rect x="136" y="150" width="134" height="9" rx="2" fill="#cbd5e1" />
            <rect x="70" y="172" width="56" height="9" rx="2" />
            <rect x="136" y="172" width="110" height="9" rx="2" fill="#cbd5e1" />
          </g>
        </>
      )}
    </svg>
  );
}

interface CancelProcessDialogProps {
  app: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // mode = 'process'（默认）：底部显示【办理失败】【审批通过】，适用于发起处理的页面；
  // mode = 'view'：底部仅【关闭】，适用于业务办理查询等只读查看场景。
  mode?: 'process' | 'view';
}

export function CancelProcessDialog({ app, open, onOpenChange, mode = 'process' }: CancelProcessDialogProps) {
  const [applyContent, setApplyContent] = useState<ExchangeNode[]>([]);
  const [previewSide, setPreviewSide] = useState<'front' | 'back' | null>(null);

  // 同步操作状态：注销编码(CAP) / 注销权限(CTP)，提交后记录操作人与时间，同步到操作日志
  const [syncState, setSyncState] = useState<{
    cap: { done: boolean; time: string };
    ctp: { done: boolean; time: string };
  }>({ cap: { done: false, time: '' }, ctp: { done: false, time: '' } });
  const [syncConfirm, setSyncConfirm] = useState<'cap' | 'ctp' | null>(null);

  // 办理失败确认弹窗（参考交易权限申请）
  const [actionModalState, setActionModalState] = useState<{
    isOpen: boolean;
    type: 'fail' | '';
    selectedReasonId: string;
    customReason: string;
  }>({ isOpen: false, type: '', selectedReasonId: '', customReason: '' });

  const enabledReasons = getEnabledReasons('trade_permission');
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  // 每次打开处理界面时，按当前记录重置申请内容与同步状态
  useEffect(() => {
    if (open) {
      setApplyContent(buildInitialApplyContent());
      setSyncState({ cap: { done: false, time: '' }, ctp: { done: false, time: '' } });
    }
  }, [open, app]);

  const openActionModal = (type: 'fail') => {
    setActionModalState({ isOpen: true, type, selectedReasonId: '', customReason: '' });
  };

  const closeActionModal = () => {
    setActionModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleActionConfirm = () => {
    const finalReason = actionModalState.selectedReasonId === 'other'
      ? actionModalState.customReason
      : enabledReasons.find(r => r.id === actionModalState.selectedReasonId)?.content;
    alert(`操作：办理失败\n原因：${finalReason || '无'}`);
    closeActionModal();
    onOpenChange(false);
  };

  const handleApprove = () => {
    setIsApproveOpen(true);
  };

  const handleApproveConfirm = () => {
    setIsApproveOpen(false);
    onOpenChange(false);
  };

  // 确认同步：记录提交时间并同步到操作日志
  const handleSyncConfirm = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    if (syncConfirm === 'cap') setSyncState(prev => ({ ...prev, cap: { done: true, time: ts } }));
    if (syncConfirm === 'ctp') setSyncState(prev => ({ ...prev, ctp: { done: true, time: ts } }));
    setSyncConfirm(null);
  };

  // 切换父级编码：仅当客户原本勾选了编码时可操作（只能取消、可恢复）
  const toggleCode = (exIdx: number) => {
    setApplyContent(prev => prev.map((ex, i) => {
      if (i !== exIdx || !ex.codeOriginal) return ex;
      const next = !ex.codeChecked;
      return {
        ...ex,
        codeChecked: next,
        // 注销编码→全部持有权限随之注销；取消编码时权限保持当前勾选（可单独调整）
        permissions: next
          ? ex.permissions.map(p => p.hasPermission ? { ...p, checked: true } : p)
          : ex.permissions,
      };
    }));
  };

  // 切换子级权限：仅当客户原本勾选且编码未锁定时可操作
  const togglePerm = (exIdx: number, pIdx: number) => {
    setApplyContent(prev => prev.map((ex, i) => {
      if (i !== exIdx || ex.codeChecked) return ex;
      return {
        ...ex,
        permissions: ex.permissions.map((p, j) =>
          j === pIdx && p.hasPermission && p.original ? { ...p, checked: !p.checked } : p
        ),
      };
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[65vw] w-full h-[90vh] p-0 border-none rounded-sm overflow-hidden bg-slate-50 flex flex-col gap-0">
          <DialogDescription className="sr-only">注销交易编码/权限申请的处理审批界面。</DialogDescription>
          {/* Sticky modal header */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-20">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-wide">注销交易编码/权限 - 处理</DialogTitle>
            {app && (
              <span className="ml-3 text-xs text-slate-400 font-mono">{app.id}</span>
            )}
          </div>
          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
            {app && (() => {
              // 详情数据（部分取自列表记录，其余为模拟值）
              const detail = {
                account: app.account,
                name: app.name,
                branch: app.branch,
                branchGroup: app.branchGroup,
                applyDate: app.applyDate,
                status: app.status,
              };

              const summaryFields: Field[] = [
                { label: '资金账号', value: detail.account },
                { label: '姓名', value: detail.name },
                { label: '营业部', value: detail.branch },
                { label: '营业部组织架构分组', value: detail.branchGroup },
                { label: '申请日期', value: detail.applyDate },
                { label: '办理状态', value: detail.status },
              ];

              const basicFields: Field[] = [
                { label: '规范状态', value: '未规范', danger: true },
                { label: '休眠状态', value: '正常' },
                { label: '身份证号码', value: '370181200307274588' },
                { label: '身份证有效期(起)', value: '20200101' },
                { label: '身份证有效期(止)', value: '20400101' },
                { label: '联系地址', value: '浦东南路360号' },
                { label: '手机号', value: '13120837001' },
                { label: '职业', value: '' },
                { label: '年龄', value: '22' },
                { label: '联系信息同账户信息', value: '是' },
                { label: '开户时间', value: '20260702' },
                { label: '适当性是否有效', value: '是' },
              ];

              const investorFields: Field[] = [
                { label: '投资者属性', value: '' },
                { label: '其他办理中的业务', value: '邮编地址更新,忘记交易密码,监控中心密码重置,职业信息更新' },
                { label: '客户风险等级', value: '' },
                { label: '投资者类型', value: '普通投资者' },
                { label: '风险等级', value: 'C4' },
                { label: '最低风险等级', value: 'C4' },
              ];

              // 客户当前已有交易编码情况
              const existingCodes: { exchange: string; openDate: string; dormant: string }[] = [
                { exchange: '上海期货交易所', openDate: '20240115', dormant: '正常' },
                { exchange: '大连商品交易所', openDate: '20240115', dormant: '正常' },
                { exchange: '郑州商品交易所', openDate: '20240320', dormant: '正常' },
                { exchange: '上海国际能源交易中心', openDate: '20250608', dormant: '休眠' },
                { exchange: '中国金融期货交易所', openDate: '20250901', dormant: '正常' },
              ];

              // 已选注销数量：编码(父级勾选) / 权限(实际随之注销的子项)
              const codeCount = applyContent.filter(ex => ex.codeChecked).length;
              const permCount = applyContent.reduce(
                (s, ex) => s + ex.permissions.filter(p => p.hasPermission && (ex.codeChecked || p.checked)).length,
                0
              );

              // 状态分支：只有“办理中-复核”才出现 CAP/CTP 同步按钮；“办理成功”时德索同步记录为已同步
              const processStatus: string = app.status;
              const atReviewStage = processStatus === '办理中-复核';
              const isSuccessDone = processStatus === '办理成功';

              return (
                <>
                  {/* 基本资料信息 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        基本资料信息
                      </h2>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> 更新CAP
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* 顶部概览 */}
                      <FieldGrid fields={summaryFields} gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
                      <FieldGrid fields={basicFields} gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
                      <FieldGrid fields={investorFields} gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
                    </div>
                  </section>

                  {/* 申请内容（业务人员可取消客户勾选，不能新增） */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        申请内容
                      </h2>
                      <span className="text-xs text-slate-400">可取消客户申请项，不可新增</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                      {applyContent.map((ex, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-sm overflow-hidden">
                          {/* 交易所编码（父级） */}
                          <label className={`flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 ${ex.codeOriginal ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                            <Checkbox
                              className="rounded-sm"
                              checked={ex.codeChecked}
                              disabled={!ex.codeOriginal}
                              onCheckedChange={() => toggleCode(idx)}
                            />
                            <span className="font-medium text-slate-800">{ex.exchange}{ex.codeWithPerm ? '编码及权限' : '编码'}</span>
                          </label>
                          {/* 具体权限（子级） */}
                          <div className="divide-y divide-slate-100">
                            {ex.codeWithPerm && ex.permissions.length === 0 && (
                              <div className="flex items-center gap-2.5 px-4 py-2.5 pl-10">
                                <span className="text-sm text-slate-400">相关权限随编码注销</span>
                              </div>
                            )}
                            {ex.permissions.map((p, pi) => {
                              const displayChecked = p.hasPermission && (ex.codeChecked || p.checked);
                              // 无权限 / 非客户原选 / 编码锁定（已注销编码）时不可操作
                              const disabled = !p.hasPermission || !p.original || ex.codeChecked;
                              return (
                                <label key={pi} className={`flex items-center gap-2.5 px-4 py-2.5 pl-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                  <Checkbox
                                    className="rounded-sm"
                                    checked={displayChecked}
                                    disabled={disabled}
                                    onCheckedChange={() => togglePerm(idx, pi)}
                                  />
                                  <span className={`text-sm ${p.hasPermission ? (displayChecked ? 'text-slate-700' : 'text-slate-400') : 'text-slate-300'}`}>
                                    {p.name}{!p.hasPermission && '（无权限）'}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 同步操作区：仅“办理中-复核”阶段展示，编码注销(CAP) / 权限注销(CTP) 独立批量提交 */}
                    {atReviewStage && (
                    <div className="px-5 pb-5 space-y-2.5">
                      {/* 注销编码 */}
                      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm">
                        <div className="text-sm text-slate-600">
                          编码注销：已选 <span className="font-semibold text-slate-800">{codeCount}</span> 个交易所编码
                        </div>
                        <div className="flex items-center gap-3">
                          {syncState.cap.done && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 已提交
                            </span>
                          )}
                          <button
                            disabled={codeCount === 0}
                            onClick={() => setSyncConfirm('cap')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> 提交CAP：注销编码
                          </button>
                        </div>
                      </div>
                      {/* 注销权限 */}
                      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm">
                        <div className="text-sm text-slate-600">
                          权限注销：已选 <span className="font-semibold text-slate-800">{permCount}</span> 项权限
                        </div>
                        <div className="flex items-center gap-3">
                          {syncState.ctp.done && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 已提交
                            </span>
                          )}
                          <button
                            disabled={permCount === 0}
                            onClick={() => setSyncConfirm('ctp')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> 提交CTP：注销权限
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                  </section>

                  {/* 交易所编码开通情况 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        交易所编码开通情况
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="overflow-x-auto border border-slate-200 rounded-sm">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500">
                              <th className="px-4 py-2.5 text-left font-medium border-b border-slate-200">交易所</th>
                              <th className="px-4 py-2.5 text-center font-medium border-b border-slate-200">开户日期</th>
                              <th className="px-4 py-2.5 text-center font-medium border-b border-slate-200">休眠状态</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {existingCodes.map((c, i) => (
                              <tr key={i} className="hover:bg-slate-50/60">
                                <td className="px-4 py-2.5 text-slate-700">{c.exchange}</td>
                                <td className="px-4 py-2.5 text-center text-slate-700">{c.openDate}</td>
                                <td className="px-4 py-2.5 text-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${c.dormant === '正常' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {c.dormant}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  {/* 附件资料 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        附件资料
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        {([
                          { side: 'front' as const, label: '身份证（人像面）' },
                          { side: 'back' as const, label: '身份证（国徽面）' },
                        ]).map(item => (
                          <div key={item.side} className="border border-slate-200 rounded-sm overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() => setPreviewSide(item.side)}
                              className="group relative block w-full bg-slate-50 p-4 cursor-pointer"
                              title="点击预览"
                            >
                              <IdCardImage side={item.side} className="w-full h-auto rounded-sm" />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors">
                                <span className="flex items-center gap-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-4 h-4" /> 预览
                                </span>
                              </div>
                            </button>
                            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-200">
                              <span className="text-sm text-slate-700">{item.label}</span>
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => setPreviewSide(item.side)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm" title="预览">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm" title="下载">
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* 全量权限表 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        全量权限表
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm text-left table-fixed">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr className="divide-x divide-slate-200">
                              {FULL_EXCHANGE_PERMISSIONS.map(ex => (
                                <th key={`th-${ex.id}`} className="py-3 px-4 text-center">
                                  {ex.shortName}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="divide-x divide-slate-200 bg-white">
                              {FULL_EXCHANGE_PERMISSIONS.map(ex => (
                                <td key={`td-${ex.id}`} className="py-4 px-4 align-top">
                                  <div className="flex flex-col gap-y-3">
                                    {ex.permissions.map(p => (
                                      <label key={p.id} className="flex items-start gap-2 cursor-not-allowed">
                                        <Checkbox
                                          checked={p.checked}
                                          disabled={true}
                                          className={`rounded-sm mt-0.5 shrink-0 ${p.checked ? 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600' : 'opacity-60'}`}
                                        />
                                        <span className={`text-[13px] leading-snug ${p.checked ? 'text-slate-800 font-medium' : 'text-slate-500 opacity-80'}`}>
                                          {p.name}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  {/* 操作日志 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        操作日志
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                              <th className="py-3 px-4 w-1/3">操作内容</th>
                              <th className="py-3 px-4 w-[120px]">操作状态</th>
                              <th className="py-3 px-4 w-1/4">操作人</th>
                              <th className="py-3 px-4">操作时间</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-3 px-4 text-slate-700">同步CAP-待注销编码</td>
                              <td className="py-3 px-4">
                                {syncState.cap.done ? (
                                  <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
                                    同步成功
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                                    未同步
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-600">{syncState.cap.done ? '张伟' : '-'}</td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-[13px]">{syncState.cap.done ? syncState.cap.time : '-'}</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-3 px-4 text-slate-700">同步CTP-待注销权限</td>
                              <td className="py-3 px-4">
                                {syncState.ctp.done ? (
                                  <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
                                    同步成功
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                                    未同步
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-600">{syncState.ctp.done ? '张伟' : '-'}</td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-[13px]">{syncState.ctp.done ? syncState.ctp.time : '-'}</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-3 px-4 text-slate-700">同步德索-材料归档</td>
                              <td className="py-3 px-4">
                                {isSuccessDone ? (
                                  <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
                                    同步成功
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                                    未同步
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-600">{isSuccessDone ? '赵复核' : '-'}</td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-[13px]">{isSuccessDone ? `${app.processDate}:00` : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  {/* 审批流程 */}
                  <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                      <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                        审批流程
                      </h2>
                    </div>
                    <div className="p-6">
                      {(() => {
                        type FlowState = 'done' | 'current' | 'fail';
                        type FlowNode = { label: string; actor: string; time: string; state: FlowState; reason?: string };
                        const status: string = app.status;
                        const isFail = status.startsWith('办理失败');
                        const isSuccess = status === '办理成功';
                        const atReview = status.includes('复核'); // 复核阶段（办理中或失败）
                        const t = (v: string) => (v && v !== '-' ? `${v}:00` : '-');

                        const nodes: FlowNode[] = [
                          { label: '发起申请', actor: `${app.name} (客户)`, time: t(app.applyDate), state: 'done' },
                        ];

                        if (isSuccess) {
                          nodes.push(
                            { label: '营业部经办', actor: app.operator, time: t(app.processDate), state: 'done' },
                            { label: '营业部复核', actor: app.reviewer, time: t(app.lastCapTime), state: 'done' },
                            { label: '办理成功', actor: '系统', time: t(app.lastCapTime), state: 'done' },
                          );
                        } else if (atReview) {
                          nodes.push({ label: '营业部经办', actor: app.operator, time: t(app.processDate), state: 'done' });
                          if (isFail) {
                            nodes.push({ label: '营业部复核 (办理失败)', actor: app.reviewer, time: t(app.lastCapTime), state: 'fail', reason: app.remark });
                          } else {
                            nodes.push({ label: '营业部复核 (处理中)', actor: app.reviewer !== '-' ? app.reviewer : '等待处理', time: '-', state: 'current' });
                          }
                        } else {
                          // 经办阶段
                          if (isFail) {
                            nodes.push({ label: '营业部经办 (办理失败)', actor: app.operator, time: t(app.processDate), state: 'fail', reason: app.remark });
                          } else {
                            nodes.push({ label: '营业部经办 (处理中)', actor: app.operator !== '-' ? app.operator : '等待处理', time: '-', state: 'current' });
                          }
                        }

                        return (
                          <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                            {nodes.map((n, i) => (
                              <div key={i} className="relative pl-6">
                                {n.state === 'current' ? (
                                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-50 border-2 border-blue-500 shadow-sm z-10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                  </div>
                                ) : (
                                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${n.state === 'fail' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm ${n.state === 'current' ? 'font-semibold text-blue-600' : n.state === 'fail' ? 'font-medium text-red-600' : 'font-medium text-slate-800'}`}>{n.label}</span>
                                    {n.state === 'current' && <span className="text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm leading-none">当前节点</span>}
                                  </div>
                                  <span className="text-xs text-slate-500 font-mono">{n.time}</span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-slate-400" /> {n.actor}
                                </div>
                                {n.reason && (
                                  <div className="mt-2 bg-red-50 border border-red-100 rounded-sm text-xs text-slate-700 p-2.5 flex items-start gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                    <span>失败原因：{n.reason || '未记录'}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </section>
                </>
              );
            })()}
          </div>
          {/* Sticky action footer */}
          <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
            {mode === 'view' ? (
              <button
                className="px-8 py-2.5 rounded-sm border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                onClick={() => onOpenChange(false)}
              >
                关闭
              </button>
            ) : (
              <>
                <button
                  className="px-8 py-2.5 rounded-sm border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors shadow-sm"
                  onClick={() => openActionModal('fail')}
                >
                  办理失败
                </button>
                <button
                  className="px-8 py-2.5 rounded-sm bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={handleApprove}
                >
                  审批通过
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Action Dialog (Fail) */}
      <Dialog open={actionModalState.isOpen} onOpenChange={closeActionModal}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">确认办理失败</DialogTitle>
            <DialogDescription className="sr-only">输入办理失败原因</DialogDescription>
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
                    value={actionModalState.selectedReasonId}
                    onChange={(e) => setActionModalState(prev => ({ ...prev, selectedReasonId: e.target.value }))}
                  >
                    <option value="" disabled>请选择失败原因...</option>
                    {enabledReasons.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.content}</option>
                    ))}
                    <option value="other">其他原因 (手动输入)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              {actionModalState.selectedReasonId === 'other' && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <textarea
                    rows={3}
                    value={actionModalState.customReason}
                    onChange={(e) => setActionModalState(prev => ({ ...prev, customReason: e.target.value }))}
                    placeholder="请详细描述具体原因..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={closeActionModal} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button
              className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8"
              disabled={
                !actionModalState.selectedReasonId ||
                (actionModalState.selectedReasonId === 'other' && !actionModalState.customReason.trim())
              }
              onClick={handleActionConfirm}
            >
              确定办理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Approve Confirm Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">确认审批通过</DialogTitle>
            <DialogDescription className="sr-only">确认审批通过当前注销申请</DialogDescription>
          </DialogHeader>
          <div className="p-6 text-sm text-slate-600 leading-relaxed">
            确认审批通过该注销交易编码/权限申请？通过后将进入下一环节处理。
            {app && (
              <span className="block mt-2 text-xs text-slate-400 font-mono">流水号：{app.id}</span>
            )}
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsApproveOpen(false)} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8" onClick={handleApproveConfirm}>
              确定通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Sync Confirm Dialog (CAP/CTP) */}
      <Dialog open={syncConfirm !== null} onOpenChange={(open) => !open && setSyncConfirm(null)}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {syncConfirm === 'cap' ? '确认提交CAP：注销编码' : '确认提交CTP：注销权限'}
            </DialogTitle>
            <DialogDescription className="sr-only">确认同步注销操作</DialogDescription>
          </DialogHeader>
          <div className="p-6 text-sm text-slate-600 leading-relaxed">
            {syncConfirm === 'cap'
              ? <>将向 CAP 提交注销编码申请，共涉及 <span className="font-semibold text-slate-800">{applyContent.filter(ex => ex.codeChecked).length}</span> 个交易所编码。注销编码后，名下相关权限将随之注销。</>
              : <>将向 CTP 提交注销权限申请，共涉及 <span className="font-semibold text-slate-800">{applyContent.reduce((s, ex) => s + ex.permissions.filter(p => p.hasPermission && (ex.codeChecked || p.checked)).length, 0)}</span> 项权限。</>}
            <span className="block mt-2 text-xs text-slate-400">提交后请到“操作日志”核对同步结果。</span>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setSyncConfirm(null)} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8" onClick={handleSyncConfirm}>
              确定提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Attachment Preview Lightbox */}
      <Dialog open={previewSide !== null} onOpenChange={(open) => !open && setPreviewSide(null)}>
        <DialogContent className="!max-w-[720px] w-full p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {previewSide === 'front' ? '身份证（人像面）' : '身份证（国徽面）'}
            </DialogTitle>
            <DialogDescription className="sr-only">身份证附件预览</DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-slate-100 flex items-center justify-center">
            {previewSide && <IdCardImage side={previewSide} className="w-full max-w-lg h-auto rounded-md shadow-sm" />}
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setPreviewSide(null)} className="rounded-sm text-slate-600 h-8">
              关闭
            </Button>
            <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8">
              <Download className="w-3.5 h-3.5 mr-1.5" /> 下载
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
