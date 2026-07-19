import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, Edit, AlertCircle, X, Check, Power, ChevronDown } from "lucide-react";



interface Variety {
  id: string;
  exchange: string;
  name: string;
  code: string;
  category: string[];
  date: string;
  strategyOld: number | null;
  strategyNew: number | null;
  updateTime: string;
  operator: string;
  remark?: string;
}


const initialData: Variety[] = [
  { id: '1', exchange: '上海国际能源交易中心', name: '低硫燃料油', code: 'LU', category: ['特定品种', '商品期权'], date: '2021-06-21 09:00', strategyOld: 22, strategyNew: 23, updateTime: '2026-06-15 10:00:00', operator: '周俊杰' },
  { id: '2', exchange: '上海国际能源交易中心', name: '国际铜', code: 'BC', category: ['特定品种', '商品期权'], date: '2021-06-21 09:00', strategyOld: 22, strategyNew: 23, updateTime: '2026-06-15 10:00:00', operator: '周俊杰' },
  { id: '3', exchange: '上海国际能源交易中心', name: '20号胶', code: 'NR', category: ['特定品种', '商品期权'], date: '2021-06-21 09:00', strategyOld: 22, strategyNew: 23, updateTime: '2026-06-15 10:00:00', operator: '周俊杰' },
  { id: '9', exchange: '上海国际能源交易中心', name: '集运指数（欧线）', code: 'EC', category: ['特定品种', '商品期权'], date: '2023-08-18 09:00', strategyOld: 22, strategyNew: 23, updateTime: '2026-06-15 10:00:00', operator: '周俊杰' },
  { id: '4', exchange: '郑州商品交易所', name: 'PTA', code: 'TA', category: ['特定品种', '商品期权'], date: '2021-06-21 09:00', strategyOld: 30, strategyNew: 31, updateTime: '2026-06-20 14:30:00', operator: '周俊杰' },
  { id: '5', exchange: '郑州商品交易所', name: '对二甲苯', code: 'PX', category: ['特定品种', '商品期权'], date: '2026-05-18 09:00', strategyOld: 46, strategyNew: 47, updateTime: '2026-07-08 09:20:11', operator: '周俊杰' },
  { id: '6', exchange: '郑州商品交易所', name: '瓶片', code: 'PF', category: ['特定品种', '商品期权'], date: '2026-05-18 09:00', strategyOld: 46, strategyNew: 47, updateTime: '2026-07-08 09:20:11', operator: '周俊杰' },
  { id: '7', exchange: '上海期货交易所', name: '镍', code: 'NI', category: ['特定品种', '商品期权'], date: '2026-03-20 09:00', strategyOld: 36, strategyNew: 37, updateTime: '2026-07-10 16:48:30', operator: '周俊杰' },
];


export function Varieties() {
  const [data, setData] = useState<Variety[]>(initialData);
  const [filterExchange, setFilterExchange] = useState('');
  const [filterName, setFilterName] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Variety | null>(null);
  
  // Form states
  const [formExchange, setFormExchange] = useState('');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [formStrategyOld, setFormStrategyOld] = useState<string>('');
  const [formStrategyNew, setFormStrategyNew] = useState<string>('');
  const [formRemark, setFormRemark] = useState('');

  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const filteredData = data.filter(d => {
    if (filterExchange && d.exchange !== filterExchange) return false;
    if (filterName && !d.name.toLowerCase().includes(filterName.toLowerCase())) return false;
    return true;
  });

  const handleReset = () => {
    setFilterExchange('');
    setFilterName('');
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  const handleOpenModal = (item?: Variety) => {
    if (item) {
      setEditingItem(item);
      setFormExchange(item.exchange);
      setFormName(item.name);
      setFormCode(item.code);
      setFormCategory(item.category);
      setFormDate(item.date.replace(' ', 'T'));
      setFormStrategyOld(item.strategyOld?.toString() || '');
      setFormStrategyNew(item.strategyNew?.toString() || '');
      setFormRemark(item.remark || '');
    } else {
      setEditingItem(null);
      setFormExchange('');
      setFormName('');
      setFormCode('');
      setFormCategory([]);
      setFormDate('');
      setFormStrategyOld('');
      setFormStrategyNew('');
      setFormRemark('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formExchange || !formName || !formCode || formCategory.length === 0 || !formDate) {
      alert("请填写必填项");
      return;
    }
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    const newItem: Variety = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      exchange: formExchange,
      name: formName,
      code: formCode.toUpperCase(),
      category: formCategory,
      date: formDate.replace('T', ' '),
      strategyOld: formStrategyOld ? parseInt(formStrategyOld) : null,
      strategyNew: formStrategyNew ? parseInt(formStrategyNew) : null,
      updateTime: dateStr,
      operator: '周俊杰',
      remark: formRemark,
    };

    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? newItem : d));
    } else {
      setData([newItem, ...data]);
    }
    
    setIsModalOpen(false);
    showToast('品种配置已保存');
  };

  
  const isEffective = editingItem ? new Date(editingItem.date.replace(' ', 'T')).getTime() <= Date.now() : false;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          特定品种管理
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium border border-blue-100">配置化</span>
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700">交易所</label>
          <select 
            value={filterExchange} 
            onChange={(e) => setFilterExchange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="">全部</option>
            <option value="上海国际能源交易中心">上海国际能源交易中心</option>
            <option value="上海期货交易所">上海期货交易所</option>
            <option value="郑州商品交易所">郑州商品交易所</option>
            <option value="大连商品交易所">大连商品交易所</option>
            <option value="广州期货交易所">广州期货交易所</option>
            <option value="中国金融期货交易所">中国金融期货交易所</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700">品种名称</label>
          <input 
            type="text" 
            placeholder="支持模糊搜索" 
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={handleReset} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" />重置
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
            <Search className="w-4 h-4" />查询
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenModal()} className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> 新增品种
            </button>
          </div>
          <div className="text-sm text-slate-500">共 {filteredData.length} 条记录</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-100">
                <th className="px-6 py-3 whitespace-nowrap">交易所</th>
                <th className="px-6 py-3 whitespace-nowrap">品种名称</th>
                <th className="px-6 py-3 whitespace-nowrap">编码</th>
                <th className="px-6 py-3 whitespace-nowrap">类别</th>
                <th className="px-6 py-3 whitespace-nowrap">生效时间</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">策略(旧)</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">策略(新)</th>
                <th className="px-6 py-3 whitespace-nowrap">更新时间</th>
                <th className="px-6 py-3 whitespace-nowrap">操作人</th>
                <th className="px-6 py-3 whitespace-nowrap sticky right-0 z-10 bg-slate-50 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{d.exchange}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{d.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-600 whitespace-nowrap">{d.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      {d.category.map(c => (
                        <span key={c} className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${                          c === '特定品种' ? 'bg-blue-50 text-blue-600' :
                          c === '商品期权' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{d.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 whitespace-nowrap text-center">{d.strategyOld ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 whitespace-nowrap text-center">{d.strategyNew ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{d.updateTime}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">{d.operator}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap sticky right-0 z-10 bg-white border-l border-slate-100 group-hover:bg-slate-50 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal(d)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap">
                        <Edit className="w-4 h-4" /> 编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm text-slate-400">暂无匹配的记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl shrink-0">
              <h3 className="text-lg font-bold text-slate-800">{editingItem ? `编辑品种 — ${formExchange} ${formName}` : '新增品种'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">

                            {isEffective && (
                <div className="mb-6 p-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-800 flex gap-3 text-[13px]">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-semibold mb-0.5">该品种配置已生效</div>
                    <div className="text-amber-700">生效后的品种信息（除备注外）不可修改。</div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="text-[15px] font-semibold text-slate-800 mb-4 pl-2.5 border-l-4 border-blue-600">基本信息</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">交易所<span className="text-red-500 ml-0.5">*</span></label>
                    <select value={formExchange} onChange={e => setFormExchange(e.target.value)} className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" disabled={isEffective}>
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
                    <label className="text-[13px] font-medium text-slate-700">品种名称<span className="text-red-500 ml-0.5">*</span></label>
                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="如：镍、碳酸锂" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" disabled={isEffective} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">品种编码<span className="text-red-500 ml-0.5">*</span></label>
                    <input type="text" value={formCode} onChange={e => setFormCode(e.target.value)} placeholder="如：NI、LC" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed uppercase" disabled={isEffective} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">品种类别<span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                      <div 
                        className={`w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg flex items-center justify-between outline-none ${isEffective ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                        onClick={() => !isEffective && setIsCategoryOpen(!isCategoryOpen)}
                      >
                        <span className="truncate">{formCategory.length > 0 ? formCategory.join('、') : '请选择品种类别'}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                      {isCategoryOpen && !isEffective && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
                            {['特定品种', '商品期权'].map(opt => (
                              <label key={opt} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer relative z-50">
                                <input 
                                  type="checkbox" 
                                  className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  checked={formCategory.includes(opt)}
                                  onChange={(e) => {
                                    if(e.target.checked) setFormCategory([...formCategory, opt]);
                                    else setFormCategory(formCategory.filter(c => c !== opt));
                                  }}
                                />
                                <span className="text-[13px] text-slate-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">生效时间<span className="text-red-500 ml-0.5">*</span></label>
                    <input type="datetime-local" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" disabled={isEffective} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">策略编号(旧)<span className="text-red-500 ml-0.5">*</span></label>
                    <input type="number" value={formStrategyOld} onChange={e => setFormStrategyOld(e.target.value)} placeholder="如：36" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" disabled={isEffective} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-700">策略编号(新)<span className="text-red-500 ml-0.5">*</span></label>
                    <input type="number" value={formStrategyNew} onChange={e => setFormStrategyNew(e.target.value)} placeholder="如：37" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed" disabled={isEffective} />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-700">备注</label>
                    <input type="text" value={formRemark} onChange={e => setFormRemark(e.target.value)} placeholder="如来源通知文号：郑商函[2026]438号" className="w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-[14px] font-medium transition-colors">
                取消
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[14px] font-medium transition-colors">
                保存
              </button>
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
