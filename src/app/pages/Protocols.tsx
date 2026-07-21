import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Download,
  Settings,
  Trash2,
  X,
  Power,
  FileText,
  FileUp,
  Eye,
  FileBadge,
  Link,
  History,
  GitCompare,
  Check,
  AlertCircle,
  AlertTriangle
} from "lucide-react";

export function Protocols() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stampFilter, setStampFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<any>(null);
  const [protocolName, setProtocolName] = useState('');
  const [protocolVersion, setProtocolVersion] = useState('V1.0.0');
  const [protocolRemark, setProtocolRemark] = useState('');
  const [stamp, setStamp] = useState('none');

  // Version comparison state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareVersion1, setCompareVersion1] = useState<string>('');
  const [compareVersion2, setCompareVersion2] = useState<string>('');

  // Table selection state
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Bound businesses modal state
  const [isBoundModalOpen, setIsBoundModalOpen] = useState(false);
  const [selectedBoundProtocol, setSelectedBoundProtocol] = useState<any>(null);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string, action: string, protocol: any, boundBusinesses: any[]}>({isOpen: false, id: '', action: '', protocol: null, boundBusinesses: []});

  // Delete warning modal state (for bound protocols)
  const [deleteWarningModal, setDeleteWarningModal] = useState<{isOpen: boolean, protocol: any, boundBusinesses: any[]}>({isOpen: false, protocol: null, boundBusinesses: []});

  // Delete confirm modal state (for unbound protocols)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, id: string}>({isOpen: false, id: ''});

  // Mock data for Protocols
  const [protocols, setProtocols] = useState(() => {
    const savedProtocols = localStorage.getItem('mock_protocols');
    const savedBusinesses = localStorage.getItem('mock_businesses');
    
    let currentProtocols = savedProtocols ? JSON.parse(savedProtocols) : [
      { id: 'PROT-1001', name: '《适当性匹配告知书》', version: 'V2.1.0', boundCount: 12, status: 'active', stamp: 'none', creator: '系统管理员', createdAt: '2023-11-01 09:00', updater: '张三', updated: '2023-11-01 10:00' },
      { id: 'PROT-1002', name: '《风险揭示书》', version: 'V3.0.0', boundCount: 25, status: 'active', stamp: 'none', creator: '李四', createdAt: '2023-11-02 10:15', updater: '李四', updated: '2023-11-05 14:30' },
      { id: 'PROT-1003', name: '《隐私权政策说明》', version: 'V1.5.0', boundCount: 40, status: 'active', stamp: 'corp', creator: '系统管理员', createdAt: '2023-10-20 14:00', updater: '系统管理员', updated: '2023-10-22 09:15' },
      { id: 'PROT-1004', name: '《期权开户承诺书》', version: 'V1.0.0', boundCount: 3, status: 'active', stamp: 'none', creator: '王五', createdAt: '2023-09-12 11:20', updater: '王五', updated: '2023-09-12 11:20' },
      { id: 'PROT-1005', name: '《自动入金授权协议》', version: 'V1.2.0', boundCount: 5, status: 'disabled', stamp: 'finance', creator: '赵六', createdAt: '2023-08-10 09:30', updater: '张三', updated: '2023-08-15 16:45' },
      { id: 'PROT-1006', name: '《数字证书使用协议》', version: 'V2.0.1', boundCount: 18, status: 'active', stamp: 'corp', creator: '系统管理员', createdAt: '2023-11-08 10:00', updater: '李四', updated: '2023-11-08 11:10' },
    ];

    if (savedBusinesses) {
      const businesses = JSON.parse(savedBusinesses);
      currentProtocols = currentProtocols.map((p: any) => {
        let count = 0;
        businesses.forEach((b: any) => {
          if (b.preProtocols.includes(p.name) || b.postProtocols.includes(p.name)) {
            count++;
          }
        });
        return { ...p, boundCount: count };
      });
    }

    return currentProtocols;
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('mock_protocols', JSON.stringify(protocols));
    window.dispatchEvent(new Event('protocols_updated'));
  }, [protocols]);

  // Listen to cross-page localStorage updates for real-time sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mock_protocols' && e.newValue) {
        try {
          const updatedProtocols = JSON.parse(e.newValue);
          // Only update if we actually have valid array data
          if (Array.isArray(updatedProtocols)) {
            setProtocols(updatedProtocols);
          }
        } catch (error) {
          console.error("Error syncing protocols from storage:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Document Versions State for the Modal
  const [templateVersions, setTemplateVersions] = useState([
    { id: 1, version: 'V2.1.0', creator: '张三', createTime: '2023-11-01 10:00', updater: '李四', updateTime: '2023-11-05 14:30', remark: '根据新规更新了免责声明和风险揭示条款' },
    { id: 2, version: 'V2.0.0', creator: '张三', createTime: '2023-05-12 09:15', updater: '张三', updateTime: '2023-05-12 09:15', remark: '2023年度大版本整体修订' },
    { id: 3, version: 'V1.0.0', creator: '系统管理员', createTime: '2022-01-10 11:00', updater: '王五', updateTime: '2022-02-15 16:20', remark: '业务初次上线基础版本' },
  ]);

  const filteredProtocols = protocols.filter(p => {
    const matchSearch = p.name.includes(searchTerm) || p.id.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchStamp = stampFilter === 'all' || p.stamp === stampFilter;
    return matchSearch && matchStatus && matchStamp;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">启用中</span>;
      case 'disabled':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">已停用</span>;
      default:
        return null;
    }
  };

  const getStampLabel = (stamp: string) => {
    switch(stamp) {
      case 'none': return '仅客户签字';
      case 'corp': return '加盖公司公章';
      case 'finance': return '加盖财务专用章';
      case 'compliance': return '加盖合规稽核章';
      default: return '未设置';
    }
  };

  const handleOpenModal = (protocol: any = null) => {
    setEditingProtocol(protocol);
    setProtocolName(protocol ? protocol.name : '');
    setProtocolVersion(protocol ? protocol.version : 'V1.0.0');
    setProtocolRemark(protocol?.remark || '');
    setStamp(protocol?.stamp || 'none');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProtocol(null);
    setProtocolName('');
    setProtocolVersion('V1.0.0');
    setProtocolRemark('');
    setStamp('none');
  };

  const handleSaveProtocol = () => {
    if (editingProtocol) {
      setProtocols(protocols.map(p => p.id === editingProtocol.id ? {
        ...p,
        name: protocolName,
        version: protocolVersion,
        remark: protocolRemark,
        stamp,
        updated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      } : p));
    } else {
      const newProtocol = {
        id: `PROT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: protocolName,
        stamp,
        version: protocolVersion,
        remark: protocolRemark,
        boundCount: 0,
        status: 'active',
        creator: '系统管理员',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        updater: '系统管理员',
        updated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      setProtocols([newProtocol, ...protocols]);
    }
    handleCloseModal();
  };

  const handleToggleStatusClick = (id: string) => {
    const protocol = protocols.find(p => p.id === id);
    if (!protocol) return;
    const action = protocol.status === 'active' ? '停用' : '启用';

    let bound: any[] = [];
    if (protocol.boundCount > 0) {
      const savedBusinesses = localStorage.getItem('mock_businesses');
      const businesses = savedBusinesses ? JSON.parse(savedBusinesses) : [];
      bound = businesses.filter((b: any) => 
        b.preProtocols.includes(protocol.name) || b.postProtocols.includes(protocol.name)
      );
    }

    setConfirmModal({ isOpen: true, id, action, protocol, boundBusinesses: bound });
  };

  const executeToggleStatus = () => {
    setProtocols(protocols.map(p => {
      if (p.id === confirmModal.id) {
        return { ...p, status: p.status === 'active' ? 'disabled' : 'active' };
      }
      return p;
    }));
    setConfirmModal({ isOpen: false, id: '', action: '', protocol: null, boundBusinesses: [] });
  };

  const handleDelete = (id: string) => {
    const protocol = protocols.find(p => p.id === id);
    if (!protocol) return;

    if (protocol.boundCount > 0) {
      const savedBusinesses = localStorage.getItem('mock_businesses');
      const businesses = savedBusinesses ? JSON.parse(savedBusinesses) : [];
      const bound = businesses.filter((b: any) => 
        b.preProtocols.includes(protocol.name) || b.postProtocols.includes(protocol.name)
      );
      setDeleteWarningModal({
        isOpen: true,
        protocol,
        boundBusinesses: bound
      });
    } else {
      setDeleteConfirmModal({ isOpen: true, id });
    }
  };

  const executeDelete = () => {
    if (deleteConfirmModal.id) {
      setProtocols(protocols.filter(p => p.id !== deleteConfirmModal.id));
    }
    setDeleteConfirmModal({ isOpen: false, id: '' });
  };

  const executeDeleteWithUnbind = () => {
    const protocol = deleteWarningModal.protocol;
    if (!protocol) return;

    // Unbind from businesses
    const savedBusinesses = localStorage.getItem('mock_businesses');
    if (savedBusinesses) {
      const businesses = JSON.parse(savedBusinesses);
      const updatedBusinesses = businesses.map((b: any) => ({
        ...b,
        preProtocols: b.preProtocols.filter((name: string) => name !== protocol.name),
        postProtocols: b.postProtocols.filter((name: string) => name !== protocol.name)
      }));
      localStorage.setItem('mock_businesses', JSON.stringify(updatedBusinesses));
    }

    // Delete protocol
    setProtocols(protocols.filter(p => p.id !== protocol.id));
    
    // Close modal
    setDeleteWarningModal({ isOpen: false, protocol: null, boundBusinesses: [] });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredProtocols.map(p => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter(rowId => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleOpenBoundModal = (protocol: any) => {
    setSelectedBoundProtocol(protocol);
    setIsBoundModalOpen(true);
  };

  const handleCloseBoundModal = () => {
    setIsBoundModalOpen(false);
    setSelectedBoundProtocol(null);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Filters Area */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">协议名称</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="请输入协议名称" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">相关业务</label>
            <select className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none">
              <option value="">全部</option>
              {['身份证有效期更新', '电话号码更新', '邮编地址更新', '新增银行卡', '删除银行卡', '交易权限申请', '职业信息更新', '休眠账户激活', '适当性测评', '解除10元基础保证金', '期货销户', '更换银行卡', '增开交易编码', '基本资料变更', '注销交易编码/权限', '其他信息修改', '交易权限申请(新)', '交易权限证明开具', '休眠客户入金申请', '资产证明开具', '账户规范', '程序化报备', '银期签约', '银期解约'].map(biz => (
                <option key={biz} value={biz}>{biz}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">状态</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="all">全部</option>
              <option value="active">启用中</option>
              <option value="disabled">已停用</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">用章策略</label>
            <select 
              value={stampFilter}
              onChange={(e) => setStampFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="all">全部</option>
              <option value="none">仅客户签字</option>
              <option value="corp">加盖公司公章</option>
              <option value="finance">加盖财务专用章</option>
              <option value="compliance">加盖合规稽核章</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">创建人</label>
            <input 
              type="text" 
              placeholder="请输入创建人" 
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">创建时间</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">更新人</label>
            <input 
              type="text" 
              placeholder="请输入更新人" 
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">更新时间</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-5 border-t border-slate-100">
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            查询
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setStampFilter('all');
            }}
            className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Action Buttons Area */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 bg-slate-50/50">
          <button 
            onClick={() => handleOpenModal()}
            className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建协议模板
          </button>
          <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Download className="w-4 h-4" />
            批量导出
          </button>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-100">
                <th className="px-6 py-3 whitespace-nowrap w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredProtocols.length > 0 && selectedRowIds.length === filteredProtocols.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">协议编号</th>
                <th className="px-6 py-3 whitespace-nowrap">协议名称</th>
                <th className="px-6 py-3 whitespace-nowrap">当前版本</th>
                <th className="px-6 py-3 whitespace-nowrap">用章策略</th>
                <th className="px-6 py-3 whitespace-nowrap">状态</th>
                <th className="px-6 py-3 whitespace-nowrap">绑定业务数</th>
                
                <th className="px-6 py-3 whitespace-nowrap">创建人</th>
                <th className="px-6 py-3 whitespace-nowrap">创建时间</th>
                <th className="px-6 py-3 whitespace-nowrap">更新人</th>
                <th className="px-6 py-3 whitespace-nowrap">最后更新时间</th>
                <th className="px-6 py-3 whitespace-nowrap sticky right-0 z-10 bg-slate-50 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProtocols.map((protocol) => (
                <tr key={protocol.id} className={`hover:bg-slate-50 transition-colors group ${selectedRowIds.includes(protocol.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedRowIds.includes(protocol.id)}
                      onChange={() => handleSelectRow(protocol.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{protocol.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      {protocol.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <FileBadge className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{protocol.version}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {getStampLabel(protocol.stamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      protocol.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                        : 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20'
                    }`}>
                      {protocol.status === 'active' ? '启用中' : '已停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors group/link"
                      onClick={() => handleOpenBoundModal(protocol)}
                    >
                      <Link className="w-4 h-4 text-slate-400 group-hover/link:text-blue-500" />
                      <span className="underline decoration-slate-300 underline-offset-2">{protocol.boundCount} 个业务</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {protocol.creator}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {protocol.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {protocol.updater}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {protocol.updated}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap sticky right-0 z-10 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)] ${selectedRowIds.includes(protocol.id) ? 'bg-blue-50/50 group-hover:bg-blue-50/80' : 'bg-white group-hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleOpenModal(protocol)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        <Settings className="w-4 h-4" /> 管理与版本
                      </button>
                      
                      <button 
                        onClick={() => handleToggleStatusClick(protocol.id)}
                        className={`${protocol.status === 'active' ? 'text-orange-500 hover:text-orange-700' : 'text-emerald-600 hover:text-emerald-800'} text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap`}
                      >
                        <Power className="w-4 h-4" /> {protocol.status === 'active' ? '停用' : '启用'}
                      </button>

                      <button 
                        onClick={() => handleDelete(protocol.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                        title="删除协议"
                      >
                        <Trash2 className="w-4 h-4" /> 删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="text-sm text-slate-500">
            共 <span className="font-medium text-slate-700">{protocols.length}</span> 个协议模板
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded font-medium">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 md:p-8 xl:p-12">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {editingProtocol ? '协议模板维护' : '新建协议模板'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              
              {/* Protocol Basic Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">协议名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={protocolName}
                    onChange={(e) => setProtocolName(e.target.value)}
                    placeholder="例如：《适当性匹配告知书》" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">用章策略 <span className="text-red-500">*</span></label>
                  <select 
                    value={stamp}
                    onChange={(e) => setStamp(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    <option value="none">仅客户签字 (不加盖企业章)</option>
                    <option value="corp">电子凭证章</option>
                    <option value="finance">加盖财务专用章 (银期业务专用)</option>
                    <option value="compliance">加盖合规稽核章</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">版本号 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={protocolVersion}
                    onChange={(e) => setProtocolVersion(e.target.value)}
                    placeholder="例如：V1.0.0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">版本说明</label>
                  <input 
                    type="text" 
                    value={protocolRemark}
                    onChange={(e) => setProtocolRemark(e.target.value)}
                    placeholder="简要描述此版本的更新内容"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Version History & Upload */}
              <div className="border border-slate-200 rounded-lg p-6 relative">
                <div className="absolute -top-3 left-6 bg-white px-2 text-sm font-bold text-blue-600 flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  {editingProtocol ? '协议正文与版本库' : '上传协议正文'}
                </div>
                
                {/* Upload Area */}
                <div className={editingProtocol ? "mt-4 mb-6" : "mt-4"}>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                      <p className="mb-1 text-sm text-slate-600"><span className="font-semibold text-blue-600">点击上传</span> 或拖拽文件至此处上传新版本协议模板</p>
                      <p className="text-xs text-slate-500">支持 PDF, DOCX, DOC, HTML 格式 (最大 50MB)</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* Version Table */}
                {editingProtocol && (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">版本号</th>
                          <th className="px-4 py-3">创建人</th>
                          <th className="px-4 py-3">创建时间</th>
                          <th className="px-4 py-3">更新人</th>
                          <th className="px-4 py-3">更新时间</th>
                          <th className="px-4 py-3">版本说明</th>
                          <th className="px-4 py-3 text-left">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {templateVersions.map((v, i) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-700">
                              <div className="flex items-center gap-2">
                                <FileBadge className="w-4 h-4 text-blue-500" />
                                {v.version}
                                {i === 0 && <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-medium leading-none">现行版本</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{v.creator}</td>
                            <td className="px-4 py-3 text-slate-500">{v.createTime}</td>
                            <td className="px-4 py-3 text-slate-600">{v.updater}</td>
                            <td className="px-4 py-3 text-slate-500">{v.updateTime}</td>
                            <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={v.remark}>{v.remark}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors font-medium">
                                  <Eye className="w-4 h-4" /> 预览
                                </button>
                                <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors font-medium">
                                  <Download className="w-4 h-4" /> 下载
                                </button>
                                {templateVersions.length > 1 && (
                                  null
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="text-sm text-slate-500 flex items-center gap-1.5">
                <Link className="w-4 h-4" />
                当前协议已被 <span className="font-bold text-slate-700">{editingProtocol?.boundCount || 0}</span> 个业务场景绑定
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveProtocol}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  保存并发布版本
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Comparison Modal */}
      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-purple-600" />
                版本对比
              </h3>
              <button
                onClick={() => {
                  setIsCompareModalOpen(false);
                  setCompareVersion1('');
                  setCompareVersion2('');
                }}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Version Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">基准版本</label>
                  <select
                    value={compareVersion1}
                    onChange={(e) => setCompareVersion1(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white"
                  >
                    <option value="">请选择版本</option>
                    {templateVersions.map(v => (
                      <option key={v.id} value={v.version}>{v.version} - {v.createTime}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">对比版本</label>
                  <select
                    value={compareVersion2}
                    onChange={(e) => setCompareVersion2(e.target.value)}
                    className="px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm bg-white"
                  >
                    <option value="">请选择版本</option>
                    {templateVersions.filter(v => v.version !== compareVersion1).map(v => (
                      <option key={v.id} value={v.version}>{v.version} - {v.createTime}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Result */}
              {compareVersion1 && compareVersion2 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    {/* Left Panel - Base Version */}
                    <div className="bg-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
                          {compareVersion1}
                        </span>
                        <span className="text-xs text-slate-500">
                          {templateVersions.find(v => v.version === compareVersion1)?.createTime}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 mb-3 font-medium">版本信息</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">创建人:</span>
                            <span className="text-slate-700">{templateVersions.find(v => v.version === compareVersion1)?.creator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">更新人:</span>
                            <span className="text-slate-700">{templateVersions.find(v => v.version === compareVersion1)?.updater}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-slate-500 mb-1">版本说明:</p>
                            <p className="text-slate-700">{templateVersions.find(v => v.version === compareVersion1)?.remark}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 mb-3 font-medium">主要内容差异</p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <span className="w-16 shrink-0 text-slate-500">第3条款</span>
                            <span className="text-slate-700">用户在使用本平台服务时应遵守相关法律法规</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="w-16 shrink-0 text-slate-500">第5条款</span>
                            <span className="text-slate-700">平台有权根据实际情况调整服务内容</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Compare Version */}
                    <div className="bg-slate-50 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium">
                          {compareVersion2}
                        </span>
                        <span className="text-xs text-slate-500">
                          {templateVersions.find(v => v.version === compareVersion2)?.createTime}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 mb-3 font-medium">版本信息</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">创建人:</span>
                            <span className="text-slate-700">{templateVersions.find(v => v.version === compareVersion2)?.creator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">更新人:</span>
                            <span className="text-slate-700">{templateVersions.find(v => v.version === compareVersion2)?.updater}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-slate-500 mb-1">版本说明:</p>
                            <p className="text-slate-700">{templateVersions.find(v => v.version === compareVersion2)?.remark}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 mb-3 font-medium flex items-center gap-2">
                          主要内容差异
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">有变更</span>
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <span className="w-16 shrink-0 text-slate-500">第3条款</span>
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">用户在使用本平台服务时应严格遵守相关法律法规及监管要求</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="w-16 shrink-0 text-slate-500">第5条款</span>
                            <span className="text-slate-700">平台有权根据实际情况调整服务内容</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs bg-emerald-50 p-2 rounded border border-emerald-200">
                            <span className="w-16 shrink-0 text-emerald-700 font-medium">新增第7条款</span>
                            <span className="text-emerald-700">用户信息保护及隐私政策详见附件</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center">
                  <GitCompare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">请选择两个版本进行对比</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
              <button
                onClick={() => {
                  setIsCompareModalOpen(false);
                  setCompareVersion1('');
                  setCompareVersion2('');
                }}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                关闭
              </button>
              {compareVersion1 && compareVersion2 && (
                <button
                  onClick={() => alert('导出对比报告功能开发中...')}
                  className="px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出对比报告
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Bound Businesses Modal */}
      {isBoundModalOpen && selectedBoundProtocol && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Link className="w-5 h-5 text-blue-600" />
                绑定业务场景 - {selectedBoundProtocol.name}
              </h3>
              <button
                onClick={handleCloseBoundModal}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-white">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="text-sm text-slate-700 font-medium">适当性测评完成</span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">启用中</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="text-sm text-slate-700 font-medium">期权开户</span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">启用中</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50 shrink-0">
              <button
                onClick={handleCloseBoundModal}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-slate-800 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold">操作确认</h3>
              </div>
              <div className="text-slate-600 text-sm ml-[3.25rem] space-y-3">
                <p>
                  确定要<span className={confirmModal.action === '停用' ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>{confirmModal.action}</span>该协议模板吗？
                </p>
                {confirmModal.protocol && confirmModal.protocol.boundCount > 0 && confirmModal.action === '停用' && (
                  <div className="bg-amber-50 p-3 rounded border border-amber-100 mt-2 text-amber-700">
                    <p>当前协议已被 
                      <span className="font-bold text-slate-800 mx-1">
                        【{confirmModal.boundBusinesses.map((b: any) => b.name).join('】、【')}】
                      </span>
                      共 {confirmModal.boundBusinesses.length} 个业务场景绑定。
                    </p>
                    <p className="mt-1">
                      继续停用后，此协议将在这些业务场景的配置中变为置灰不可选状态。
                    </p>
                  </div>
                )}
                {confirmModal.protocol && confirmModal.protocol.boundCount > 0 && confirmModal.action === '启用' && (
                  <div className="bg-emerald-50 p-3 rounded border border-emerald-100 mt-2 text-emerald-700">
                    <p>当前协议已被 
                      <span className="font-bold text-slate-800 mx-1">
                        【{confirmModal.boundBusinesses.map((b: any) => b.name).join('】、【')}】
                      </span>
                      共 {confirmModal.boundBusinesses.length} 个业务场景绑定。
                    </p>
                    <p className="mt-1">启用后将恢复正常展示及使用。</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, id: '', action: '', protocol: null, boundBusinesses: [] })}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={executeToggleStatus}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmModal.action === '停用' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {confirmModal.action === '停用' ? '确定停用' : '确定启用'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {deleteWarningModal.isOpen && deleteWarningModal.protocol && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-slate-800 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold">删除确认</h3>
              </div>
              <div className="text-slate-600 text-sm ml-[3.25rem] space-y-3">
                <p>
                  确定要删除该项吗？此操作无法恢复。
                </p>
                <div className="bg-red-50 p-3 rounded border border-red-100 mt-2 text-red-700">
                  <p>
                    当前协议已被
                    <span className="font-bold text-slate-800 mx-1">
                      【{deleteWarningModal.boundBusinesses.map((b: any) => b.name).join('】、【')}】
                    </span>
                    共 {deleteWarningModal.boundBusinesses.length} 个业务场景绑定。
                  </p>
                  <p className="mt-1 font-medium">
                    继续删除将自动从这些业务场景中解绑该协议。
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setDeleteWarningModal({ isOpen: false, protocol: null, boundBusinesses: [] })}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={executeDeleteWithUnbind}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                我已知晓，强制删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal (for unbound protocols) */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-slate-800 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold">删除确认</h3>
              </div>
              <p className="text-slate-600 text-sm ml-[3.25rem]">
                确定要删除该项吗？此操作无法恢复。
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: '' })}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}