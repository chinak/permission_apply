import { Construction, Search } from 'lucide-react';

export function NaturalPersonBranchList() {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
        <Search className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-semibold text-slate-800">业务办理查询（营业部）</h2>
      </div>

      <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-5">
          <Construction className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">营业部版 · 业务办理查询</h3>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          本页面用于营业部查询本营业部发起的注销交易编码/权限等业务的处理记录与流转状态。
          <br />
          当前为占位页面，功能正在建设中。
        </p>
      </div>
    </div>
  );
}