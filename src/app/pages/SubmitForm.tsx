import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { ShieldCheck, Plus, UploadCloud, CheckCircle2, AlertCircle, XCircle, HelpCircle, Clock, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProcessRecord } from '../components/ProcessRecord';
import { LicenseConfirmDialog } from '../components/LicenseConfirmDialog';

export const PRODUCTS = [
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
      { id: "dce_opt", name: "��连商品交易所" },
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

export function SubmitForm({ isReadOnly = false, defaultTab = 'first-time', mockExchangeIds = [], hideHeader = false, hideProcessRecord = false, afterBasicInfoBlock, afterPermissionsBlock, afterAllBlocks }: { isReadOnly?: boolean, defaultTab?: 'first-time' | 'exemption' | 'second-time', mockExchangeIds?: string[], hideHeader?: boolean, hideProcessRecord?: boolean, afterBasicInfoBlock?: React.ReactNode, afterPermissionsBlock?: React.ReactNode, afterAllBlocks?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, riskLevel, customerType, investorType, isSpecialCorp, selectedProducts } = useAppContext();
  
  const status = location.state?.status;
  const rejectReason = location.state?.rejectReason;
  
  const [activeTab, setActiveTab] = useState<'first-time' | 'exemption' | 'second-time'>(defaultTab);
  const [successOpen, setSuccessOpen] = useState(false);
  const [licenseConfirmOpen, setLicenseConfirmOpen] = useState(false);

  // Mock states for First-Time application requirements
  const [isCapitalSatisfiedState, setIsCapitalSatisfied] = useState(false);
  const [isRealExpSatisfiedState, setIsRealExpSatisfied] = useState(false);
  const [isSimExpSatisfiedState, setIsSimExpSatisfied] = useState(false);
  const [isTestUploadedState, setIsTestUploaded] = useState(false);
  
  // If readonly, force them to true to simulate a completed application
  const isCapitalSatisfied = isReadOnly ? true : isCapitalSatisfiedState;
  const isRealExpSatisfied = isReadOnly ? true : isRealExpSatisfiedState;
  const isSimExpSatisfied = isReadOnly ? true : isSimExpSatisfiedState;
  const isTestUploaded = isReadOnly ? true : isTestUploadedState;
  
  // Debug modes to force show capital requirements if context is empty
  const [debugForce100k, setDebugForce100k] = useState(false);
  const [debugForce50k, setDebugForce50k] = useState(false);
  const [debugForce10k, setDebugForce10k] = useState(false);

  // Mock state for Exemption application
  const [isExemptionUploadedState, setIsExemptionUploaded] = useState(false);
  const [exemptionOptions, setExemptionOptions] = useState<boolean[]>([false, false, false, false]);

  const isExemptionUploaded = isReadOnly ? true : isExemptionUploadedState;

  const isExperienceSatisfied = isRealExpSatisfied || isSimExpSatisfied;

  // Determine what capital verification is needed based on selected products
  const require100kIds = ["ine_oil_futures", "ine_oil_options"];
  const require50kIds = ["cffex"];
  const require10kIds = ["czce_opt", "dce_opt", "shfe_opt", "ine_opt", "gfex_opt", "czce_spec", "dce_spec", "shfe_spec", "ine_spec"];

  const hasSelected = selectedProducts.length > 0;
  const noDebugSelected = !debugForce100k && !debugForce50k && !debugForce10k;
  
  // If nothing is selected (direct URL access), fallback to show both unless explicitly hidden by debug
  const effNeeds100k = hasSelected ? selectedProducts.some(id => require100kIds.includes(id)) : (debugForce100k || noDebugSelected);
  const effNeeds50k = hasSelected ? selectedProducts.some(id => require50kIds.includes(id)) : (debugForce50k || noDebugSelected);
  const effNeeds10k = hasSelected ? selectedProducts.some(id => require10kIds.includes(id)) : (debugForce10k || noDebugSelected);
  const effNeedsCapital = effNeeds100k || effNeeds50k || effNeeds10k;

  // Capital requirement is satisfied if: (1) no capital needed, or (2) the capital mock toggle is checked.
  const isCapitalRequirementMet = !effNeedsCapital || isCapitalSatisfied;

  const canSubmitFirstTime = isCapitalRequirementMet && isExperienceSatisfied && isTestUploaded;
  const hasExemptionOptionSelected = exemptionOptions.some(opt => opt);
  const canSubmitExemption = hasExemptionOptionSelected && (!exemptionOptions[3] || isExemptionUploaded);

  const handleComplete = () => {
    setLicenseConfirmOpen(true);
  };

  const getMock5DaysCapital = () => {
    const maxRequired = effNeeds100k ? 1000000 : (effNeeds50k ? 500000 : 100000);
    const base = isCapitalSatisfied ? maxRequired * 1.05 : maxRequired * 0.8;
    
    return [
      { date: 'T-5', amount: (base * 1.00).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
      { date: 'T-4', amount: (base * 1.02).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
      { date: 'T-3', amount: (base * 0.98).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
      { date: 'T-2', amount: (base * 1.05).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
      { date: 'T-1', amount: (base * 1.01).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) },
    ];
  };

  return (
    <div className={cn("mx-auto space-y-6", !hideHeader ? "w-full px-4 pb-24" : "w-full pb-6")}>
      {/* ReadOnly Page Header */}
      {isReadOnly && !hideHeader && (
        <div className="flex items-center gap-4 py-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">申请详情</h1>
            <p className="text-sm text-slate-500">流水号: {new Date().getTime()}</p>
          </div>
        </div>
      )}

      {/* Wizard / Stepper */}
      

      {/* Status Banner for ReadOnly Mode */}
      {isReadOnly && (
        null
      )}

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
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">账户状态</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900">正常</td>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">休眠状态</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900">否</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">账户规范状态</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900">规范</td>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">反洗钱风险等级</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900">低风险</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-200 py-2.5 px-4 w-32 text-slate-600 font-medium">机构证件有效期止</td>
                <td className="border border-slate-200 py-2.5 px-4 text-slate-900" colSpan={3}>2050-12-31</td>
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

      {afterBasicInfoBlock}

      {/* 2. 已选交易权限 (Selected Permissions) - Only show in ReadOnly mode based on requirement */}
      {isReadOnly && (
        <section className="bg-white rounded-sm shadow-sm border border-slate-200">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
              {isReadOnly ? '已申请交易权限' : '已选交易权限'}
            </h2>
          </div>
          
          <div className="p-5">
            <div className="border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-50 py-3.5 px-6 border-b border-slate-200 text-sm font-semibold text-slate-700">
                <div className="col-span-4">申请品种</div>
                <div className="col-span-8">涉及交易所</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {(() => {
                  const displayIds = isReadOnly && mockExchangeIds.length > 0 ? mockExchangeIds : selectedProducts;
                  
                  return PRODUCTS.map((product) => {
                    const groupSelected = product.exchanges.length > 0 && product.exchanges.every(ex => displayIds.includes(ex.id));
                    const groupPartiallySelected = product.exchanges.some(ex => displayIds.includes(ex.id));

                    return (
                      <div 
                        key={product.id} 
                        className="grid grid-cols-12 px-6 py-5 text-sm items-start"
                      >
                        <div className="col-span-4 flex items-start gap-3 mt-0.5">
                          <Checkbox 
                            checked={groupSelected || groupPartiallySelected}
                            disabled={true}
                            className="rounded-sm mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <span className="font-medium text-[15px] text-slate-800">
                            {product.name}
                          </span>
                        </div>

                        <div className="col-span-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-6">
                            {product.exchanges.map(ex => {
                              const selected = displayIds.includes(ex.id);
                              
                              return (
                                <label 
                                  key={ex.id}
                                  className="flex items-center gap-2.5 w-max select-none cursor-not-allowed opacity-80"
                                >
                                  <Checkbox 
                                    checked={selected}
                                    disabled={true}
                                    className={cn("rounded-sm", selected && "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600")}
                                  />
                                  <span className={cn("text-sm font-medium", selected ? "text-blue-600" : "text-slate-500")}>
                                    {ex.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {afterPermissionsBlock}

      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
              {isReadOnly ? '相关证明材料' : '补充证明材料'}
            </h2>
            <p className="text-slate-500 text-xs mt-1 ml-3">
              {isReadOnly ? "您的适当性评估补充材料及选择的申请类型" : "根据您的适当性评估结果，需完善以下信息以完成开通申请。请选择您的申请类型："}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-5 pt-4 border-b border-slate-200">
          {activeTab !== 'second-time' && (
            <>
              <button
                className={cn(
                  "px-6 py-2.5 font-medium text-sm border-b-2 transition-colors -mb-[1px]",
                  activeTab === 'first-time' 
                    ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                    : "border-transparent text-slate-500",
                  isReadOnly ? "cursor-default" : "hover:text-slate-800 hover:border-slate-300"
                )}
                onClick={() => !isReadOnly && setActiveTab('first-time')}
              >首次申请</button>
              <button
                className={cn(
                  "px-6 py-2.5 font-medium text-sm border-b-2 transition-colors -mb-[1px]",
                  activeTab === 'exemption' 
                    ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                    : "border-transparent text-slate-500",
                  isReadOnly ? "cursor-default" : "hover:text-slate-800 hover:border-slate-300"
                )}
                onClick={() => !isReadOnly && setActiveTab('exemption')}
              >
                他司豁免
              </button>
            </>
          )}
          {activeTab === 'second-time' && (
             <button
              className="px-6 py-2.5 font-medium text-sm border-b-2 border-blue-600 text-blue-600 bg-blue-50/50 cursor-default -mb-[1px]"
             >
               我司豁免
             </button>
          )}
        </div>

        <div className="p-6">
          {/* First Time App Content */}
          {activeTab === 'first-time' && (
            <div className="animate-in fade-in duration-300 max-w-4xl">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">首次申请要求</h3>
                <p className="text-slate-500 text-xs">目前您账户在我司满足的情况及需要补充的材料</p>
              </div>
              
              <div className="space-y-0 text-sm text-slate-700 border border-slate-200 rounded-sm overflow-hidden">
                {effNeedsCapital && (
                  <div className="flex border-b border-slate-200">
                    <div className="w-48 bg-slate-50 p-4 font-medium flex items-center border-r border-slate-200 text-slate-600">
                      01. 可用资金情况
                    </div>
                    <div className="flex-1 p-5 bg-white">
                      <p className="text-slate-800 font-medium mb-4">账户可用资金要求：</p>
                      <div className="space-y-5 text-xs">
                        {effNeeds100k && (
                          <div className="bg-slate-50/50 p-3 rounded-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-slate-800 font-medium">申请原油、50万及以下品种，前5个交易日每日≥100万���</p>
                              {isCapitalSatisfied ? (
                                <span className="text-green-600 flex items-center gap-1.5 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-sm"><CheckCircle2 className="w-3.5 h-3.5"/> 已满足</span>
                              ) : (
                                <span className="text-red-500 flex items-center gap-1.5 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-sm"><XCircle className="w-3.5 h-3.5"/> 不满足</span>
                              )}
                            </div>
                            <p className="text-slate-500 leading-relaxed">原油期货、原油期权（能源中心）</p>
                          </div>
                        )}
                        {effNeeds50k && (
                          <div className="bg-slate-50/50 p-3 rounded-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-slate-800 font-medium">申请50万及以下品种，前5个交易日每日≥50万元</p>
                              {isCapitalSatisfied ? (
                                <span className="text-green-600 flex items-center gap-1.5 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-sm"><CheckCircle2 className="w-3.5 h-3.5"/> 已满足</span>
                              ) : (
                                <span className="text-red-500 flex items-center gap-1.5 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-sm"><XCircle className="w-3.5 h-3.5"/> 不满足</span>
                              )}
                            </div>
                            <p className="text-slate-500 leading-relaxed">金融期货期权（中金所）</p>
                          </div>
                        )}
                        {effNeeds10k && (
                          <div className="bg-slate-50/50 p-3 rounded-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-slate-800 font-medium">申请10万品种，前5个交易日每日≥10万元</p>
                              {isCapitalSatisfied ? (
                                <span className="text-green-600 flex items-center gap-1.5 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-sm"><CheckCircle2 className="w-3.5 h-3.5"/> 已满足</span>
                              ) : (
                                <span className="text-red-500 flex items-center gap-1.5 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-sm"><XCircle className="w-3.5 h-3.5"/> 不满足</span>
                              )}
                            </div>
                            <p className="text-slate-500 leading-relaxed">商品期权（大连、郑州、上海、广州）、特定品种（能源中心、郑州、大连）</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 border border-slate-200 rounded-sm overflow-hidden">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                              <th className="py-2.5 px-4 font-medium">日期</th>
                              <th className="py-2.5 px-4 font-medium text-right">账户可用资金 (元)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {getMock5DaysCapital().map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2.5 px-4 text-slate-700">{row.date}</td>
                                <td className="py-2.5 px-4 text-slate-800 text-right font-medium">{row.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex border-b border-slate-200">
                  <div className="w-48 bg-slate-50 p-4 font-medium flex border-r border-slate-200 text-slate-600 pt-5">
                    {effNeedsCapital ? '02.' : '01.'} 交易经历
                  </div>
                  <div className="flex-1 p-5 bg-white">
                    <p className="text-slate-800 font-medium mb-4">交易经历(以下满足其一即可)：</p>
                    <div className="space-y-4 text-xs">
                      <div className="flex items-start justify-between bg-slate-50/50 p-3 rounded-sm border border-slate-100">
                        <div>
                          <p className="text-slate-800 font-medium">实盘交易：近三年至少10笔成交</p>
                          <p className="text-slate-500 mt-1.5">当前：近三年成交 {isRealExpSatisfied ? '12' : '5'} 笔</p>
                        </div>
                        {isRealExpSatisfied ? (
                          <div className="text-green-600 flex items-center gap-1.5 font-medium mt-1 bg-green-50 px-2 py-0.5 rounded-sm">
                            <CheckCircle2 className="w-3.5 h-3.5"/> 已满足
                          </div>
                        ) : (
                          <div className="text-red-500 flex items-center gap-1.5 font-medium mt-1 bg-red-50 px-2 py-0.5 rounded-sm">
                            <XCircle className="w-3.5 h-3.5"/> 不满足
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between bg-slate-50/50 p-3 rounded-sm border border-slate-100">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                            仿真交易：累计至少10个交易日和20笔成交
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 outline-none" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 text-white p-2.5 text-xs rounded-sm border-none shadow-md">
                                  在我司仿真交易经历的最早计算时间为2021年8月23日
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-slate-500 mt-1.5">当前：累计 {isSimExpSatisfied ? '15' : '8'} 个交易日，{isSimExpSatisfied ? '25' : '15'} 笔成交</p>
                        </div>
                        {isSimExpSatisfied ? (
                          <div className="text-green-600 flex items-center gap-1.5 font-medium mt-1 bg-green-50 px-2 py-0.5 rounded-sm">
                            <CheckCircle2 className="w-3.5 h-3.5"/> 已满足
                          </div>
                        ) : (
                          <div className="text-red-500 flex items-center gap-1.5 font-medium mt-1 bg-red-50 px-2 py-0.5 rounded-sm">
                            <XCircle className="w-3.5 h-3.5"/> 不满足
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-48 bg-slate-50 p-4 font-medium border-r border-slate-200 text-slate-600 pt-5">
                    {effNeedsCapital ? '03.' : '02.'} 基础知识测试
                  </div>
                  <div className="flex-1 p-5 bg-white">
                    <p className="text-slate-500 text-xs mb-1">要求：成绩≥80分，请登录下方网址测试并下载成绩单</p>
                    <p className="text-slate-800 text-xs font-bold mb-3">请上传指定下单人{"{"}{"{"}姓名{"}"}{"}"}本人的成绩单。</p>
                    <a href="https://eztest.org/exam/session/41672/#/login" target="_blank" rel="noreferrer" className="inline-block text-blue-600 hover:text-blue-700 hover:underline text-xs mb-5">
                      前往考试平台: https://eztest.org/exam/session/41672/#/login
                    </a>
                    
                    <div className="bg-slate-50 p-5 border border-slate-200 border-dashed max-w-sm rounded-sm">
                      <p className="mb-3 text-xs font-medium text-slate-700">上传成绩单附件 <span className="text-red-500">*</span></p>
                      {isTestUploaded || isReadOnly ? (
                        <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-sm shadow-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-slate-700">期货基础知识测试成绩单.pdf</span>
                          </div>
                          {!isReadOnly ? (
                            <button onClick={() => setIsTestUploaded(false)} className="text-xs text-blue-600 hover:underline">重新上传</button>
                          ) : (
                            <span className="text-xs text-blue-600 cursor-pointer hover:underline">查看附件</span>
                          )}
                        </div>
                      ) : (
                        <>
                          <button onClick={() => setIsTestUploaded(true)} className="w-20 h-20 border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors rounded-sm shadow-sm">
                            <Plus className="w-5 h-5 mb-1" />
                            <span className="text-[10px]">点击上传</span>
                          </button>
                          <p className="text-[10px] text-slate-400 mt-2">支持 JPG、PNG、PDF</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exemption App Content */}
          {activeTab === 'exemption' && (
            <div className="animate-in fade-in duration-300 max-w-4xl">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">豁免条件说明</h3>
                <p className="text-slate-500 text-xs">若您符合以下任一情形，可直接上传证明材料申请豁免</p>
              </div>
              
              <div className="border border-slate-200 rounded-sm text-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-200 text-slate-700">
                  <p className="font-medium text-slate-800 mb-3">您符合以下哪种情形（可多选）？</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "已开通股票期权账户",
                      "已在其他期货公司开通中国金融期货交易所编码",
                      "已在其他期货公司开通上海国际能源交易中心编码",
                      "已在其他期货公司开通其他品种"
                    ].map((label, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 hover:bg-white border border-transparent hover:border-slate-200 transition-colors rounded-sm">
                        <Checkbox 
                          id={`ex-${i}`} 
                          className="rounded-sm" 
                          checked={isReadOnly ? (i === 1 || i === 3) : exemptionOptions[i]}
                          disabled={isReadOnly}
                          onCheckedChange={(checked) => {
                            if (isReadOnly) return;
                            const newOptions = [...exemptionOptions];
                            newOptions[i] = !!checked;
                            setExemptionOptions(newOptions);
                          }}
                        />
                        <label htmlFor={`ex-${i}`} className={cn("flex-1 text-xs leading-tight", isReadOnly ? "cursor-default text-slate-600" : "cursor-pointer")}>{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {(exemptionOptions.some(Boolean) || isReadOnly) && (
                  <div className="p-6 bg-white animate-in fade-in duration-300">
                    <p className="mb-3 text-sm font-medium text-slate-700">豁免证明材料 {(exemptionOptions[3] || isReadOnly) && <span className="text-red-500">*</span>}</p>
                    
                    {isExemptionUploaded || isReadOnly ? (
                      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-sm shadow-sm max-w-xl">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-slate-700">豁免证明材料.pdf</span>
                        </div>
                        {!isReadOnly ? (
                          <button onClick={() => setIsExemptionUploaded(false)} className="text-sm text-blue-600 hover:underline">重新上传</button>
                        ) : (
                          <span className="text-sm text-blue-600 cursor-pointer hover:underline">查看附件</span>
                        )}
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsExemptionUploaded(true)}
                        className="bg-slate-50 p-8 border border-slate-300 border-dashed text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer max-w-xl rounded-sm"
                      >
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-600 mb-3">将文件拖拽至此处，或 <span className="text-blue-600 hover:underline">点击上传</span></p>
                        <button className="px-4 py-1.5 border border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-50 font-medium rounded-sm">
                          选择文件
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Second-Time App Content (Direct Open) */}
          {activeTab === 'second-time' && (
            <div className="animate-in fade-in duration-300 max-w-4xl">
              <div className="space-y-6">
                <div className="relative pl-6 pb-0 border-l-2 border-transparent">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">系统已核验通过</h3>
                  <p className="text-xs text-slate-500 mb-3">您的账户已满足二次开通权限条件</p>
                  
                  <div className="bg-emerald-50/50 p-4 rounded-sm border border-emerald-100 flex items-start gap-3 text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div className="text-slate-700">
                      <p className="font-medium text-emerald-800 mb-1">无需额外补充证明材料</p>
                      <p className="text-xs text-emerald-700/80">您的资质、资产及经历等已由系统自动校验满足，���前正在直接进行权限挂接，请耐心等待 1-2个工作日。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {afterAllBlocks ? afterAllBlocks : !hideProcessRecord ? (
          <ProcessRecord status={status} rejectReason={rejectReason} />
        ) : null}
      </div>

      

      {/* Action Bar */}
      {!isReadOnly && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex justify-center gap-4">
          <Button variant="outline" className="w-32 rounded-sm" onClick={() => navigate('/')}>取消</Button>
          <Button 
            className="w-48 rounded-sm bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleComplete}
            disabled={
              (activeTab === 'first-time' && !canSubmitFirstTime) ||
              (activeTab === 'exemption' && !canSubmitExemption)
            }
          >
            提交申请
          </Button>
        </div>
      )}

      {/* License Confirm Dialog */}
      {!isReadOnly && (
        <LicenseConfirmDialog 
          open={licenseConfirmOpen} 
          onOpenChange={setLicenseConfirmOpen} 
          onConfirm={() => setSuccessOpen(true)} 
        />
      )}

      {/* Success Modal */}
      {!isReadOnly && (
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="max-w-md rounded-sm p-6 border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-lg text-slate-800 mb-2">开通申请提交成功</DialogTitle>
                <DialogDescription className="text-slate-600 text-sm leading-relaxed mb-6">您提交的交易权限开通申请我们已收到。本次业务办理预计 <strong>1-2个工作日</strong> 审核完成，您可以在“我发起的”列表中查看提交的流水状态。</DialogDescription>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="rounded-sm" onClick={() => {
                    setSuccessOpen(false);
                    navigate('/');
                  }}>返回首页</Button>
                  <Button className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                    setSuccessOpen(false);
                    navigate('/application-detail', { state: { applicationType: activeTab } });
                  }}>查看办理进度</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Debug Panel */}
      {!isReadOnly && (
        <div className="fixed bottom-4 right-4 bg-white p-4 border border-slate-200 shadow-xl rounded-sm z-50 w-72 text-sm animate-in slide-in-from-bottom-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-slate-700">
          <AlertCircle className="w-4 h-4 text-blue-500" />
          <h4 className="font-bold">状态调试面板</h4>
        </div>
        <div className="space-y-3">
          {!hasSelected && (
            <div className="bg-amber-50 p-2 rounded-sm border border-amber-100 mb-2">
              <p className="text-xs text-amber-800 font-medium mb-2">未检测到已选权限，手动开启显示：</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100/50 p-1 -ml-1 rounded-sm text-amber-900">
                  <Checkbox checked={debugForce100k} onCheckedChange={(c) => setDebugForce100k(!!c)} className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                  强制显示 100万验资要求
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100/50 p-1 -ml-1 rounded-sm text-amber-900">
                  <Checkbox checked={debugForce50k} onCheckedChange={(c) => setDebugForce50k(!!c)} className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                  强制显示 50万验资要求
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100/50 p-1 -ml-1 rounded-sm text-amber-900">
                  <Checkbox checked={debugForce10k} onCheckedChange={(c) => setDebugForce10k(!!c)} className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                  强制显示 10万验资要求
                </label>
              </div>
            </div>
          )}
          {effNeedsCapital && (
            <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded-sm">
              <Checkbox checked={isCapitalSatisfied} onCheckedChange={(c) => setIsCapitalSatisfied(!!c)} />
              验资情况满足 (动态表格联动)
            </label>
          )}
          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded-sm">
            <Checkbox checked={isRealExpSatisfied} onCheckedChange={(c) => setIsRealExpSatisfied(!!c)} />
            实盘交易经历满足 (≥10笔)
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded-sm">
            <Checkbox checked={isSimExpSatisfied} onCheckedChange={(c) => setIsSimExpSatisfied(!!c)} />
            仿真经历满足 (≥10日20笔)
          </label>
        </div>
      </div>
      )}
    </div>
  );
}