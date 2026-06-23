import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

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
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <DialogTitle className="text-lg font-bold text-slate-800 mb-2">营业执照信息确认</DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            请确认您的营业执照信息是否最新且无误。为了保证开通业务的合规性，我们需要在最终提交前核对您的资质信息。
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50/50">
          <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
            <div className="aspect-[1.414/1] relative w-full overflow-hidden rounded-sm bg-slate-100 flex items-center justify-center group">
               <ImageWithFallback 
                 src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNlcnRpZmljYXRlJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzgyMDkyNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                 alt="营业执照"
                 className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5">
                 <p className="text-white text-sm font-medium mb-1 drop-shadow-md">统一社会信用代码：91110000X12345678X</p>
                 <p className="text-white text-sm drop-shadow-md">企业名称：超体科技（北京）有限公司</p>
               </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
          <button 
            onClick={handleContactManager} 
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors underline underline-offset-2"
          >若信息有误，请联系客户经理修改信息后再发起申请</button>
          <div className="flex gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}