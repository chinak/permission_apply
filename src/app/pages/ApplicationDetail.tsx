import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SubmitForm } from './SubmitForm';
import { Button } from '../components/ui/Button';
import { Clock, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

export function ApplicationDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Default to 'first-time' if no state is provided
  const applicationType = location.state?.applicationType || 'first-time';
  const mockExchangeIds = location.state?.mockExchangeIds || [];
  const status = location.state?.status || 'rejected_to_client';
  const rejectReason = location.state?.rejectReason || '客户上传的身份证件不清晰，请重新上传。';
  const statusText = location.state?.statusText || '已驳回';

  const defaultTab = applicationType === 'exemption' 
    ? 'exemption' 
    : applicationType === 'second-time' 
      ? 'second-time' 
      : 'first-time';

  const renderProcessRecord = () => {
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
            
            {/* Initial Submission */}
            <div className="relative pl-6 pb-6 border-l-2 border-slate-200">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">客户提交申请</h3>
              <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
              <p className="text-xs text-slate-400 mb-2">2026-06-08 09:10:22</p>
            </div>

            {/* Processing */}
            {status === 'processing' && (
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white animate-pulse"></div>
                <h3 className="text-sm font-semibold text-blue-600 mb-1">审批中</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安1090</p>
                <p className="text-xs text-slate-400 mb-2">当前业务正在审核中，请耐心等待。</p>
              </div>
            )}

            {/* Rejected to Client */}
            {status === 'rejected_to_client' && (
              <>
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
                
                {/* New Submission Node */}
                <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white animate-pulse"></div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-1">客户提交申请</h3>
                  <p className="text-xs text-slate-500 mb-1">操作人：客户本人</p>
                  <p className="text-xs text-slate-400 mb-2">待重新提交</p>
                </div>
              </>
            )}

            {/* Failed */}
            {status === 'failed' && (
              <div className="relative pl-6 pb-2 border-l-2 border-transparent">
                <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                <h3 className="text-sm font-semibold text-red-600 mb-1">审批失败</h3>
                <p className="text-xs text-slate-500 mb-1">操作人：国泰君安1090</p>
                <p className="text-xs text-slate-400 mb-3">2026-06-08 16:45:30</p>
                <div className="bg-red-50/50 p-4 rounded-sm border border-red-100 flex items-start gap-3 text-sm">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-slate-700">
                    <p className="font-medium text-red-800 mb-1">失败原因</p>
                    <p className="text-sm text-red-700/90">{rejectReason || '经核实不符合开通条件。'}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <SubmitForm 
      isReadOnly={status !== 'rejected_to_client'} 
      defaultTab={defaultTab} 
      mockExchangeIds={mockExchangeIds} 
      afterAllBlocks={renderProcessRecord()}
    />
  );
}
