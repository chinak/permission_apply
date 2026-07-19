import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftRight, ChevronRight, Clock, FileText, Search, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../components/ui/Button';

const APPLICATIONS = [
  {
    id: 'WH-20260623-001',
    exchange: 'DCE',
    exchangeName: '大连商品交易所',
    selectedExchanges: ['DCE'],
    contract: 'rb2501',
    lots: 50,
    direction: 'IN',
    type: '跨期货公司转移',
    applyDate: '2026-06-23 10:30',
    status: 'processing',
    statusText: '审核中',
  },
  {
    id: 'WH-20260623-002',
    exchange: 'DCE,CZCE',
    exchangeName: '大连商品交易所、郑州商品交易所',
    selectedExchanges: ['DCE', 'CZCE'],
    contract: 'i2505, SR501',
    lots: 180,
    direction: 'IN',
    type: '跨期货公司转移',
    applyDate: '2026-06-23 09:15',
    status: 'processing',
    statusText: '审核中',
  },
  {
    id: 'WH-20260622-003',
    exchange: 'SHFE',
    exchangeName: '上海期货交易所',
    selectedExchanges: ['SHFE'],
    contract: 'cu2408',
    lots: 20,
    direction: 'OUT',
    type: '实控关系组账户内转移',
    applyDate: '2026-06-22 14:20',
    status: 'success',
    statusText: '已完成',
  },
  {
    id: 'WH-20260621-004',
    exchange: 'DCE,SHFE,CZCE',
    exchangeName: '大连商品交易所、上海期货交易所、郑州商品交易所',
    selectedExchanges: ['DCE', 'SHFE', 'CZCE'],
    contract: 'rb2501, cu2408, SR501',
    lots: 350,
    direction: 'OUT',
    type: '跨期货公司转移',
    applyDate: '2026-06-21 16:40',
    status: 'success',
    statusText: '已完成',
  },
  {
    id: 'WH-20260620-005',
    exchange: 'CZCE',
    exchangeName: '郑州商品交易所',
    selectedExchanges: ['CZCE'],
    contract: 'SR501',
    lots: 100,
    direction: 'IN',
    type: '跨期货公司转移',
    applyDate: '2026-06-20 09:15',
    status: 'failed',
    statusText: '审核不通过',
    rejectReason: '移仓合约已超出允许办理时间范围',
  },
  {
    id: 'WH-20260618-006',
    exchange: 'DCE,SHFE',
    exchangeName: '大连商品交易所、上海期货交易所',
    selectedExchanges: ['DCE', 'SHFE'],
    contract: 'm2505, ag2506',
    lots: 120,
    direction: 'IN',
    type: '跨期货公司转移',
    applyDate: '2026-06-18 08:50',
    status: 'failed',
    statusText: '审核不通过',
    rejectReason: '大商所品种未满足套保额度要求',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          审核中
        </span>
      );
    case 'success':
      return (
        <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          已完成
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-sm text-xs font-medium border border-red-200">
          <XCircle className="w-3.5 h-3.5" />
          审核不通过
        </span>
      );
    default:
      return null;
  }
};

export function WarehouseList() {
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Page Header */}
      <div className="flex items-center justify-end py-2">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm px-6"
          onClick={() => navigate('/warehouse-apply')}
        >
          <FileText className="w-4 h-4 mr-2" />
          新增移仓申请
        </Button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索流水号/合约..."
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
                <th className="font-medium px-6 py-4">交易所</th>
                <th className="font-medium px-6 py-4">合约</th>
                <th className="font-medium px-6 py-4">移仓方向</th>
                <th className="font-medium px-6 py-4">移仓类型</th>
                <th className="font-medium px-6 py-4">移仓手数</th>
                <th className="font-medium px-6 py-4">提交时间</th>
                <th className="font-medium px-6 py-4">当前状态</th>
                <th className="font-medium px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {APPLICATIONS.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => navigate('/warehouse-detail', { state: app })}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{app.id}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{app.exchangeName}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{app.contract}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-sm border",
                      app.direction === 'IN' ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"
                    )}>
                      {app.direction === 'IN' ? '移入我司' : '移出我司'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{app.type}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{app.lots} 手</td>
                  <td className="px-6 py-4 text-slate-500">{app.applyDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
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
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>共 {APPLICATIONS.length} 条记录</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>上一页</button>
            <button className="px-2 py-1 border border-slate-200 bg-blue-50 text-blue-600 rounded-sm font-medium">1</button>
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
