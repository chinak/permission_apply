import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card } from '../components/ui/card';
import { CheckCircle2, XCircle, ChevronLeft, RefreshCw, Check, AlertCircle, Clock, User, FileText, ChevronDown, Paperclip, Upload, Download, Trash2, Eye } from 'lucide-react';
import { SubmitForm } from './SubmitForm';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../components/ui/Dialog';
import { getEnabledReasons } from '../utils/mockData';

const FULL_EXCHANGE_PERMISSIONS = [
  {
    id: "czce",
    name: "郑州商品交易所",
    shortName: "郑商所",
    permissions: [
      { id: "czce_opt", name: "郑州期权", checked: true },
      { id: "pta", name: "PTA", checked: true },
      { id: "rapeseed", name: "菜籽花生", checked: true },
      { id: "px_old", name: "对二甲苯瓶片短纤(旧)", checked: true },
      { id: "px", name: "对二甲苯瓶片短纤", checked: true },
    ]
  },
  {
    id: "dce",
    name: "大连商品交易所",
    shortName: "大商所",
    permissions: [
      { id: "dce_opt", name: "大连期权", checked: true },
      { id: "iron", name: "铁矿石", checked: true },
      { id: "palm", name: "棕榈油", checked: true },
      { id: "soy", name: "豆类特定品种", checked: true },
    ]
  },
  {
    id: "shfe",
    name: "上海期货交易所",
    shortName: "上期所",
    permissions: [
      { id: "shfe_opt", name: "上海期权", checked: true },
      { id: "nickel_1d", name: "镍（旧）", checked: true },
      { id: "nickel", name: "镍", checked: true },
    ]
  },
  {
    id: "gfex",
    name: "广州期货交易所",
    shortName: "广期所",
    permissions: [
      { id: "gfex_opt", name: "广州期权", checked: false },
      { id: "lithium_old", name: "碳酸锂（旧）", checked: false },
      { id: "lithium", name: "碳酸锂", checked: false },
    ]
  },
  {
    id: "ine",
    name: "上海国际能源交易中心",
    shortName: "能源中心",
    permissions: [
      { id: "ine_100k_opt", name: "能源中心10万商品期权", checked: true },
      { id: "ine_100k_spec", name: "能源中心10万特定品种", checked: true },
      { id: "crude_futures", name: "原油期货", checked: true },
      { id: "crude_options", name: "原油期权", checked: true },
    ]
  },
  {
    id: "cffex",
    name: "中国金融期货交易所",
    shortName: "中金所",
    permissions: [
      { id: "stock_idx_futures", name: "股指期货", checked: true },
      { id: "stock_idx_options", name: "股指期权", checked: true },
      { id: "treasury_futures", name: "国债期货", checked: true },
    ]
  }
];

export function StaffApproval({
  isModal = false,
  hideTitle = false,
  onClose,
  applicationType: propApplicationType,
  mockExchangeIds: propMockExchangeIds
}: {
  isModal?: boolean,
  hideTitle?: boolean,
  onClose?: () => void,
  applicationType?: string,
  mockExchangeIds?: string[]
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [capSyncStatus, setCapSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  const [attachments, setAttachments] = useState([
    { id: 1, name: '身份证正面_已脱敏.jpg', size: '1.2 MB', uploader: '客户', type: 'image', uploadTime: '2026-06-09 10:30', canDelete: true },
    { id: 2, name: '特殊品种申请表_签字版.pdf', size: '3.4 MB', uploader: '客户', type: 'pdf', uploadTime: '2026-06-09 10:32', canDelete: true },
    { id: 3, name: '面签核查记录截图.png', size: '2.1 MB', uploader: '李经办 (工作人员)', type: 'image', uploadTime: '2026-06-09 11:15', canDelete: true },
  ]);

  const handleDeleteAttachment = (id: number) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const [actionModalState, setActionModalState] = useState<{
    isOpen: boolean;
    type: 'reject' | 'fail' | '';
    selectedReasonId: string;
    customReason: string;
  }>({
    isOpen: false,
    type: '',
    selectedReasonId: '',
    customReason: ''
  });

  const enabledReasons = getEnabledReasons('trade_permission');

  const openActionModal = (type: 'reject' | 'fail') => {
    setActionModalState({
      isOpen: true,
      type,
      selectedReasonId: '',
      customReason: ''
    });
  };

  const closeActionModal = () => {
    setActionModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleActionConfirm = () => {
    const finalReason = actionModalState.selectedReasonId === 'other' 
      ? actionModalState.customReason 
      : enabledReasons.find(r => r.id === actionModalState.selectedReasonId)?.content;
      
    alert(`操作：${actionModalState.type === 'reject' ? '驳回' : '办理失败'}\n原因：${finalReason || '无'}`);
    closeActionModal();
    handleClose();
  };

  const handleSyncCap = () => {
    setCapSyncStatus('syncing');
    setTimeout(() => {
      setCapSyncStatus('success');
    }, 1500);
  };

  const handleClose = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  // Re-use logic from ApplicationDetail to decide default tab
  const applicationType = propApplicationType || location.state?.applicationType || 'first-time';
  const mockExchangeIds = propMockExchangeIds || location.state?.mockExchangeIds || [];

  const defaultTab = applicationType === 'exemption' 
    ? 'exemption' 
    : applicationType === 'second-time' 
      ? 'second-time' 
      : 'first-time';

  const VerifyItem = ({ label, ok }: { label: string, ok: boolean }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> 满足要求
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
          <XCircle className="w-3.5 h-3.5" /> 不满足要求
        </span>
      )}
    </div>
  );

  return (
    <div className={isModal ? "bg-slate-50 relative flex flex-col min-h-full" : "min-h-screen bg-slate-50 relative flex flex-col"}>
      {!isModal && (
        <>
          {/* Watermark overlay */}
          <div className="pointer-events-none absolute inset-0 z-50 flex flex-wrap gap-20 opacity-[0.03] transform -rotate-12 scale-150 justify-center items-center overflow-hidden">
            {Array.from({ length: 150 }).map((_, i) => (
              <span key={i} className="text-2xl font-bold text-slate-900 select-none whitespace-nowrap">
                内部审批专用
              </span>
            ))}
          </div>
        </>
      )}

      <div className={`w-full mx-auto relative z-10 flex-1 ${isModal ? 'pt-6 px-6 pb-6' : 'pt-6 px-4 pb-6'}`}>

        {!hideTitle && (
          <div className="flex items-center gap-4 mb-6 px-2">
            {!isModal && (
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-wide">客户信息管理 (审批视图)</h1>
            </div>
          </div>
        )}

        <Card className="p-8 shadow-sm border-slate-200 mb-6 bg-white rounded-sm">
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

        {/* Customer Applied Interface Block */}
        <div className="relative">
          <SubmitForm 
            isReadOnly={true} 
            defaultTab={defaultTab} 
            mockExchangeIds={mockExchangeIds}
            hideHeader={true}
            hideProcessRecord={true}
            afterBasicInfoBlock={
              <>
                <section className="bg-white rounded-sm shadow-sm border border-slate-200">
                  <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                      相关人员证件有效期
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                          <tr>
                            <th className="py-3 px-4">相关人员类型</th>
                            <th className="py-3 px-4">姓名</th>
                            <th className="py-3 px-4">证件有效期止</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">法人</td>
                            <td className="py-3 px-4 text-slate-600">刘强</td>
                            <td className="py-3 px-4 text-slate-600">2045-12-31</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">联系人</td>
                            <td className="py-3 px-4 text-slate-600">孙俪</td>
                            <td className="py-3 px-4 text-slate-600">2040-08-15</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">指定下单人</td>
                            <td className="py-3 px-4 text-slate-600">张明辉</td>
                            <td className="py-3 px-4 text-slate-600">2040-06-01</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">开户授权人</td>
                            <td className="py-3 px-4 text-slate-600">李文婷</td>
                            <td className="py-3 px-4 text-slate-600">2039-03-15</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">资金调拨人</td>
                            <td className="py-3 px-4 text-slate-600">王建国</td>
                            <td className="py-3 px-4 text-slate-600">2041-09-10</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">结算单确认人</td>
                            <td className="py-3 px-4 text-slate-600">赵雪梅</td>
                            <td className="py-3 px-4 text-slate-600">2042-01-20</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                <section className="bg-white rounded-sm shadow-sm border border-slate-200 mt-6">
                  <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                      受益人信息
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                          <tr>
                            <th className="py-3 px-4 w-1/2">受益人姓名</th>
                            <th className="py-3 px-4 w-1/2">受益人证件有效期止</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">王思聪</td>
                            <td className="py-3 px-4 text-slate-600">2050-01-01</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">张伟</td>
                            <td className="py-3 px-4 text-slate-600">2045-06-30</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">李娜</td>
                            <td className="py-3 px-4 text-slate-600">2048-12-31</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </>
            }
          />
        </div>

        {/* Staff-only blocks appended at the very end */}
        <div className="flex flex-col gap-6 mt-6">
          {/* Attachments Section */}
          <section className="bg-white rounded-sm shadow-sm border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                附件资料
              </h2>
              <button className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-sm border border-blue-100 transition-colors">
                <Upload className="w-3.5 h-3.5" /> 上传附件
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map(file => (
                  <div key={file.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-sm hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {file.type === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="truncate">{file.uploader}上传</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="下载" onClick={() => {
                        const link = document.createElement('a');
                        link.href = '#';
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {file.canDelete && (
                        <button 
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" 
                          title="删除"
                          onClick={() => handleDeleteAttachment(file.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-sm shadow-sm border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
              待开通交易编码
            </h2>
            <button
              onClick={handleSyncCap}
              disabled={capSyncStatus !== 'idle'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                capSyncStatus === 'success'
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
                  : capSyncStatus === 'syncing'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {capSyncStatus === 'idle' && <RefreshCw className="w-3.5 h-3.5" />}
              {capSyncStatus === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {capSyncStatus === 'success' && <Check className="w-3.5 h-3.5 text-green-500" />}
              {capSyncStatus === 'idle' && '同步CAP'}
              {capSyncStatus === 'syncing' && '同步中...'}
              {capSyncStatus === 'success' && '已同步CAP'}
            </button>
          </div>
          <div className="p-5">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">交易所</th>
                    
                    <th className="py-3 px-4">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-medium">上海国际能源交易中心</td>
                    
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm border ${
                        capSyncStatus === 'success' 
                          ? 'text-green-700 bg-green-50 border-green-100' 
                          : 'text-orange-700 bg-orange-50 border-orange-100'
                      }`}>
                        {capSyncStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {capSyncStatus === 'success' ? '已同步' : '待同步'}
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-medium">中国金融期货交易所</td>
                    
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm border ${
                        capSyncStatus === 'success' 
                          ? 'text-green-700 bg-green-50 border-green-100' 
                          : 'text-orange-700 bg-orange-50 border-orange-100'
                      }`}>
                        {capSyncStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {capSyncStatus === 'success' ? '已同步' : '待同步'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

          <section className="bg-white rounded-sm shadow-sm border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                全量权限表
              </h2>
            </div>
            <div className="p-5">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
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
                              <label 
                                key={p.id} 
                                className="flex items-start gap-2 cursor-not-allowed"
                              >
                                <Checkbox 
                                  checked={p.checked} 
                                  disabled={true} 
                                  className={`rounded-sm mt-0.5 shrink-0 ${p.checked ? "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" : "opacity-60"}`}
                                />
                                <span className={`text-[13px] leading-snug ${p.checked ? "text-slate-800 font-medium" : "text-slate-500 opacity-80"}`}>
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
                      <td className="py-3 px-4 text-slate-700">同步CAP-待开通编码</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                          未同步
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">-</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[13px]">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          <section className="bg-white rounded-sm shadow-sm border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
                审批流程
              </h2>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                
                {/* Item 1 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 text-sm">发起申请</span>
                    <span className="text-xs text-slate-500 font-mono">2026-06-20 10:00:00</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 张三 (客户)
                  </div>
                </div>

                {/* Item 2 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 text-sm">营业部经办</span>
                    <span className="text-xs text-slate-500 font-mono">2026-06-20 11:30:00</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 李经办 (上海浦东分公司)
                  </div>
                </div>

                {/* Item 3 (Reject) */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="font-medium text-red-600 text-sm">营业部复核 (已驳回)</span>
                    <span className="text-xs text-slate-500 font-mono">2026-06-20 14:15:00</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 王复核 (上海浦东分公司)
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-sm text-xs text-slate-700 p-2.5 flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>驳回原因：客户风险等级与申请品种不匹配，请重新评估。</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 flex items-center justify-center"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <span className="font-medium text-slate-800 text-sm">重新提交申请</span>
                    <span className="text-xs text-slate-500 font-mono">2026-06-21 09:10:00</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 张三 (客户)
                  </div>
                </div>

                {/* Item 5 (Current) */}
                <div className="relative pl-6">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-50 border-2 border-blue-500 shadow-sm z-10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600 text-sm">营业部经办 (处理中)</span>
                      <span className="text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm leading-none">当前节点</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">-</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 等待处理
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Staff Actions */}
      <div className="sticky bottom-0 z-50 w-full bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button className="px-8 py-2.5 rounded-sm border border-slate-300 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm" onClick={() => openActionModal('reject')}>
          驳回
        </button>
        <button className="px-8 py-2.5 rounded-sm border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors shadow-sm" onClick={() => openActionModal('fail')}>
          办理失败
        </button>
        <button className="px-8 py-2.5 rounded-sm bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm" onClick={handleClose}>
          审批通过
        </button>
      </div>

      {/* Action Dialog (Reject / Fail) */}
      <Dialog open={actionModalState.isOpen} onOpenChange={closeActionModal}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {actionModalState.type === 'reject' ? '确认驳回' : '确认办理失败'}
            </DialogTitle>
            <DialogDescription className="sr-only">输入原因</DialogDescription>
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
                    <option value="" disabled>请选择{actionModalState.type === 'reject' ? '驳回' : '失败'}原因...</option>
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
    </div>
  );
}
