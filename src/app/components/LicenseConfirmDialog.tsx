import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { ShieldCheck, AlertCircle, FileText, Building2, Hash } from 'lucide-react';

interface LicenseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LicenseConfirmDialog({ open, onOpenChange, onConfirm }: LicenseConfirmDialogProps) {
  const handleContactManager = () => {
    toast.info('已通知客户经理，请等待客户经理与您联系处理营业执照信息更新。');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-sm p-0 overflow-hidden border-slate-200">
        {/* ====== 头部 ====== */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-slate-800 mb-1.5">营业执照信息确认</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 leading-relaxed">
                请确认您的营业执照信息是否最新且无误。为保证业务合规性，我们需在最终提交前核对您的资质信息。
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ====== 证件预览 + 信息卡片 ====== */}
        <div className="px-6 pb-4">
          <div className="flex gap-4">
            {/* 左侧：营业执照图片缩略 */}
            <div className="w-44 flex-shrink-0">
              <div className="aspect-[1.414/1] relative w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-50 group">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNlcnRpZmljYXRlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzgyMDkyNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="营业执照"
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" />
                营业执照副本
              </p>
            </div>

            {/* 右侧：关键信息列表 */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 px-4 py-3 bg-slate-50 rounded-sm border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">企业名称</p>
                  <p className="text-sm font-medium text-slate-800 truncate">超体科技（北京）有限公司</p>
                </div>
              </div>
              <div className="h-px bg-slate-200/60" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <Hash className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">统一社会信用代码</p>
                  <p className="text-sm font-medium text-slate-800 font-mono tracking-tight">91110000X12345678X</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== 信息有误提示 ====== */}
        <div className="px-6 pb-4">
          <button 
            onClick={handleContactManager} 
            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-sm transition-colors text-left group"
          >
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-xs text-amber-700 leading-relaxed">
              若上述信息有误，<span className="font-medium underline underline-offset-2 group-hover:text-amber-800">请联系客户经理</span>修改信息后再发起申请
            </span>
          </button>
        </div>

        {/* ====== 底部按钮 ====== */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <Button variant="outline" className="rounded-sm px-6" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="rounded-sm bg-blue-600 text-white hover:bg-blue-700 px-6" onClick={() => {
            onOpenChange(false);
            onConfirm();
          }}>
            确认无误并提交
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}