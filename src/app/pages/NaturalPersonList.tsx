import { useState } from 'react';
import { Download, Search, Eye, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { CancelProcessDialog } from '../components/CancelProcessDialog';

export function NaturalPersonList() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [processApp, setProcessApp] = useState<any>(null);

  const applications = [
    {
      id: '170047094',
      account: '1025000009',
      name: '周十四',
      branch: '1090-新开发模拟',
      branchGroup: '1090-新开发模拟',
      bizType1: '注销交易编码/权限',
      bizType2: '',
      applyDate: '2026-03-25 15:20',
      processDate: '2026-07-18 20:10',
      lastCapTime: '2026-07-18 20:15',
      status: '办理中-复核',
      operator: '周俊杰',
      reviewer: '-',
      hasImage: '是',
      syncRecord: '未同步',
      verifyMethod: '',
      remark: ''
    },
    {
      id: '170047051',
      account: '1025000010',
      name: '钱多多',
      branch: '1090-新开发模拟',
      branchGroup: '1090-新开发模拟',
      bizType1: '注销交易编码/权限',
      bizType2: '',
      applyDate: '2026-03-24 14:30',
      processDate: '2026-03-25 16:05',
      lastCapTime: '2026-03-25 16:10',
      status: '办理成功',
      operator: '李经办',
      reviewer: '赵复核',
      hasImage: '是',
      syncRecord: '同步成功',
      verifyMethod: '视频验证',
      remark: ''
    },
    {
      id: '170046988',
      account: '1025000011',
      name: '孙七',
      branch: '1080-上海营业部',
      branchGroup: '1080-上海营业部',
      bizType1: '注销交易编码/权限',
      bizType2: '',
      applyDate: '2026-03-22 09:45',
      processDate: '2026-03-22 11:20',
      lastCapTime: '2026-03-22 11:25',
      status: '办理失败-复核',
      operator: '王经办',
      reviewer: '钱复核',
      hasImage: '否',
      syncRecord: '同步失败',
      verifyMethod: '双录',
      remark: '材料不齐全，已退回'
    }
  ];

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

  const handleOpenView = (app: any) => {
    setProcessApp(app);
    setIsProcessOpen(true);
  };

  const hasSelection = selectedRowIds.length > 0;

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Filter Panel */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">业务流水号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">资金账号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">一级业务类型</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">注销交易编码/权限</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">二级业务类型</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">申请日期</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">办理日期</label>
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">经办人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">复核人</label>
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
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection}>批量导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">全部导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">验证方式导出</Button>
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
                <th className="font-medium px-4 py-3">营业部分组</th>
                <th className="font-medium px-4 py-3">一级业务类型</th>
                <th className="font-medium px-4 py-3">二级业务类型</th>
                <th className="font-medium px-4 py-3">申请日期</th>
                <th className="font-medium px-4 py-3">处理日期</th>
                <th className="font-medium px-4 py-3">办理状态</th>
                <th className="font-medium px-4 py-3">经办人</th>
                <th className="font-medium px-4 py-3">复核人</th>
                <th className="font-medium px-4 py-3 text-center">是否包含影像</th>
                <th className="font-medium px-4 py-3">同步德索记录</th>
                <th className="font-medium px-4 py-3">验证方式</th>
                <th className="font-medium px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onDoubleClick={() => handleOpenView(app)}>
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
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[120px]" title={app.branchGroup}>{app.branchGroup}</td>
                  <td className="px-4 py-3 text-slate-600">{app.bizType1}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[200px]" title={app.bizType2 || undefined}>{app.bizType2 || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{app.applyDate}</td>
                  <td className="px-4 py-3 text-slate-500">{app.processDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.operator}</td>
                  <td className="px-4 py-3 text-slate-600">{app.reviewer}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{app.hasImage}</td>
                  <td className={`px-4 py-3 ${getSyncColor(app.syncRecord)}`}>{app.syncRecord}</td>
                  <td className="px-4 py-3 text-slate-600">{app.verifyMethod || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto text-xs"
                      onClick={() => handleOpenView(app)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> 查看
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>记录数：{applications.length}</span>
          <div className="flex items-center gap-3">
            <span>每页 40 条</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>上一页</button>
              <button className="px-2 py-1 border border-slate-200 bg-blue-50 text-blue-600 rounded-sm font-medium">1</button>
              <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* 查看模态框（只读模式：底部仅【关闭】，无【办理失败】【审批通过】） */}
      <CancelProcessDialog app={processApp} open={isProcessOpen} onOpenChange={setIsProcessOpen} mode="view" />
    </div>
  );
}
