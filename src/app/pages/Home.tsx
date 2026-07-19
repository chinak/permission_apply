import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../store/AppContext';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';
import { cn } from '../../lib/utils';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { ProcessRecord } from '../components/ProcessRecord';
import { LicenseConfirmDialog } from '../components/LicenseConfirmDialog';

const PRODUCTS = [
  {
    id: "financial",
    name: "金融期货期权",
    level: "R4",
    exchanges: [{ id: "cffex", name: "中国金融期货交易所" }]
  },
  {
    id: "crude_futures",
    name: "原油期货",
    level: "R4",
    exchanges: [{ id: "ine_oil_futures", name: "上海国际能源交易中心" }]
  },
  {
    id: "crude_options",
    name: "原油期权",
    level: "R4",
    exchanges: [{ id: "ine_oil_options", name: "上海国际能源交易中心" }]
  },
  {
    id: "commodity",
    name: "商品期权",
    level: "R4",
    exchanges: [
      { id: "czce_opt", name: "郑州商品交易所" },
      { id: "dce_opt", name: "大连商品交易所" },
      { id: "shfe_opt", name: "上海期货交易所" },
      { id: "ine_opt", name: "上海国际能源交易中心" },
      { id: "gfex_opt", name: "广州期货交易所" }
    ]
  },
  {
    id: "specific",
    name: "特定品种",
    level: "R3",
    exchanges: [
      { id: "czce_spec", name: "郑州商品交易所" },
      { id: "dce_spec", name: "大连商品交易所" },
      { id: "shfe_spec", name: "上海期货交易所" },
      { id: "ine_spec", name: "上海国际能源交易中心" }
    ]
  }
];

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, riskLevel, fundLevel, has50Days, existingMaxValue, selectedProducts, setSelectedProducts, isSpecialCorp, customerType, investorType } = useAppContext();
  
  const status = location.state?.status;
  const rejectReason = location.state?.rejectReason;
  const mockExchangeIds = location.state?.mockExchangeIds || [];
  
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (!hasInitialized && mockExchangeIds.length > 0) {
      setSelectedProducts(mockExchangeIds);
      setHasInitialized(true);
    }
  }, [hasInitialized, mockExchangeIds, setSelectedProducts]);
  
  const [c3WarningOpen, setC3WarningOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [partMeetOpen, setPartMeetOpen] = useState(false);
  const [licenseConfirmOpen, setLicenseConfirmOpen] = useState(false);
  const [evalResult, setEvalResult] = useState<{ meet: string[], notMeet: string[] }>({ meet: [], notMeet: [] });
  
  const [files, setFiles] = useState<File[]>([]);
  const [internalControlChanged, setInternalControlChanged] = useState<boolean | null>(null);
  const [productContractChanged, setProductContractChanged] = useState<boolean | null>(null);
  const [beneficiaryChecked, setBeneficiaryChecked] = useState(false);
  const [remarks, setRemarks] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Added direct entry point for testing ApplicationDetail
  const handleQuickEntry = () => {
    navigate('/application-list');
  };

  const getProductValue = (exchangeId: string) => {
    const PRODUCT_VALUES: Record<string, number> = {
      cffex: 10,
      ine_oil_futures: 8,
      ine_oil_options: 8,
      czce_opt: 5, dce_opt: 5, shfe_opt: 5, ine_opt: 5, gfex_opt: 5,
      czce_spec: 5, dce_spec: 5, shfe_spec: 5, ine_spec: 5
    };
    return PRODUCT_VALUES[exchangeId] || 5;
  };

  const isAlreadyOwned = (exchangeId: string) => {
    return getProductValue(exchangeId) <= existingMaxValue;
  };

  const r3ExchangeIds = PRODUCTS.filter(p => p.level === "R3").flatMap(p => p.exchanges.map(e => e.id));
  const allExchangeIds = PRODUCTS.flatMap(p => p.exchanges.map(e => e.id));

  // Determine selectable products based on risk level
  const selectableIds = (riskLevel === 'C3' ? r3ExchangeIds : allExchangeIds).filter(id => !isAlreadyOwned(id));
  const allSelectableChecked = selectableIds.length > 0 && selectableIds.every(id => selectedProducts.includes(id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = [...new Set([...selectedProducts, ...selectableIds])];
      setSelectedProducts(newSelected);
    } else {
      const newSelected = selectedProducts.filter(id => !selectableIds.includes(id));
      setSelectedProducts(newSelected);
    }
  };

  const handleToggleProduct = (exchangeId: string, level: string) => {
    if (riskLevel === 'C3' && level !== 'R3') {
      setC3WarningOpen(true);
      return;
    }
    
    let nextSelected = [...selectedProducts];
    
    if (nextSelected.includes(exchangeId)) {
      // Uncheck logic
      nextSelected = nextSelected.filter(id => id !== exchangeId);
      
      // If unchecking crude futures, automatically uncheck crude options
      if (exchangeId === 'ine_oil_futures') {
        nextSelected = nextSelected.filter(id => id !== 'ine_oil_options');
      }
    } else {
      // Check logic
      nextSelected.push(exchangeId);
      
      // If checking crude options, automatically check crude futures
      if (exchangeId === 'ine_oil_options' && !nextSelected.includes('ine_oil_futures')) {
        nextSelected.push('ine_oil_futures');
      }
    }
    
    setSelectedProducts(nextSelected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getExchangeName = (id: string) => {
    for (const p of PRODUCTS) {
      const ex = p.exchanges.find(e => e.id === id);
      if (ex) return p.name;
    }
    return id;
  };

  const canSecondOpen = (exchangeId: string): boolean => {
    const value = getProductValue(exchangeId);
    const isCrude = exchangeId === 'ine_oil_futures' || exchangeId === 'ine_oil_options';
    
    const has500k = fundLevel === 'GE_500K_LT_1M' || fundLevel === 'GE_1M';
    const has1M = fundLevel === 'GE_1M';

    if (!has500k && !has50Days && value <= existingMaxValue) {
      if (isCrude && !has1M) return false;
      return true;
    }
    if (!has500k && has50Days && value <= 8) {
      return true;
    }
    if (has500k && has50Days) {
      return true;
    }
    if (has500k && !has50Days && existingMaxValue > 0) {
      if (isCrude && !has1M) return false;
      return true;
    }
    return false;
  };

  const handleConfirm = () => {
    const newlySelected = selectedProducts.filter(id => !isAlreadyOwned(id));
    if (newlySelected.length === 0) return;

    const meet: string[] = [];
    const notMeet: string[] = [];
    
    const processedProductIds = new Set<string>();

    newlySelected.forEach(exId => {
      const p = PRODUCTS.find(prod => prod.exchanges.some(e => e.id === exId));
      if (!p) return;
      
      if (!processedProductIds.has(p.id)) {
        processedProductIds.add(p.id);
        if (canSecondOpen(exId)) {
          meet.push(p.name);
        } else {
          notMeet.push(p.name);
        }
      }
    });

    setEvalResult({ meet, notMeet });

    if (notMeet.length === 0) {
      setLicenseConfirmOpen(true);
    } else if (meet.length === 0) {
      navigate('/submit-form', { state: { status, rejectReason, mockExchangeIds } });
    } else {
      setPartMeetOpen(true);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      
      {/* Quick Entry / Debug Header */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleQuickEntry} className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
          测试快捷入口：我发起的申请 (列表)
        </Button>
      </div>

      {/* Wizard / Stepper */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between w-full relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-[2px] bg-slate-100 z-0"></div>
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm ring-4 ring-white">
              1
            </div>
            <span className="text-sm font-medium text-blue-600 absolute top-10 w-max">开始</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold text-sm ring-4 ring-white">
              2
            </div>
            <span className="text-sm font-medium text-slate-500 absolute top-10 w-max">提交申请</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold text-sm ring-4 ring-white">
              3
            </div>
            <span className="text-sm font-medium text-slate-500 absolute top-10 w-max">业务办理中</span>
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold text-sm ring-4 ring-white">
              4
            </div>
            <span className="text-sm font-medium text-slate-500 absolute top-10 w-max">结束</span>
          </div>
        </div>
      </div>

      {/* 1. 基本资料 (Basic Information) */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            基本资料
          </h2>
        </div>
        <div className="p-5">
          <table className="w-full text-sm border-collapse border border-slate-200">
            <tbody>
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">客户名称</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900 w-[30%]">张三科技有限公司</td>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">客户类型</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900 w-[30%]">{isSpecialCorp ? '特法客户' : customerType}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">资产账号</td>
                <td className="border border-slate-200 py-2.5 px-4 text-blue-600 font-medium">{account}</td>
                {!isSpecialCorp ? (
                  <>
                    <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium"></td>
                    <td className="border border-slate-200 py-2.5 px-4 text-slate-900"></td>
                  </>
                ) : (
                  <>
                    <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">产品名称</td>
                    <td className="border border-slate-200 py-2.5 px-4 text-slate-900">超体一号私募证券投资基金</td>
                  </>
                )}
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">所属分支</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900">上海浦东分公司</td>
                {investorType === '专业投资者' ? (
                  <>
                    <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">适当性等级</td>
                    <td className="border border-slate-200 py-2.5 px-4 bg-slate-50/30">
                      <span className="font-bold text-green-600">专业投资者</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">适当性等级</td>
                    <td className="border border-slate-200 py-2.5 px-4 bg-slate-50/30">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "font-bold",
                          riskLevel === 'C3' ? "text-orange-600" : "text-green-600"
                        )}>
                          普通投资者{riskLevel}
                        </span>
                        <span className="text-xs text-slate-500">有效期至 2027-01-01</span>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
          
          {investorType === '普通投资者' && riskLevel === 'C3' && (
            <div className="mt-3 flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2.5 rounded-sm text-sm border border-orange-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>当前等级为 C3，暂不满足 R4 级别品种（如金融期货、原油等）的开通条件，若需开通请重新评测。</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. 权限申请 (Permission Selection) */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            交易权限选择
          </h2>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all" 
              checked={allSelectableChecked}
              onCheckedChange={handleSelectAll}
              className="rounded-sm"
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer text-slate-700">可办品种全选</label>
          </div>
        </div>
        
        <div className="p-5">
          <div className="border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 py-3.5 px-6 border-b border-slate-200 text-sm font-semibold text-slate-700">
              <div className="col-span-4">申请品种</div>
              <div className="col-span-8">涉及交易所</div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {PRODUCTS.map((product, idx) => {
                const isC3Restricted = riskLevel === 'C3' && product.level !== 'R3';
                const allOwned = product.exchanges.length > 0 && product.exchanges.every(ex => isAlreadyOwned(ex.id));
                const allChecked = product.exchanges.length > 0 && product.exchanges.every(ex => isAlreadyOwned(ex.id) || selectedProducts.includes(ex.id));
                const groupDisabled = allOwned || isC3Restricted;

                return (
                  <div 
                    key={product.id} 
                    className={cn(
                      "grid grid-cols-12 px-6 py-5 text-sm items-start transition-all",
                      isC3Restricted || allOwned ? "bg-slate-50/40" : "hover:bg-blue-50/10"
                    )}
                  >
                    {/* Column 1: Product Name */}
                    <div className="col-span-4 flex items-start gap-3 mt-0.5">
                      <Checkbox 
                        checked={allChecked}
                        disabled={groupDisabled}
                        className="rounded-sm mt-0.5"
                        onCheckedChange={(checked) => {
                          if (groupDisabled) return;
                          
                          let newSelected = [...selectedProducts];
                          
                          if (checked) {
                            const idsToAdd = product.exchanges.map(e => e.id);
                            idsToAdd.forEach(id => {
                               if (!newSelected.includes(id)) newSelected.push(id);
                               // Auto-check futures if options is checked
                               if (id === 'ine_oil_options' && !newSelected.includes('ine_oil_futures')) {
                                   newSelected.push('ine_oil_futures');
                               }
                            });
                          } else {
                            const idsToRemove = product.exchanges.map(e => e.id);
                            newSelected = newSelected.filter(id => !idsToRemove.includes(id));
                            // Auto-uncheck options if futures is unchecked
                            if (idsToRemove.includes('ine_oil_futures')) {
                               newSelected = newSelected.filter(id => id !== 'ine_oil_options');
                            }
                          }
                          
                          setSelectedProducts([...new Set(newSelected)]);
                        }}
                      />
                      <div className="flex flex-col">
                        <span className={cn("font-medium text-[15px]", (isC3Restricted || allOwned) ? "text-slate-400" : "text-slate-800")}>
                          {product.name}
                        </span>
                        {allOwned && <span className="mt-1.5 text-[11px] font-medium bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded w-max">已全部开通</span>}
                      </div>
                    </div>

                    {/* Column 2: Exchanges */}
                    <div className="col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-6">
                        {product.exchanges.map(ex => {
                          const owned = isAlreadyOwned(ex.id);
                          const disabled = owned || isC3Restricted;
                          const selected = owned || selectedProducts.includes(ex.id);
                          
                          return (
                            <label 
                              key={ex.id}
                              htmlFor={ex.id}
                              className={cn(
                                "flex items-center gap-2.5 group w-max select-none", 
                                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                              )}
                            >
                              <Checkbox 
                                id={ex.id}
                                className={cn(
                                  "rounded-sm transition-colors",
                                  !disabled && !selected && "group-hover:border-blue-400"
                                )}
                                disabled={disabled}
                                checked={selected}
                                onCheckedChange={() => {
                                  if (!disabled) handleToggleProduct(ex.id, product.level);
                                }}
                              />
                              <span className={cn(
                                "text-sm transition-colors",
                                disabled ? "text-slate-500" :
                                selected ? "text-blue-600 font-medium" : "text-slate-700 group-hover:text-blue-600"
                              )}>
                                {ex.name}
                              </span>
                              {owned && <span className="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-sm">已开通</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 业务声明与确认 (Business Declarations & Confirmations) */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            业务声明与确认
          </h2>
        </div>
        <div className="p-5 space-y-6">
          {/* 内控制度是否有变更 */}
          {existingMaxValue > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center text-sm font-medium text-slate-800 mt-1 sm:w-48 flex-shrink-0">
                  <span className="text-red-500 mr-1">*</span> 内控制度是否有变更：
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="internal_control" 
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                        checked={internalControlChanged === false} 
                        onChange={() => setInternalControlChanged(false)} 
                      />
                      <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">否，无变更</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="internal_control" 
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                        checked={internalControlChanged === true} 
                        onChange={() => setInternalControlChanged(true)} 
                      />
                      <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">是，有变更</span>
                    </label>
                  </div>
                </div>
              </div>
              {internalControlChanged === true && (
                <div className="flex items-start gap-2 bg-orange-50/80 text-orange-700 px-4 py-3 rounded-sm text-sm border border-orange-200/60 w-full lg:w-3/4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-orange-800">请确认投资范围包含本次申请权限。</p>
                    <p className="text-orange-700/90">请在附件处上传更新版的文档，或及时将变更信息提供给客户经理！</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 产品合同是否有变更 */}
          {isSpecialCorp && (
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center text-sm font-medium text-slate-800 mt-1 sm:w-48 flex-shrink-0">
                <span className="text-red-500 mr-1">*</span> 产品合同是否有变更：
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="product_contract" 
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                      checked={productContractChanged === false} 
                      onChange={() => setProductContractChanged(false)} 
                    />
                    <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">否，无变更</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="product_contract" 
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                      checked={productContractChanged === true} 
                      onChange={() => setProductContractChanged(true)} 
                    />
                    <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">是，有变更</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 承诺复选框 */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            
            
            <div className="flex items-start gap-3">
              <Checkbox 
                id="beneficiary-commitment" 
                checked={beneficiaryChecked}
                onCheckedChange={(c) => setBeneficiaryChecked(!!c)}
                className="mt-1 rounded-sm border-slate-400"
              />
              <div className="flex flex-col">
                <label htmlFor="beneficiary-commitment" className="text-sm text-slate-800 font-medium leading-relaxed cursor-pointer select-none">
                  <span className="text-red-500 mr-1">*</span>已确认受益所有人信息无变更
                </label>
                <div className="mt-2 flex items-start gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-sm border border-blue-100/50">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <p>温馨提示：如您的账户信息发生变更，请及时更新！</p>
                </div>
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <div className="text-sm font-medium text-slate-800 mb-2">备注信息 (选填)：</div>
            <textarea 
              className="w-full border border-slate-300 rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-slate-400"
              rows={3}
              placeholder="如您有其他需要说明的事项，请在此填写..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 4. 附件上传 (File Upload) */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            附件资料上传 (选填)
          </h2>
        </div>
        
        <div className="p-5">
          {/* 状态二: 未开通过任何特殊品种 */}
          {existingMaxValue === 0 && (
            <div className="mb-5 bg-blue-50/80 border border-blue-200/80 p-4 rounded-sm flex items-start gap-3 text-sm text-blue-800">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">温馨提示：</p>
                <p>您的账户在我司是首次开通特殊品种交易权限，需要提供内控制度文件，您可以在附件处上传内控制度文档，或将文件提供给客户经理！</p>
                <p className="mt-1 text-blue-700/80">如您的账户信息发生变更，请及时更新！</p>
              </div>
            </div>
          )}

          <div 
            className="border border-dashed border-slate-300 rounded-sm bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center justify-center py-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-slate-700 text-sm font-medium mb-1">点击或将文件拖拽至此处上传</p>
            <p className="text-slate-400 text-xs">支持 JPG, PNG, PDF 格式，单个文件不超过 10MB</p>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">已上传附件</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-700 truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <ProcessRecord status={status} rejectReason={rejectReason} />

      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button 
          size="lg"
          className="rounded-sm px-8"
          disabled={
            selectedProducts.filter(id => !isAlreadyOwned(id)).length === 0 || 
            !beneficiaryChecked ||
            (existingMaxValue > 0 && internalControlChanged === null) ||
            (isSpecialCorp && productContractChanged === null)
          }
          onClick={handleConfirm}
        >
          提交开通申请
        </Button>
      </div>

      {/* C3 Warning Modal */}
      <Dialog open={c3WarningOpen} onOpenChange={setC3WarningOpen}>
        <DialogContent className="max-w-md rounded-sm p-6 border-slate-200">
          <DialogTitle className="text-slate-800 text-lg flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-orange-500" />
            适当性匹配提醒
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm mb-6 leading-relaxed">
            尊敬的投资者：您当前风测等级为 <span className="font-bold text-orange-600">C3</span>。
            <br/><br/>
            该级别暂不满足开通 R4 级别品种（如金融期货、原油等）的条件。如有疑问请联系您的客户经理。
          </DialogDescription>
          <div className="flex justify-end">
            <Button variant="outline" className="rounded-sm" onClick={() => setC3WarningOpen(false)}>
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Part Meet Modal */}
      <Dialog open={partMeetOpen} onOpenChange={setPartMeetOpen}>
        <DialogContent className="max-w-lg rounded-sm p-6 border-slate-200">
          <DialogTitle className="text-lg text-slate-800 mb-4 border-b border-slate-100 pb-3">
            交易权限申请评估结果
          </DialogTitle>
          <div className="text-sm space-y-5 max-h-[60vh] overflow-y-auto pr-2">
            
            {evalResult.meet.length > 0 && (
              <div>
                <p className="text-slate-800 font-semibold mb-2 flex items-center gap-1.5">满足条件直接开通：<CheckCircle2 className="w-4 h-4 text-green-600" /></p>
                <div className="pl-5 space-y-1.5 text-slate-600">
                  {evalResult.meet.map((name, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-sm border border-slate-100">
                      <span>{name}</span>
                      <span className="text-green-600 text-xs font-medium">可直接提交</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evalResult.notMeet.length > 0 && (
              <div>
                <p className="text-slate-800 font-semibold mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  需要补充证明材料（豁免开通或首次申请）：
                </p>
                <div className="pl-5 space-y-1.5 text-slate-600">
                  {evalResult.notMeet.map((name, i) => (
                    <div key={i} className="bg-orange-50/50 px-3 py-1.5 rounded-sm border border-orange-100">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button variant="outline" className="rounded-sm" onClick={() => setPartMeetOpen(false)}>
              返回修改
            </Button>
            <Button className="rounded-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              setPartMeetOpen(false);
              setLicenseConfirmOpen(true);
            }}>
              先提交已满足条件权限
            </Button>
            {/*
              前往补充材料
            </Button>
          */}
          </div>
        </DialogContent>
      </Dialog>

      {/* License Confirm Dialog */}
      <LicenseConfirmDialog 
        open={licenseConfirmOpen} 
        onOpenChange={setLicenseConfirmOpen} 
        onConfirm={() => setSuccessOpen(true)} 
      />

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md rounded-sm p-6 border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg text-slate-800 mb-2">提交成功</DialogTitle>
              <div className="text-slate-600 text-sm leading-relaxed mb-6">
                <p className="mb-4">您的申请已提交成功！</p>
                <p className="mb-2">您本次申请开通：</p>
                <div className="space-y-1 text-slate-800 font-medium">
                  {evalResult.meet.map((name, i) => (
                    <div key={i}>{name}</div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="rounded-sm px-6" onClick={() => setSuccessOpen(false)}>
                  返回首页
                </Button>
                <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={() => {
                  setSuccessOpen(false);
                  navigate('/application-detail', { state: { applicationType: 'second-time', products: evalResult.meet } });
                }}>
                  查看办理进度
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
