import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Clock, FileText, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../components/ui/Button';

export function ApplicationList() {
  const navigate = useNavigate();

  const applications = [
    {
      id: 'AP-20260609-001',
      type: 'first-time',
      name: '首次申请',
      date: '2026-06-09 10:30',
      status: 'processing',
      statusText: '办理中',
      products: '上海国际能源交易中心 - 原油等R4品种',
      mockExchangeIds: ['ine_oil_futures', 'ine_oil_options']
    },
    {
      id: 'AP-20260609-002',
      type: 'exemption',
      name: '他司豁免',
      date: '2026-06-09 11:15',
      status: 'processing',
      statusText: '办理中',
      products: '中国金融期货交易所 - 交易编码',
      mockExchangeIds: ['cffex']
    },
    {
      id: 'AP-20260609-003',
      type: 'second-time',
      name: '我司豁免',
      date: '2026-06-09 14:20',
      status: 'processing',
      statusText: '办理中',
      products: '大连商品交易所 - 期权',
      mockExchangeIds: ['dce_opt']
    },
    {
      id: 'AP-20260608-004',
      type: 'first-time',
      name: '首次申请',
      date: '2026-06-08 09:10',
      status: 'rejected_to_client',
      statusText: '已退回',
      rejectReason: '客户上传的身份证件不清晰，请重新上传。',
      products: '上海国际能源交易中心 - 原油等R4品种',
      mockExchangeIds: ['ine_oil_futures']
    },
    {
      id: 'AP-20260607-005',
      type: 'exemption',
      name: '他司豁免',
      date: '2026-06-07 16:45',
      status: 'failed',
      statusText: '审批失败',
      rejectReason: '经核实，该客户在其他期货公司的账户已被冻结，不符合豁免条件。',
      products: '中国金融期货交易所 - 交易编码',
      mockExchangeIds: ['cffex']
    }
  ];

  const handleRowClick = (type: string, mockExchangeIds: string[], status: string, rejectReason?: string, statusText?: string) => {
    if (status === 'rejected_to_client') {
      navigate('/', { state: { applicationType: type, mockExchangeIds, status, rejectReason, statusText } });
    } else {
      navigate('/application-detail', { state: { applicationType: type, mockExchangeIds, status, rejectReason, statusText } });
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Page Header */}
      <div className="flex items-center justify-end py-2">
        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => navigate('/staff-approval-list')}>
          工作人员审批视图 (测试)
        </Button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索流水号/品种..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button variant="outline" className="rounded-sm flex items-center gap-2 text-slate-600">
              <Filter className="w-4 h-4" />
              筛选
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="font-medium px-6 py-4">流水号</th>
                <th className="font-medium px-6 py-4">申请类型</th>
                <th className="font-medium px-6 py-4">申请品种</th>
                <th className="font-medium px-6 py-4">提交时间</th>
                <th className="font-medium px-6 py-4">当前状态</th>
                <th className="font-medium px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(app.type, app.mockExchangeIds, app.status, app.rejectReason, app.statusText)}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{app.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-sm border",
                      app.type === 'first-time' 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : app.type === 'exemption'
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}>
                      {app.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={app.products}>
                    {app.products}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {app.date}
                  </td>
                  <td className="px-6 py-4">
                    {app.status === 'processing' && (
                      <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                        {app.statusText}
                      </span>
                    )}
                    {app.status === 'rejected_to_client' && (
                      <span className="inline-flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-orange-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                        {app.statusText.replace('驳回', '退回')}
                      </span>
                    )}
                    {app.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {app.statusText}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-blue-600 font-medium group-hover:text-blue-700">
                      <span>查看详情</span>
                      <ChevronRight className="w-4 h-4 translate-y-[0.5px] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}