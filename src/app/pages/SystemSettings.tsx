import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../components/ui/Dialog';
import { MOCK_REASONS } from '../utils/mockData';

interface FailureReason {
  id: string;
  content: string;
  businessType: string;
  isEnabled: boolean;
  createTime: string;
}

export function SystemSettings() {
  const [selectedBusiness, setSelectedBusiness] = useState('trade_permission');
  
  const [reasons, setReasons] = useState<FailureReason[]>(MOCK_REASONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<FailureReason | null>(null);
  const [newContent, setNewContent] = useState('');

  const filteredReasons = reasons.filter(r => r.businessType === selectedBusiness);

  const handleOpenModal = (reason?: FailureReason) => {
    if (reason) {
      setEditingReason(reason);
      setNewContent(reason.content);
    } else {
      setEditingReason(null);
      setNewContent('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newContent.trim()) return;

    if (editingReason) {
      setReasons(reasons.map(r => r.id === editingReason.id ? { ...r, content: newContent } : r));
    } else {
      const newReason: FailureReason = {
        id: Math.random().toString(36).substring(2, 9),
        content: newContent,
        businessType: selectedBusiness,
        isEnabled: true,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setReasons([newReason, ...reasons]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条办理意见吗？')) {
      setReasons(reasons.filter(r => r.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setReasons(reasons.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  return (
    <div className="w-full mx-auto pb-24 px-4 pt-6">
      <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col overflow-hidden">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col p-6 min-h-0">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">业务模块</label>
                  <div className="relative w-64">
                    <select 
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500"
                      value={selectedBusiness}
                      onChange={(e) => setSelectedBusiness(e.target.value)}
                    >
                      <option value="trade_permission">交易权限申请</option>
                      <option value="account_open" disabled>普通账户开户 (待接入)</option>
                      <option value="info_change" disabled>客户资料变更 (待接入)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-sm px-4 h-9 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> 新增意见
                </Button>
              </div>

              <div className="flex-1 border border-slate-200 rounded-sm overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1 bg-slate-50/30">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="font-semibold px-6 py-3 w-16 text-center">序号</th>
                        <th className="font-semibold px-6 py-3">办理意见内容</th>
                        <th className="font-semibold px-6 py-3 w-40">创建时间</th>
                        <th className="font-semibold px-6 py-3 w-40 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredReasons.length > 0 ? (
                        filteredReasons.map((reason, index) => (
                          <tr key={reason.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4 text-center text-slate-400">{index + 1}</td>
                            <td className="px-6 py-4 text-slate-800">{reason.content}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{reason.createTime}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
                                  onClick={() => handleOpenModal(reason)}
                                >
                                  <Edit className="w-4 h-4 mr-1" /> 编辑
                                </Button>
                                <div className="w-px h-3 bg-slate-300"></div>
                                <Button 
                                  variant="ghost" 
                                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm"
                                  onClick={() => handleDelete(reason.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" /> 删除
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            暂无配置数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-0 border-none rounded-sm overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 m-0">
            <DialogTitle className="text-base font-bold text-slate-800">
              {editingReason ? '编辑办理意见' : '新增办理意见'}
            </DialogTitle>
            <DialogDescription className="sr-only">配置业务办理退回的快捷意见选项</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">所属业务模块</label>
                <input 
                  type="text" 
                  disabled 
                  value="交易权限申请" 
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-sm cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  <span className="text-red-500 mr-1">*</span>办理意见内容
                </label>
                <textarea 
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="请输入办理意见的具体内容，便于快捷选择..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 m-0 flex justify-end gap-3 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-sm text-slate-600">
              取消
            </Button>
            <Button onClick={handleSave} className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white" disabled={!newContent.trim()}>
              保存配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
