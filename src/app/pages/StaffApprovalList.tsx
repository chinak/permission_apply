import React, { useState } from 'react';
import { Download, Search, Filter, Eye, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../components/ui/Dialog';
import { StaffApproval } from './StaffApproval';
import { getEnabledReasons } from '../utils/mockData';

export function StaffApprovalList() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  // Batch Process state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchAction, setBatchAction] = useState<'success' | 'reject' | 'fail' | ''>('');
  const [selectedReasonId, setSelectedReasonId] = useState('');
  const [batchReason, setBatchReason] = useState('');

  const enabledReasons = getEnabledReasons('trade_permission');

  const applications = [
    {
      id: 'AP-20260609-001',
      account: '88001234',
      name: '张三科技有限公司',
      branch: '上海浦东分公司',
      type: '首次申请',
      applyDate: '2026-06-09 10:30',
      processDate: '-',
      status: '营业部经办',
      operator: '李经办',
      reviewer: '-',
      mockType: 'first-time'
    },
    {
      id: 'AP-20260609-002',
      account: '88001235',
      name: '李四投资管理有限公司',
      branch: '北京分公司',
      type: '他司豁免',
      applyDate: '2026-06-08 15:45',
      processDate: '2026-06-08 16:20',
      status: '营业部复核',
      operator: '王经办',
      reviewer: '赵复核',
      mockType: 'exemption'
    },
    {
      id: 'AP-20260609-003',
      account: '88001236',
      name: '王五国际贸易有限公司',
      branch: '深圳分公司',
      type: '我司豁免',
      applyDate: '2026-06-07 09:10',
      processDate: '2026-06-07 14:00',
      status: '总部经办',
      operator: '孙经办',
      reviewer: '钱复核',
      mockType: 'second-time'
    },
    {
      id: 'AP-20260609-004',
      account: '88001237',
      name: '赵六实业有限公司',
      branch: '广州分公司',
      type: '首次申请',
      applyDate: '2026-06-06 11:20',
      processDate: '2026-06-07 10:15',
      status: '总部复核',
      operator: '周经办',
      reviewer: '吴复核',
      mockType: 'first-time'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '营业部经办': return 'text-amber-700 bg-amber-50 border-amber-200';
      case '营业部复核': return 'text-blue-700 bg-blue-50 border-blue-200';
      case '总部经办': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case '总部复核': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const handleOpenDetail = (app: any) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(applications.map(app => app.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, id]);
    } else {
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const hasSelection = selectedRowIds.length > 0;

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">流水号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">资金账号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">姓名</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">营业部</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">上海浦东分公司</option>
                <option value="2">北京分公司</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">申请类型</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">首次申请</option>
                <option value="2">他司豁免</option>
                <option value="3">我司豁免</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">申请日期</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">处理日期</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">办理状态</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">营业部经办</option>
                <option value="2">营业部复核</option>
                <option value="3">总部经办</option>
                <option value="4">总部复核</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">经办人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">复核人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          
          
        </div>
        <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-slate-100">
          <Button className="px-6 rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            查询
          </Button>
          <Button variant="outline" className="px-6 rounded-sm text-slate-600 h-8 text-sm">重置</Button>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        {/* Action Bar (Moved from bottom) */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3">
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection} onClick={() => setIsBatchModalOpen(true)}>批量处理</Button>
          
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection}>批量导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">全部导出</Button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700 flex items-center gap-1.5" disabled={!hasSelection}>
            <Download className="w-3.5 h-3.5" /> 附件批量下载
          </Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> 附件全部下载
          </Button>
          <div className="flex-1"></div>
          
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="font-medium px-4 py-3 w-10">
                  <Checkbox 
                    className="rounded-sm" 
                    checked={selectedRowIds.length === applications.length && applications.length > 0}
                    onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                  />
                </th>
                <th className="font-medium px-4 py-3">流水号</th>
                <th className="font-medium px-4 py-3">资产账号</th>
                <th className="font-medium px-4 py-3">姓名/机构名称</th>
                <th className="font-medium px-4 py-3">营业部</th>
                <th className="font-medium px-4 py-3">申请类型</th>
                <th className="font-medium px-4 py-3">申请日期</th>
                <th className="font-medium px-4 py-3">处理日期</th>
                <th className="font-medium px-4 py-3">办理状态</th>
                <th className="font-medium px-4 py-3">经办人</th>
                <th className="font-medium px-4 py-3">复核人</th>
                <th className="font-medium px-4 py-3 text-center">操作</th>
                <th className="font-medium px-4 py-3 text-center">附件</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Checkbox 
                      className="rounded-sm" 
                      checked={selectedRowIds.includes(app.id)}
                      onCheckedChange={(checked) => toggleSelectRow(app.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{app.id}</td>
                  <td className="px-4 py-3 text-slate-600">{app.account}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium truncate max-w-[150px]" title={app.name}>{app.name}</td>
                  <td className="px-4 py-3 text-slate-600">{app.branch}</td>
                  <td className="px-4 py-3 text-slate-600">{app.type}</td>
                  <td className="px-4 py-3 text-slate-500">{app.applyDate}</td>
                  <td className="px-4 py-3 text-slate-500">{app.processDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.operator}</td>
                  <td className="px-4 py-3 text-slate-600">{app.reviewer}</td>
                  <td className="px-4 py-3 text-center">
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto text-xs"
                      onClick={() => handleOpenDetail(app)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> 详情
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button 
                      variant="ghost" 
                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 h-auto text-xs"
                      title="下载所有附件"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>共 {applications.length} 条记录</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>上一页</button>
            <button className="px-2 py-1 border border-slate-200 bg-blue-50 text-blue-600 rounded-sm font-medium">1</button>
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="!max-w-[50vw] w-full h-[90vh] p-0 border-none rounded-sm overflow-hidden bg-slate-50 flex flex-col gap-0">
          <DialogDescription className="sr-only">客户提交的交易权限开通申请详情信息审批界面。</DialogDescription>
          {/* Sticky modal header */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-20">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-wide">客户信息管理 (审批视图)</DialogTitle>
            {selectedApp && (
              <span className="ml-3 text-xs text-slate-400 font-mono">{selectedApp.id}</span>
            )}
          </div>
          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
             {selectedApp && (
               <StaffApproval
                 isModal={true}
                 hideTitle={true}
                 onClose={() => setIsDetailOpen(false)}
                 applicationType={selectedApp.mockType}
                 mockExchangeIds={
                   selectedApp.mockType === 'first-time' ? ['ine_oil_futures'] :
                   selectedApp.mockType === 'exemption' ? ['cffex'] :
                   ['dce_opt']
                 }
               />
             )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              批量处理
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              已选中 {selectedRowIds.length} 条申请记录
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">办理结果</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="batchAction" 
                    value="success"
                    checked={batchAction === 'success'}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">办理成功</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="batchAction" 
                    value="reject"
                    checked={batchAction === 'reject'}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">驳回</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="batchAction" 
                    value="fail"
                    checked={batchAction === 'fail'}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">办理失败</span>
                </label>
              </div>
            </div>

            {(batchAction === 'reject' || batchAction === 'fail') && (
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
                      <option value="" disabled>请选择{batchAction === 'reject' ? '驳回' : '失败'}原因...</option>
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
                      value={batchReason}
                      onChange={(e) => setBatchReason(e.target.value)}
                      placeholder="请详细描述具体原因..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsBatchModalOpen(false)} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button 
              className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8" 
              disabled={
                !batchAction || 
                ((batchAction === 'reject' || batchAction === 'fail') && !selectedReasonId) ||
                ((batchAction === 'reject' || batchAction === 'fail') && selectedReasonId === 'other' && !batchReason.trim())
              }
              onClick={() => {
                const finalReason = selectedReasonId === 'other' 
                  ? batchReason 
                  : enabledReasons.find(r => r.id === selectedReasonId)?.content;
                  
                alert(`批量操作：${batchAction}\n选中的ID：${selectedRowIds.join(', ')}\n原因：${finalReason || '无'}`);
                setIsBatchModalOpen(false);
                setSelectedRowIds([]);
                setBatchAction('');
                setSelectedReasonId('');
                setBatchReason('');
              }}
            >
              确定办理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}