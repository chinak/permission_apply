import React, { useState } from 'react';
import { Download, Search, Eye, ChevronDown, StickyNote } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../components/ui/Dialog';
import { CancelProcessDialog } from '../components/CancelProcessDialog';
import { CANCEL_PERMISSION_APPLICATIONS, getEnabledReasons } from '../utils/mockData';

export function CancelPermission() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [remarkApp, setRemarkApp] = useState<any>(null);
  const [remarkText, setRemarkText] = useState('');
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [processApp, setProcessApp] = useState<any>(null);

  // 批量处理/复核弹框状态
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchType, setBatchType] = useState<'process' | 'review'>('process');
  const [batchAction, setBatchAction] = useState<'success' | 'fail' | ''>('');
  const [batchReasonId, setBatchReasonId] = useState('');
  const [batchReasonText, setBatchReasonText] = useState('');
  const enabledReasons = getEnabledReasons('natural_person_cancel');

  const applications = CANCEL_PERMISSION_APPLICATIONS;

  const getStatusColor = (status: string) => {
    switch (status) {
      case '办理中-经办': return 'text-amber-700 bg-amber-50 border-amber-200';
      case '办理中-复核': return 'text-blue-700 bg-blue-50 border-blue-200';
      case '办理失败-经办': return 'text-red-700 bg-red-50 border-red-200';
      case '办理失败-复核': return 'text-red-700 bg-red-50 border-red-200';
      case '办理成功': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getSyncColor = (sync: string) => {
    switch (sync) {
      case '同步成功': return 'text-green-600';
      case '同步失败': return 'text-red-600';
      case '部分同步成功': return 'text-amber-600';
      default: return 'text-slate-500';
    }
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

  const handleOpenRemark = (app: any) => {
    setRemarkApp(app);
    setRemarkText(app.remark || '');
    setIsRemarkOpen(true);
  };

  const handleOpenProcess = (app: any) => {
    setProcessApp(app);
    setIsProcessOpen(true);
  };

  // 批量操作环节校验：批量处理仅限「办理中-经办」，批量复核仅限「办理中-复核」
  const openBatch = (type: 'process' | 'review') => {
    const requiredStatus = type === 'process' ? '办理中-经办' : '办理中-复核';
    const selectedApps = applications.filter(a => selectedRowIds.includes(a.id));
    const invalid = selectedApps.filter(a => a.status !== requiredStatus);
    if (invalid.length > 0) {
      const stageName = type === 'process' ? '经办' : '复核';
      alert(`仅「${requiredStatus}」状态的流水可批量${stageName === '经办' ? '处理' : '复核'}。\n\n以下 ${invalid.length} 条不符合：\n${invalid.map(a => `${a.id}（${a.status}）`).join('\n')}`);
      return;
    }
    setBatchType(type);
    setBatchAction('');
    setBatchReasonId('');
    setBatchReasonText('');
    setIsBatchOpen(true);
  };

  const hasSelection = selectedRowIds.length > 0;

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Filter Panel */}
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
                <option value="1">1090-新开发模拟</option>
                <option value="2">1080-上海营业部</option>
                <option value="3">1070-北京营业部</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">营业部组织架构分组</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">1090-新开发模拟</option>
                <option value="2">1080-上海营业部</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">渠道</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">LucyApp</option>
                <option value="2">同花顺手炒APP</option>
                <option value="3">掌期</option>
                <option value="4">同花顺期货通</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">申请内容</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="cffex">中国金融期货交易所编码及权限取消</option>
                <option value="czce_code">郑州商品交易所编码取消</option>
                <option value="czce_opt">郑州商品交易所商品期权限取消</option>
                <option value="czce_spec">郑州商品交易所特定品种取消</option>
                <option value="dce_code">大连商品交易所编码取消</option>
                <option value="dce_opt">大连商品交易所商品期权限取消</option>
                <option value="dce_spec">大连商品交易所特定品种取消</option>
                <option value="shfe_code">上海期货交易所编码取消</option>
                <option value="shfe_opt">上海期货交易所商品期权限取消</option>
                <option value="shfe_spec">上海期货交易所特定品种取消</option>
                <option value="ine_code">上海国际能源交易中心编码取消</option>
                <option value="ine_opt">上海国际能源交易中心原油期权限取消</option>
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
            <label className="text-xs font-medium text-slate-600">最后提交CAP时间</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">最后提交CTP时间</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">办理状态</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">办理中-经办</option>
                <option value="2">办理中-复核</option>
                <option value="3">办理失败-经办</option>
                <option value="4">办理失败-复核</option>
                <option value="5">办理成功</option>
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">同步德索记录</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">无需同步</option>
                <option value="2">未同步</option>
                <option value="3">部分同步成功</option>
                <option value="4">同步成功</option>
                <option value="5">同步失败</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
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

      {/* Table Panel */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        {/* Action Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3">
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection} onClick={() => openBatch('process')}>批量处理</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection} onClick={() => openBatch('review')}>批量复核</Button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection}>批量导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">全部导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">一键导出全量</Button>
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
                <th className="font-medium px-4 py-3">资金账号</th>
                <th className="font-medium px-4 py-3">姓名</th>
                <th className="font-medium px-4 py-3">营业部</th>
                <th className="font-medium px-4 py-3">营业部组织架构分组</th>
                <th className="font-medium px-4 py-3">渠道</th>
                <th className="font-medium px-4 py-3">申请日期</th>
                <th className="font-medium px-4 py-3">处理日期</th>
                <th className="font-medium px-4 py-3">最后提交CAP时间</th>
                <th className="font-medium px-4 py-3">最后提交CTP时间</th>
                <th className="font-medium px-4 py-3">办理状态</th>
                <th className="font-medium px-4 py-3">经办人</th>
                <th className="font-medium px-4 py-3">复核人</th>
                <th className="font-medium px-4 py-3">同步德索记录</th>
                <th className="font-medium px-4 py-3 text-center">操作</th>
                <th className="font-medium px-4 py-3 text-center">备注</th>
                <th className="font-medium px-4 py-3 text-center">下载附件</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onDoubleClick={() => handleOpenProcess(app)}>
                  <td className="px-4 py-3">
                    <Checkbox
                      className="rounded-sm"
                      checked={selectedRowIds.includes(app.id)}
                      onCheckedChange={(checked) => toggleSelectRow(app.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{app.id}</td>
                  <td className="px-4 py-3 text-slate-600">{app.account}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{app.name}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[120px]" title={app.branch}>{app.branch}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[140px]" title={app.branchGroup}>{app.branchGroup}</td>
                  <td className="px-4 py-3 text-slate-600">{app.channel}</td>
                  <td className="px-4 py-3 text-slate-500">{app.applyDate}</td>
                  <td className="px-4 py-3 text-slate-500">{app.processDate}</td>
                  <td className="px-4 py-3 text-slate-500">{app.lastCapTime}</td>
                  <td className="px-4 py-3 text-slate-500">{app.lastCtpTime}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.operator}</td>
                  <td className="px-4 py-3 text-slate-600">{app.reviewer}</td>
                  <td className={`px-4 py-3 ${getSyncColor(app.syncRecord)}`}>{app.syncRecord}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto text-xs"
                      onClick={() => handleOpenProcess(app)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> 处理
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      className={`px-2 py-1 h-auto text-xs ${app.remark ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
                      title={app.remark || '添加备注'}
                      onClick={() => handleOpenRemark(app)}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
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

      {/* Remark Dialog */}
      <Dialog open={isRemarkOpen} onOpenChange={setIsRemarkOpen}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">备注</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              流水号：{remarkApp?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <textarea
              rows={4}
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="请输入备注内容..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsRemarkOpen(false)} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8" onClick={() => setIsRemarkOpen(false)}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 处理模态框（共享组件） */}
      <CancelProcessDialog app={processApp} open={isProcessOpen} onOpenChange={setIsProcessOpen} />

      {/* 批量处理/复核弹框 */}
      <Dialog open={isBatchOpen} onOpenChange={setIsBatchOpen}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {batchType === 'process' ? '批量处理' : '批量复核'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              已选中 {selectedRowIds.length} 条流水记录
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">办理结果</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="batchCancelAction"
                    value="success"
                    checked={batchAction === 'success'}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{batchType === 'process' ? '审批通过' : '复核通过'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="batchCancelAction"
                    value="fail"
                    checked={batchAction === 'fail'}
                    onChange={(e) => setBatchAction(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">办理失败</span>
                </label>
              </div>
            </div>

            {batchAction === 'fail' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    <span className="text-red-500 mr-1">*</span>失败原因
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={batchReasonId}
                      onChange={(e) => setBatchReasonId(e.target.value)}
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

                {batchReasonId === 'other' && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <textarea
                      rows={3}
                      value={batchReasonText}
                      onChange={(e) => setBatchReasonText(e.target.value)}
                      placeholder="请详细描述具体原因..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsBatchOpen(false)} className="rounded-sm text-slate-600 h-8">
              取消
            </Button>
            <Button
              className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8"
              disabled={
                !batchAction ||
                (batchAction === 'fail' && !batchReasonId) ||
                (batchAction === 'fail' && batchReasonId === 'other' && !batchReasonText.trim())
              }
              onClick={() => {
                const finalReason = batchReasonId === 'other'
                  ? batchReasonText
                  : enabledReasons.find(r => r.id === batchReasonId)?.content;
                alert(`${batchType === 'process' ? '批量处理' : '批量复核'}：${batchAction === 'success' ? '通过' : '失败'}\n选中流水：${selectedRowIds.join(', ')}\n原因：${finalReason || '无'}`);
                setIsBatchOpen(false);
                setSelectedRowIds([]);
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
