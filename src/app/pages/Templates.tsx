import { useState, useEffect } from "react";
// TEST COMMENT
import { useNavigate } from "react-router";
import { 
  Plus, 
  Search, 
  RefreshCw,
  Download,
  Settings,
  Trash2,
  X,
  Power,
  PlusCircle,
  FileText,
  FileUp,
  Eye,
  FileBadge,
  FileSpreadsheet,
  Upload,
  ArrowRight,
  AlertCircle,
  AlertTriangle
} from "lucide-react";

export function Templates() {
  const navigate = useNavigate();
  const [scenarioSearchTerm, setScenarioSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [scenarioName, setScenarioName] = useState('');
  const [businessNames, setBusinessNames] = useState<string[]>(['适当性测评']);
  const [isBusinessSelectOpen, setIsBusinessSelectOpen] = useState(false);

  const BIZ_OPTIONS = ['身份证有效期更新', '电话号码更新', '邮编地址更新', '新增银行卡', '删除银行卡', '交易权限申请', '职业信息更新', '休眠账户激活', '适当性测评', '解除10元基础保证金', '期货销户', '更换银行卡', '增开交易编码', '基本资料变更', '注销交易编码/权限', '其他信息修改', '交易权限申请(新)', '交易权限证明开具', '休眠客户入金申请', '资产证明开具', '账户规范', '程序化报备', '银期签约', '银期解约'];

  const handleToggleBusinessName = (biz: string) => {
    if (businessNames.includes(biz)) {
      setBusinessNames(businessNames.filter(b => b !== biz));
    } else {
      setBusinessNames([...businessNames, biz]);
    }
  };

  // Target Audience state
  const [audienceType, setAudienceType] = useState('all');
  const [selectedAudienceGroup, setSelectedAudienceGroup] = useState('professional');
  const [audienceFile, setAudienceFile] = useState<File | null>(null);

  // Batch import/export state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Dual Protocols Dropdown state
  const [preProtocols, setPreProtocols] = useState<string[]>(['《适当性匹配告知书》']);
  const [postProtocols, setPostProtocols] = useState<string[]>([]);
  
  const [protocolOptions, setProtocolOptions] = useState<{name: string, status: string}[]>([
    { name: '《适当性匹配告知书》', status: 'active' }, 
    { name: '《风险揭示书》', status: 'active' }, 
    { name: '《隐私权政策说明》', status: 'active' }, 
    { name: '《期权开户承诺书》', status: 'active' }, 
    { name: '《自动入金授权协议》', status: 'active' }, 
    { name: '《数字证书使用协议》', status: 'active' }
  ]);

  useEffect(() => {
    const fetchProtocols = () => {
      const saved = localStorage.getItem('mock_protocols');
      if (saved) {
        try {
          const protocols = JSON.parse(saved);
          if (Array.isArray(protocols)) {
            setProtocolOptions(protocols.map((p: any) => ({ name: p.name, status: p.status || 'active' })));
          }
        } catch (e) {
          console.error('Failed to parse protocols', e);
        }
      }
    };

    fetchProtocols();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mock_protocols') {
        fetchProtocols();
      }
    };
    
    const handleCustomSync = () => {
      fetchProtocols();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('protocols_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('protocols_updated', handleCustomSync);
    };
  }, []);

  // Dynamic Rules State with Phase and Target Type
  const [rules, setRules] = useState<any[]>([
    { id: 1, phase: 'pre', type: 'group', target: '专业投资者', action: 'replace', protocol: '《适当性匹配告知书 (专业版)》', fileName: null },
    { id: 2, phase: 'post', type: 'list', target: '', action: 'append', protocol: '《风险揭示书》', fileName: '202311_特邀用户名单.xlsx' }
  ]);

  // Table selection state
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string, action: string, business: any}>({isOpen: false, id: '', action: '', business: null});

  // Delete confirm modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, id: string, business: any}>({isOpen: false, id: '', business: null});

  // Data represents Business scenarios with both pre and post protocols
  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('mock_businesses');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data if missing scenarioName
      if (parsed.length > 0 && !parsed[0].scenarioName) {
        localStorage.removeItem('mock_businesses');
      } else {
        return parsed;
      }
    }
    return [
      { id: 'BIZ-001', scenarioName: '适当性测评基础场景', businessNames: ['适当性测评'], preProtocols: ['《适当性匹配告知书》'], postProtocols: [], status: 'active', createdAt: '2023-10-24 14:30', creator: '系统管理员', updater: '系统管理员', version: 'V1.0.0', updated: '2023-10-24 14:30', audienceType: 'all' },
      { id: 'BIZ-002', scenarioName: '权限申请通用', businessNames: ['交易权限申请', '交易权限申请(新)'], preProtocols: ['《隐私权政策说明》'], postProtocols: [], status: 'active', createdAt: '2023-10-22 09:15', creator: '张三', updater: '李四', version: 'V1.1.2', updated: '2023-10-22 09:15', audienceType: 'group', audienceGroup: 'professional' },
      { id: 'BIZ-003', scenarioName: '编码增开(休眠户)', businessNames: ['增开交易编码'], preProtocols: ['《风险揭示书》'], postProtocols: ['《数字证书使用协议》'], status: 'disabled', createdAt: '2023-11-01 16:45', creator: '王五', updater: '系统管理员', version: 'V2.0.1', updated: '2023-11-01 16:45', audienceType: 'all' },
      { id: 'BIZ-004', scenarioName: '建行银期专属', businessNames: ['银期签约'], preProtocols: [], postProtocols: ['《自动入金授权协议》'], status: 'active', createdAt: '2023-09-12 11:20', creator: '赵六', updater: '张三', version: 'V1.0.5', updated: '2023-09-12 11:20', audienceType: 'list', audienceFileName: '特邀名单.xlsx' },
      { id: 'BIZ-005', scenarioName: '解约后置测评', businessNames: ['银期解约'], preProtocols: ['《风险揭示书》'], postProtocols: ['《期权开户承诺书》'], status: 'active', createdAt: '2023-11-05 10:10', creator: '系统管理员', updater: '系统管理员', version: 'V3.0.0', updated: '2023-11-05 10:10' },
      { id: 'BIZ-006', scenarioName: '客户资料核心变更', businessNames: ['基本资料变更', '职业信息更新', '其他信息修改'], preProtocols: ['《隐私权政策说明》'], postProtocols: [], status: 'active', createdAt: '2023-11-08 09:20', creator: '李四', updater: '系统管理员', version: 'V1.2.0', updated: '2023-11-08 14:15', audienceType: 'all' },
      { id: 'BIZ-007', scenarioName: '账户规范清理', businessNames: ['账户规范', '休眠账户激活', '注销交易编码/权限'], preProtocols: ['《风险揭示书》'], postProtocols: [], status: 'active', createdAt: '2023-11-10 11:05', creator: '系统管理员', updater: '张三', version: 'V2.1.0', updated: '2023-11-10 16:30', audienceType: 'all' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mock_businesses', JSON.stringify(businesses));
    
    // Sync protocol bound counts cross-page
    const savedProtocols = localStorage.getItem('mock_protocols');
    if (savedProtocols) {
      try {
        let parsedProtocols = JSON.parse(savedProtocols);
        parsedProtocols = parsedProtocols.map((p: any) => {
          let count = 0;
          businesses.forEach((b: any) => {
            if (b.preProtocols?.includes(p.name) || b.postProtocols?.includes(p.name)) {
              count++;
            }
          });
          return { ...p, boundCount: count };
        });
        localStorage.setItem('mock_protocols', JSON.stringify(parsedProtocols));
      } catch (e) {
        console.error('Failed to sync protocols', e);
      }
    }
  }, [businesses]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(businesses.map(b => b.id));
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

  const getAudienceLabel = (business: any) => {
    if (!business.audienceType || business.audienceType === 'all') return '全量用户';
    if (business.audienceType === 'group') {
      return business.audienceGroup === 'professional' ? '用户客群: 专业投资者' : `用户客群: ${business.audienceGroup || '未知'}`;
    }
    if (business.audienceType === 'list') {
      return `特定名单${business.audienceFileName ? ` (${business.audienceFileName})` : ''}`;
    }
    return '全量用户';
  };

  const handleOpenModal = (business: any = null) => {
    setEditingBusiness(business);
    setScenarioName(business ? business.scenarioName : '');
    setBusinessNames(business && business.businessNames ? business.businessNames : ['适当性测评']);
    setRules([
      { id: Date.now(), phase: 'pre', type: 'group', target: '专业投资者', action: 'replace', protocol: '《适当性匹配告知书 (专业版)》', fileName: null },
      { id: Date.now() + 1, phase: 'post', type: 'list', target: '', action: 'append', protocol: '《风险揭示书》', fileName: null }
    ]);
    setPreProtocols(business ? business.preProtocols : ['《适当性匹配告知书》']);
    setPostProtocols(business ? business.postProtocols : []);
    setAudienceType(business?.audienceType || 'all');
    setSelectedAudienceGroup(business?.audienceGroup || 'professional');
    setAudienceFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBusiness(null);
    setAudienceFile(null);
    setSelectedAudienceGroup('professional');
  };

  const handleSaveBusiness = () => {
    if (editingBusiness) {
      setBusinesses(businesses.map(b => b.id === editingBusiness.id ? {
        ...b,
        scenarioName,
        businessNames,
        name: businessNames.join(', '),
        preProtocols,
        postProtocols,
        audienceType,
        audienceGroup: selectedAudienceGroup,
        audienceFileName: audienceFile ? audienceFile.name : b.audienceFileName,
        updated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      } : b));
    } else {
      const newBusiness = {
        id: `BIZ-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        scenarioName,
        businessNames,
        name: businessNames.join(', '),
        preProtocols,
        postProtocols,
        audienceType,
        audienceGroup: selectedAudienceGroup,
        audienceFileName: audienceFile ? audienceFile.name : null,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        creator: '系统管理员',
        updater: '系统管理员',
        version: 'V1.0.0',
        updated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      setBusinesses([newBusiness, ...businesses]);
    }
    handleCloseModal();
  };

  const handleTogglePreProtocol = (p: string) => {
    if (preProtocols.includes(p)) {
      setPreProtocols(preProtocols.filter(item => item !== p));
    } else {
      setPreProtocols([...preProtocols, p]);
    }
  };

  const handleTogglePostProtocol = (p: string) => {
    if (postProtocols.includes(p)) {
      setPostProtocols(postProtocols.filter(item => item !== p));
    } else {
      setPostProtocols([...postProtocols, p]);
    }
  };

  const handleToggleStatusClick = (id: string) => {
    const business = businesses.find(b => b.id === id);
    if (!business) return;
    const action = business.status === 'active' ? '禁用' : '启用';
    setConfirmModal({ isOpen: true, id, action, business });
  };

  const executeToggleStatus = () => {
    setBusinesses(businesses.map(b => {
      if (b.id === confirmModal.id) {
        return { ...b, status: b.status === 'active' ? 'disabled' : 'active' };
      }
      return b;
    }));
    setConfirmModal({ isOpen: false, id: '', action: '', business: null });
  };

  const handleDelete = (id: string) => {
    const business = businesses.find(b => b.id === id);
    if (!business) return;
    setDeleteConfirmModal({ isOpen: true, id, business });
  };

  const executeDelete = () => {
    if (deleteConfirmModal.id) {
      setBusinesses(businesses.filter(b => b.id !== deleteConfirmModal.id));
    }
    setDeleteConfirmModal({ isOpen: false, id: '', business: null });
  };

  const handleAddRule = () => {
    setRules([...rules, { id: Date.now(), phase: 'pre', type: 'group', target: '高龄投资者', action: 'append', protocol: '《高龄投资者特别风险揭示书》', fileName: null }]);
  };

  const handleRemoveRule = (id: number) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: number, field: string, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleFileUpload = (id: number, e: any) => {
    const file = e.target.files[0];
    if (file) {
      updateRule(id, 'fileName', file.name);
    }
  };

  const handleBatchExport = () => {
    const exportData = businesses.map(b => ({
      场景名称: b.scenarioName || '',
      业务名称: b.businessNames?.join(', ') || b.name,
      版本: b.version,
      前置签署协议: b.preProtocols.join(', '),
      后置签署协议: b.postProtocols.join(', '),
      状态: b.status === 'active' ? '启用中' : '已停用',
      创建人: b.creator,
      创建时间: b.createdAt,
      更新人: b.updater,
      更新时间: b.updated
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `业务场景配置_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchImport = () => {
    if (importFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          alert(`成功导入 ${importedData.length} 条业务配置数据！`);
          setIsImportModalOpen(false);
          setImportFile(null);
        } catch (error) {
          alert('文件格式错误，请上传有效的JSON文件');
        }
      };
      reader.readAsText(importFile);
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    const matchSearch = searchTerm === '' || (b.businessNames && b.businessNames.includes(searchTerm));
    const matchScenario = scenarioSearchTerm === '' || (b.scenarioName && b.scenarioName.toLowerCase().includes(scenarioSearchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchScenario && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Filters Area */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">场景名称</label>
            <input 
              type="text" 
              placeholder="请输入场景名称" 
              value={scenarioSearchTerm}
              onChange={(e) => setScenarioSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">业务名称</label>
            <select 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
            >
              <option value="">全部</option>
              {['身份证有效期更新', '电话号码更新', '邮编地址更新', '新增银行卡', '删除银行卡', '交易权限申请', '职业信息更新', '休眠账户激活', '适当性测评', '解除10元基础保证金', '期货销户', '更换银行卡', '增开交易编码', '基本资料变更', '注销交易编码/权限', '其他信息修改', '交易权限申请(新)', '交易权限证明开具', '休眠客户入金申请', '资产证明开具', '账户规范', '程序化报备', '银期签约', '银期解约'].map(biz => (
                <option key={biz} value={biz}>{biz}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">相关协议</label>
            <select className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none">
              <option value="">全部</option>
              <option value="《���当性匹配告知书》">《适当性匹配告知书》</option>
              <option value="《风险揭示书》">《风险揭示书》</option>
              <option value="《隐私权政策说明》">《隐私权政策说明》</option>
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
          <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            查询
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {/* Action Buttons Area */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 bg-slate-50/50">
          <button
            onClick={() => handleOpenModal()}
            className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors"
          >新增配置<Plus className="w-4 h-4" /></button>
          
          
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-100">
                <th className="px-6 py-3 whitespace-nowrap w-12">
                  <input
                    type="checkbox"
                    checked={filteredBusinesses.length > 0 && selectedRowIds.length === filteredBusinesses.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">场景ID</th>
                <th className="px-6 py-3 whitespace-nowrap">场景名称</th>
                <th className="px-6 py-3 whitespace-nowrap">业务名称</th>
                <th className="px-6 py-3 whitespace-nowrap">前置签署协议</th>
                <th className="px-6 py-3 whitespace-nowrap">后置签署协议</th>
                <th className="px-6 py-3 whitespace-nowrap">适用范围</th>
                <th className="px-6 py-3 whitespace-nowrap">状态</th>
                
                <th className="px-6 py-3 whitespace-nowrap">创建人</th>
                <th className="px-6 py-3 whitespace-nowrap">创建时间</th>
                <th className="px-6 py-3 whitespace-nowrap">更新人</th>
                <th className="px-6 py-3 whitespace-nowrap">更新时间</th>
                <th className="px-6 py-3 whitespace-nowrap sticky right-0 z-10 bg-slate-50 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className={`hover:bg-slate-50 transition-colors group ${selectedRowIds.includes(business.id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.includes(business.id)}
                      onChange={() => handleSelectRow(business.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{business.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium whitespace-nowrap">{business.scenarioName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap max-w-[250px] truncate" title={business.businessNames?.join(', ')}>{business.businessNames?.join(', ') || business.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[250px]">
                    <div className="flex flex-wrap gap-1.5">
                      {business.preProtocols.length > 0 ? (
                        business.preProtocols.map((p: string) => (
                          <span key={`pre-${p}`} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs flex items-center gap-1 border border-blue-100">
                            <FileText className="w-3 h-3" />
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[250px]">
                    <div className="flex flex-wrap gap-1.5">
                      {business.postProtocols.length > 0 ? (
                        business.postProtocols.map((p: string) => (
                          <span key={`post-${p}`} className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs flex items-center gap-1 border border-amber-200">
                            <FileText className="w-3 h-3" />
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {getAudienceLabel(business)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(business.status)}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {business.creator}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {business.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {business.updater}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {business.updated}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap sticky right-0 z-10 border-l border-slate-100 shadow-[-4px_0_12px_rgba(0,0,0,0.03)] ${selectedRowIds.includes(business.id) ? 'bg-blue-50/50 group-hover:bg-blue-50/80' : 'bg-white group-hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleOpenModal(business)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        <Settings className="w-4 h-4" /> 配置
                      </button>
                      <button 
                        onClick={() => handleToggleStatusClick(business.id)}
                        className={`${business.status === 'active' ? 'text-orange-500 hover:text-orange-700' : 'text-emerald-600 hover:text-emerald-800'} text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap`}
                      > <Power className="w-4 h-4" />{business.status === 'active' ? '停用' : '启用'}</button>
                      <button 
                        onClick={() => handleDelete(business.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
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
            共 <span className="font-medium text-slate-700">{filteredBusinesses.length}</span> 个业务场景
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

      {/* Advanced Protocol Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 md:p-8 xl:p-12">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                业务场景协议配置 
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              
              {/* Basic Info */}
              <div className="border border-slate-200 rounded-lg p-6 relative mb-8">
                <div className="absolute -top-3 left-6 bg-white px-2 text-sm font-bold text-blue-600">
                  业务基础信息
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-[90px] sm:text-right text-sm font-medium text-slate-700 shrink-0 mt-2.5">场景名称：</label>
                    <input 
                      type="text" 
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="请输入场景名称"
                      disabled={!!editingBusiness}
                      className={`flex-1 px-4 py-2.5 border border-slate-200 shadow-sm rounded-lg text-sm transition-all ${
                        editingBusiness 
                          ? 'bg-slate-50 text-slate-500 cursor-not-allowed' 
                          : 'text-slate-700 bg-white hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500'
                      }`} 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 relative">
                    <label className="w-full sm:w-[90px] sm:text-right text-sm font-medium text-slate-700 shrink-0 mt-2.5">业务名称：</label>
                    <div className="flex-1 relative">
                      <div 
                        onClick={() => setIsBusinessSelectOpen(!isBusinessSelectOpen)}
                        className="w-full min-h-[42px] px-4 py-2.5 border border-slate-200 shadow-sm rounded-lg text-slate-700 bg-white hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all text-sm cursor-pointer pr-10 flex flex-wrap gap-1.5 items-center relative"
                      >
                        {businessNames.length > 0 ? (
                          businessNames.map(biz => (
                            <span key={biz} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100 flex items-center gap-1">
                              {biz}
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleToggleBusinessName(biz); }}
                                className="hover:text-blue-900 transition-colors"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">请选择业务名称(多选)</span>
                        )}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                      </div>
                      
                      {isBusinessSelectOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsBusinessSelectOpen(false)}
                          />
                          <div className="absolute top-full mt-1 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 shadow-lg rounded-lg z-20 p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-2">
                            {BIZ_OPTIONS.map(biz => (
                              <label key={biz} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded cursor-pointer group transition-colors">
                                <input 
                                  type="checkbox" 
                                  checked={businessNames.includes(biz)}
                                  onChange={() => handleToggleBusinessName(biz)}
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm text-slate-700 group-hover:text-slate-900">{biz}</span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 lg:col-span-2">
                    <label className="w-full sm:w-[90px] sm:text-right text-sm font-medium text-slate-700 shrink-0 mt-2.5">适用范围：</label>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-6 mt-2.5">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="audienceType" 
                            value="all" 
                            checked={audienceType === 'all'} 
                            onChange={(e) => setAudienceType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">全量用户</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="audienceType" 
                            value="group" 
                            checked={audienceType === 'group'} 
                            onChange={(e) => setAudienceType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">用户客群</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="audienceType" 
                            value="list" 
                            checked={audienceType === 'list'} 
                            onChange={(e) => setAudienceType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">用户列表</span>
                        </label>
                      </div>
                      
                      {audienceType === 'group' && (
                        <select 
                          value={selectedAudienceGroup}
                          onChange={(e) => setSelectedAudienceGroup(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white mt-1"
                        >
                          <option value="professional">专业投资者</option>
                        </select>
                      )}

                      {audienceType === 'list' && (
                        <div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mt-1 relative">
                          {audienceFile ? (
                            <div className="flex flex-col items-center justify-center w-full z-10">
                              <FileSpreadsheet className="w-8 h-8 text-blue-500 mb-2" />
                              <p className="text-sm font-medium text-slate-800 break-all text-center px-4">{audienceFile.name}</p>
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setAudienceFile(null);
                                }}
                                className="mt-3 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                              >
                                <X className="w-3 h-3" />
                                移除文件
                              </button>
                            </div>
                          ) : (
                            <>
                              <input 
                                type="file" 
                                accept=".xlsx, .xls"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setAudienceFile(e.target.files[0]);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              />
                              <Upload className="w-6 h-6 text-slate-400 mb-2" />
                              <p className="text-sm font-medium text-slate-700">点击或拖拽上传 Excel 列表</p>
                              <p className="text-xs text-slate-500 mt-1">支持 .xlsx, .xls 格式文件</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: 双节点基础协议绑定 */}
              <div className="border border-slate-200 rounded-lg p-6 relative mb-8">
                <div className="absolute -top-3 left-6 bg-white px-2 text-sm font-bold text-blue-600">协议配置</div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 mb-4">
                  <p className="text-xs text-slate-500">在此处勾选的协议，将作为该业务办理时的【默认】签署协议。对于特殊客群或指定名单，请在基础信息例外规则中配置。</p>
                  <button 
                    onClick={() => { handleCloseModal(); navigate('/protocols'); }}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md shrink-0 border border-blue-100"
                  >
                    找不到想要的协议？前往添加
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* 前置协议 */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-blue-500 rounded-full"></span>
                      办理前(前置)签署
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-1.5 h-[220px] overflow-y-auto">
                      {protocolOptions.map(p => (
                        <label 
                          key={`pre-${p.name}`} 
                          className={`flex items-center gap-3 p-2.5 rounded-md transition-all border border-transparent ${p.status === 'disabled' ? 'bg-slate-100/50 opacity-60 cursor-not-allowed' : 'hover:bg-white cursor-pointer hover:border-slate-200 hover:shadow-sm'}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={preProtocols.includes(p.name)} 
                            disabled={p.status === 'disabled'}
                            onChange={() => handleTogglePreProtocol(p.name)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span className="text-sm text-slate-700 flex items-center gap-2">
                            {p.name}
                            {p.status === 'disabled' && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded leading-none">已停用</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 后置协议 */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-amber-500 rounded-full"></span>
                      办理后(后置)签署
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-1.5 h-[220px] overflow-y-auto">
                      {protocolOptions.map(p => (
                        <label 
                          key={`post-${p.name}`} 
                          className={`flex items-center gap-3 p-2.5 rounded-md transition-all border border-transparent ${p.status === 'disabled' ? 'bg-slate-100/50 opacity-60 cursor-not-allowed' : 'hover:bg-white cursor-pointer hover:border-slate-200 hover:shadow-sm'}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={postProtocols.includes(p.name)} 
                            disabled={p.status === 'disabled'}
                            onChange={() => handleTogglePostProtocol(p.name)}
                            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 disabled:opacity-50"
                          />
                          <span className="text-sm text-slate-700 flex items-center gap-2">
                            {p.name}
                            {p.status === 'disabled' && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded leading-none">已停用</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: 展示策略 */}
              <div className="border border-slate-200 rounded-lg p-6 relative mb-8">
                <div className="absolute -top-3 left-6 bg-white px-2 text-sm font-bold text-blue-600">
                  展示策略设置
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 mt-4 w-full">
                  <label className="w-full sm:w-[140px] sm:text-right text-sm font-medium text-slate-700 shrink-0">强制阅读倒计时：</label>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0"
                        defaultValue="10"
                        className="w-32 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all" 
                      />
                      <span className="text-sm font-medium text-slate-700">秒</span>
                    </div>
                    <span className="text-sm text-slate-400 sm:ml-4 sm:border-l sm:border-slate-200 sm:pl-4">设置后，阅读完毕前无法点击确认（0为不限制）</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={handleSaveBusiness}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                保存业务协议规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                批量导入业务场景配置
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-2">导入说明</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>支持JSON格式文件，文件大小不超过10MB</li>
                  <li>导入数据将与现有配置合并，相同编号的配置将被覆盖</li>
                  <li>请确保文件格式正确，可先导出现有配置作为模板参考</li>
                </ul>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors group">
                  {importFile ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileSpreadsheet className="w-12 h-12 text-blue-500 mb-3" />
                      <p className="text-sm text-slate-700 font-medium mb-1">{importFile.name}</p>
                      <p className="text-xs text-slate-500">{(importFile.size / 1024).toFixed(2)} KB</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImportFile(null);
                        }}
                        className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        移除文件
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-12 h-12 text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" />
                      <p className="mb-2 text-sm text-slate-600">
                        <span className="font-semibold text-blue-600">点击上传</span> 或拖拽文件至此处
                      </p>
                      <p className="text-xs text-slate-500">支持 JSON 格式 (最大 10MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert('文件大小不能超过10MB');
                          return;
                        }
                        setImportFile(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Template Download */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">需要导入模板？</p>
                    <p className="text-xs text-slate-500">下载标准模板文件以了解正确的数据格式</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const template = [{
                      业务名称: "示例业务",
                      版本: "V1.0.0",
                      前置签署协议: "《协议1》, 《协议2》",
                      后置签署协议: "《协议3》",
                      状态: "启用中",
                      创建人: "张三",
                      /*
                      创建时��: new Date().toISOString(),
                      */
                      创建时间: new Date().toISOString(),
                      更新人: "张三",
                      更新时间: new Date().toISOString()
                    }];
                    const dataStr = JSON.stringify(template, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = '业务场景配置模板.json';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载模板
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                取消
              </button>
              <button
                onClick={handleBatchImport}
                disabled={!importFile}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                开始导入
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
                  确定要<span className={confirmModal.action === '禁用' ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>{confirmModal.action}</span>该业务配置吗？
                </p>
                {confirmModal.business && confirmModal.action === '禁用' && (
                  <div className="bg-amber-50 p-3 rounded border border-amber-100 mt-2 text-amber-700">
                    <p>当前将要禁用<span className="font-bold text-slate-800 mx-1">【{confirmModal.business.scenarioName || confirmModal.business.name}】</span>配置。</p>
                    <p className="mt-1">禁用后，前端相关业务流程可能无法获取到正确的协议签署模板。</p>
                  </div>
                )}
                {confirmModal.business && confirmModal.action === '启用' && (
                  <div className="bg-emerald-50 p-3 rounded border border-emerald-100 mt-2 text-emerald-700">
                    <p>即将启用<span className="font-bold mx-1">【{confirmModal.business.scenarioName || confirmModal.business.name}】</span>配置。</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, id: '', action: '', business: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={executeToggleStatus}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmModal.action === '禁用' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                确定{confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
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
              <div className="text-slate-600 text-sm ml-[3.25rem] space-y-3">
                <p>
                  确定要删除该项吗？此操作无法恢复。
                </p>
                {deleteConfirmModal.business && (
                  <div className="bg-red-50 p-3 rounded border border-red-100 mt-2 text-red-700">
                    <p>当前将要删除<span className="font-bold text-slate-800 mx-1">【{deleteConfirmModal.business.scenarioName || deleteConfirmModal.business.name}】</span>配置。</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: '', business: null })}
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