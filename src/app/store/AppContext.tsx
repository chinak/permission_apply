import React, { createContext, useContext, useState } from 'react';

export type RiskLevel = 'C3' | 'C4' | 'C5';
export type FundLevel = 'LT_500K' | 'GE_500K_LT_1M' | 'GE_1M';

interface AppState {
  account: string;
  riskLevel: RiskLevel;
  setRiskLevel: (level: RiskLevel) => void;
  
  // Real logic variables
  fundLevel: FundLevel;
  setFundLevel: (level: FundLevel) => void;
  has50Days: boolean;
  setHas50Days: (has: boolean) => void;
  existingMaxValue: number;
  setExistingMaxValue: (val: number) => void;
  isSpecialCorp: boolean;
  setIsSpecialCorp: (isSpecial: boolean) => void;

  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  customerType: '一般法人';
  setCustomerType: (type: '一般法人') => void;
  investorType: '普通投资者' | '专业投资者';
  setInvestorType: (type: '普通投资者' | '专业投资者') => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('C4');
  const [fundLevel, setFundLevel] = useState<FundLevel>('LT_500K');
  const [has50Days, setHas50Days] = useState<boolean>(false);
  const [existingMaxValue, setExistingMaxValue] = useState<number>(0);
  const [isSpecialCorp, setIsSpecialCorp] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<'一般法人'>('一般法人');
  const [investorType, setInvestorType] = useState<'普通投资者' | '专业投资者'>('普通投资者');
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{
      account: '85171680',
      riskLevel, setRiskLevel,
      fundLevel, setFundLevel,
      has50Days, setHas50Days,
      existingMaxValue, setExistingMaxValue,
      isSpecialCorp, setIsSpecialCorp,
      customerType, setCustomerType,
      investorType, setInvestorType,
      selectedProducts, setSelectedProducts
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
