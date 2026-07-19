import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export function ProcessRecord({
  status,
  rejectReason,
  submitDate,
}: {
  status?: string;
  rejectReason?: string;
  submitDate?: string;
}) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 mt-6 animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
          流程记录
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {/* ===== 退回给客户 ===== */}
          {status === 'rejected_to_client' ? (
            <>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">客户提交申请</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                <p className="text-xs text-slate-400">{submitDate || '2026-06-08 09:10:22'}</p>
              </div>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-orange-600 mb-1">退回给客户</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安1090</p>
                <p className="text-xs text-slate-400 mb-3">2026-06-08 14:30:15</p>
                <div className="bg-orange-50/50 p-4 rounded-sm border border-orange-100 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="text-slate-700">
                    <p className="font-medium text-orange-800 mb-1">退回原因</p>
                    <p className="text-sm text-orange-700/90">{rejectReason || '您的申请资料不完整，请重新提交相关附件。'}</p>
                  </div>
                </div>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white animate-pulse"></div>
                <h3 className="text-sm font-semibold text-blue-600 mb-1">客户提交申请</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                <p className="text-xs text-slate-400">待重新提交</p>
              </div>
            </>
          ) : status === 'processing' ? (
            /* ===== 审核中 ===== */
            <>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">客户提交申请</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                <p className="text-xs text-slate-400">{submitDate || '2026-06-23 10:30:22'}</p>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white animate-pulse"></div>
                <h3 className="text-sm font-semibold text-blue-600 mb-1">审批中</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安</p>
                <p className="text-xs text-slate-400">待处理</p>
              </div>
            </>
          ) : status === 'success' ? (
            /* ===== 已完成 ===== */
            <>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">客户提交申请</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                <p className="text-xs text-slate-400">{submitDate || '2026-06-22 14:20:00'}</p>
              </div>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-green-600 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  审批通过
                </h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安</p>
                <p className="text-xs text-slate-400">2026-06-23 11:05:18</p>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-green-600 mb-1">已完成</h3>
                <p className="text-xs text-slate-500 mb-1">移仓业务已办理完成</p>
                <p className="text-xs text-slate-400">2026-06-24 09:15:00</p>
              </div>
            </>
          ) : status === 'failed' ? (
            /* ===== 审核不通过 ===== */
            <>
              <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">客户提交申请</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                <p className="text-xs text-slate-400">{submitDate || '2026-06-20 09:15:00'}</p>
              </div>
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  审核不通过
                </h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安</p>
                <p className="text-xs text-slate-400 mb-2">2026-06-20 15:30:00</p>
                {rejectReason && (
                  <div className="bg-red-50/50 p-3 rounded-sm border border-red-100 flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="text-slate-700">
                      <p className="font-medium text-red-800 mb-1">不通过原因</p>
                      <p className="text-sm text-red-700/90">{rejectReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ===== 默认：待提交 ===== */
            <div className="relative pl-6 pb-2 border-l-2 border-transparent">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white animate-pulse"></div>
              <h3 className="text-sm font-semibold text-blue-600 mb-1">客户提交申请</h3>
              <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
              <p className="text-xs text-slate-400">待提交</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
