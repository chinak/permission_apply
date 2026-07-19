import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Button } from './ui/Button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function ConfigPanel() {
  const [collapsed, setCollapsed] = useState(true);
  const { 
    riskLevel, setRiskLevel, 
    fundLevel, setFundLevel,
    has50Days, setHas50Days,
    existingMaxValue, setExistingMaxValue,
    isSpecialCorp, setIsSpecialCorp,
    customerType, setCustomerType,
    investorType, setInvestorType
  } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-slate-200 text-xs w-72 transition-all">
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-t-lg border-b border-slate-100 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
      >
        <span>状态模拟面板</span>
        {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div className="p-4 pt-3">
      
      <div className="mb-3">
        <p className="font-medium text-slate-600 mb-1">投资者类型:</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={investorType === '普通投资者' ? 'default' : 'outline'}
            onClick={() => setInvestorType('普通投资者')}
            className="h-7 text-xs flex-1"
          >
            普通投资者
          </Button>
          <Button 
            size="sm" 
            variant={investorType === '专业投资者' ? 'default' : 'outline'}
            onClick={() => setInvestorType('专业投资者')}
            className="h-7 text-xs flex-1"
          >
            专业投资者
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="font-medium text-slate-600 mb-1">客户类型:</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={!isSpecialCorp ? 'default' : 'outline'}
            onClick={() => setIsSpecialCorp(false)}
            className="h-7 text-xs flex-1"
          >
            一般法人
          </Button>
          <Button 
            size="sm" 
            variant={isSpecialCorp ? 'default' : 'outline'}
            onClick={() => setIsSpecialCorp(true)}
            className="h-7 text-xs flex-1"
          >
            特法客户
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <p className="font-medium text-slate-600 mb-1">风险等级:</p>
        <div className="flex gap-2">
          {['C3', 'C4', 'C5'].map(level => (
            <Button 
              key={level}
              size="sm" 
              variant={riskLevel === level ? 'default' : 'outline'}
              onClick={() => setRiskLevel(level as any)}
              className="h-7 text-xs flex-1"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="font-medium text-slate-600 mb-1">可用资金:</p>
        <select 
          className="w-full border border-slate-300 rounded p-1 text-xs"
          value={fundLevel}
          onChange={(e) => setFundLevel(e.target.value as any)}
        >
          <option value="LT_500K">&lt; 50万</option>
          <option value="GE_500K_LT_1M">≥ 50万，&lt; 100万</option>
          <option value="GE_1M">≥ 100万</option>
        </select>
      </div>

      <div className="mb-3">
        <p className="font-medium text-slate-600 mb-1">交易经历:</p>
        <select 
          className="w-full border border-slate-300 rounded p-1 text-xs"
          value={has50Days ? 'true' : 'false'}
          onChange={(e) => setHas50Days(e.target.value === 'true')}
        >
          <option value="false">不满 50 个交易日</option>
          <option value="true">满 50 个交易日</option>
        </select>
      </div>

      <div>
        <p className="font-medium text-slate-600 mb-1">已有权限赋值 (现有最高权限):</p>
        <select 
          className="w-full border border-slate-300 rounded p-1 text-xs"
          value={existingMaxValue}
          onChange={(e) => setExistingMaxValue(Number(e.target.value))}
        >
          <option value={0}>0 (无)</option>
          <option value={5}>5 (商品类)</option>
          <option value={8}>8 (原油)</option>
          <option value={10}>10 (中金所)</option>
        </select>
      </div>
      </div>
      )}
    </div>
  );
}
