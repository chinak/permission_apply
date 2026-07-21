import { useState } from "react";
import { Plus, Search, RefreshCw, Trash2, AlertCircle, X, Check, Save, Edit } from "lucide-react";

interface PermissionItem {
  id: string;
  label: string;
  value: number;
  exchange: string;
}

const initialPermissions: PermissionItem[] = [
  { id: 'p1', label: '股指期货', value: 10, exchange: '中国金融期货交易所' },
  { id: 'p2', label: '股指期权', value: 10, exchange: '中国金融期货交易所' },
  { id: 'p3', label: '国债期货', value: 10, exchange: '中国金融期货交易所' },
  { id: 'p4', label: '原油期货', value: 8, exchange: '上海国际能源交易中心' },
  { id: 'p5', label: '原油期权', value: 8, exchange: '上海国际能源交易中心' },
  { id: 'p6', label: '铁矿石', value: 5, exchange: '大连商品交易所' },
  { id: 'p7', label: '棕榈油', value: 5, exchange: '大连商品交易所' },
  { id: 'p8', label: 'PTA', value: 5, exchange: '郑州商品交易所' },
  { id: 'p9', label: '低硫燃料油', value: 5, exchange: '上海国际能源交易中心' },
  { id: 'p10', label: '20号胶', value: 5, exchange: '上海国际能源交易中心' },
  { id: 'p11', label: '国际铜', value: 5, exchange: '上海国际能源交易中心' },
  { id: 'p12', label: '大连期权', value: 5, exchange: '大连商品交易所' },
];

export function VarietyPermissionTab() {
  const [data, setData] = useState<PermissionItem[]>(initialPermissions);
  const [filterLabel, setFilterLabel] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PermissionItem | null>(null);
  const [formExchange, setFormExchange] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formValue, setFormValue] = useState('');

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const filteredData = data.filter(d => !filterLabel || d.label.toLowerCase().includes(filterLabel.toLowerCase()));

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  const handleOpenModal = (item?: PermissionItem) => {
    if (item) {
      setEditingItem(item);
      setFormExchange(item.exchange);
      setFormLabel(item.label);
      setFormValue(item.value.toString());
    } else {
      setEditingItem(null);
      setFormExchange('');
      setFormLabel('');
      setFormValue('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formLabel.trim() || formValue === '' || !formExchange.trim()) return;
    const value = parseInt(formValue);
    if (isNaN(value)) return;

    if (editingItem) {
      setData(data.map(d => (d.id === editingItem.id ? { ...d, exchange: formExchange.trim(), label: formLabel.trim(), value } : d)));
      showToast('赋值配置已更新');
    } else {
      setData([...data, { id: Date.now().toString(), exchange: formExchange.trim(), label: formLabel.trim(), value }]);
      showToast('品种赋值已新增');
    }
    setIsModalOpen(false);
  };

  const executeDelete = () => {
    if (confirmModal.id) {
      setData(data.filter(d => d.id !== confirmModal.id));
      showToast('品种赋值已删除');
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  const deletingItem = data.find(d => d.id === confirmModal.id);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          品种权限表
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[240px]">
          <label className="text-sm font-medium text-slate-700">标签（品种）</label>
          <input
            type="text"
            placeholder="支持模糊搜索"
            value={filterLabel}
            onChange={e => setFilterLabel(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
            <Search className="w-4 h-4" />查询
          </button>
          <button onClick={() => setFilterLabel('')} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" />重置
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <AlertCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[13px] text-slate-600 leading-relaxed">
          品种权限表用于配置各品种标签对应的权限赋值（权重分值），数值越高代表该品种的权限等级越高。系统在计算客户可开通权限时会依据此表的赋值进行匹配与排序。
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button onClick={() => handleOpenModal()} className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> 新增赋值
          </button>
          <div className="text-sm text-slate-500">共 {filteredData.length} 条记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-100">
                <th className="px-6 py-3 whitespace-nowrap w-[30%]">交易所</th>
                <th className="px-6 py-3 whitespace-nowrap w-[40%]">标签（品种）</th>
                <th className="px-6 py-3 whitespace-nowrap w-[15%]">赋值</th>
                <th className="px-6 py-3 whitespace-nowrap w-[15%] sticky right-0 z-10 bg-slate-50 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{d.exchange}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{d.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center min-w-[36px] px-2.5 py-0.5 rounded-md text-sm font-mono font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      {d.value}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap sticky right-0 z-10 bg-white border-l border-slate-100 group-hover:bg-slate-50 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(d)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap">
                        <Edit className="w-4 h-4" /> 编辑
                      </button>
                      <button onClick={() => setConfirmModal({ isOpen: true, id: d.id })} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap">
                        <Trash2 className="w-4 h-4" /> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">暂无匹配的品种赋值记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-800">{editingItem ? '编辑赋值' : '新增赋值'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-700">交易所<span className="text-red-500 ml-0.5">*</span></label>
                <select value={formExchange} onChange={e => setFormExchange(e.target.value)} className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                  <option value="">请选择交易所</option>
                  <option value="上海国际能源交易中心">上海国际能源交易中心</option>
                  <option value="上海期货交易所">上海期货交易所</option>
                  <option value="郑州商品交易所">郑州商品交易所</option>
                  <option value="大连商品交易所">大连商品交易所</option>
                  <option value="广州期货交易所">广州期货交易所</option>
                  <option value="中国金融期货交易所">中国金融期货交易所</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-700">标签（品种）<span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" value={formLabel} onChange={e => setFormLabel(e.target.value)} placeholder="如：股指期货、原油期货" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-700">赋值<span className="text-red-500 ml-0.5">*</span></label>
                <input type="number" value={formValue} onChange={e => setFormValue(e.target.value)} placeholder="如：10、8、5" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-[14px] font-medium transition-colors">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[14px] font-medium flex items-center gap-1.5 transition-colors"><Save className="w-4 h-4" />保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">确认删除</h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                    确认删除品种赋值「<span className="font-semibold text-slate-800">{deletingItem?.label}</span>」（当前赋值 <span className="font-semibold text-slate-800">{deletingItem?.value}</span>）？删除后该品种将不再参与权限赋值计算，此操作不可撤销。
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setConfirmModal({ isOpen: false, id: null })} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">取消</button>
              <button onClick={executeDelete} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium shadow-sm flex items-center gap-1.5 transition-colors"><Trash2 className="w-4 h-4" />确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-lg py-3 px-5 flex items-center gap-3 z-[100] animate-in slide-in-from-top-4 border-l-4 border-emerald-500">
          <Check className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-medium text-slate-800">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
