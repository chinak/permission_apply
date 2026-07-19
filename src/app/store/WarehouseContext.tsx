import React, { createContext, useContext, useState } from 'react';

export type WarehouseExchange = 'DCE' | 'CZCE' | 'SHFE';
export type WarehouseDirection = 'OUT' | 'IN' | 'ACTUAL_CONTROL';
export type ContractType = 'FUTURES' | 'OPTIONS';

export interface PositionRow {
  id: string;
  exchange: string;
  varietyName: string;
  contractCode: string;
  positionDirection: 'BUY' | 'SELL' | 'ALL';
  hedgeType: 'SPEC' | 'HEDGE' | '';
  lots: number;
  transferFunds: number;
  remark: string;
}

interface WarehouseState {
  account: string;
  customerName: string;
  branch: string;
  customerType: string;

  selectedExchanges: WarehouseExchange[];
  setSelectedExchanges: (val: WarehouseExchange[]) => void;
  direction: WarehouseDirection | '';
  setDirection: (val: WarehouseDirection | '') => void;
  contractType: ContractType;
  setContractType: (val: ContractType) => void;
  transferDate: string;
  setTransferDate: (val: string) => void;
  outBrokerMemberId: string;
  setOutBrokerMemberId: (val: string) => void;
  outBrokerName: string;
  setOutBrokerName: (val: string) => void;
  inBrokerMemberId: string;
  setInBrokerMemberId: (val: string) => void;
  inBrokerName: string;
  setInBrokerName: (val: string) => void;
  outClientTradingCodes: Record<WarehouseExchange, string>;
  setOutClientTradingCodes: (val: Record<WarehouseExchange, string>) => void;
  outClientNames: Record<WarehouseExchange, string>;
  setOutClientNames: (val: Record<WarehouseExchange, string>) => void;
  inClientTradingCodes: Record<WarehouseExchange, string>;
  setInClientTradingCodes: (val: Record<WarehouseExchange, string>) => void;
  inClientName: string;
  setInClientName: (val: string) => void;
  actualControlOutAccount: string;
  setActualControlOutAccount: (val: string) => void;
  actualControlOutName: string;
  setActualControlOutName: (val: string) => void;
  actualControlInAccount: string;
  setActualControlInAccount: (val: string) => void;
  actualControlInName: string;
  setActualControlInName: (val: string) => void;
  accountPermissions: Record<string, boolean>;
  toggleAccountPermission: (account: string) => void;
  hasPermissionForAccount: (account: string) => boolean;
  dceTransferByQuantity: 'YES' | 'NO' | '';
  setDceTransferByQuantity: (val: 'YES' | 'NO' | '') => void;
  transferReason: string;
  setTransferReason: (val: string) => void;
  positions: PositionRow[];
  setPositions: (positions: PositionRow[]) => void;
  attachments: { name: string; size: string }[];
  setAttachments: (attachments: { name: string; size: string }[]) => void;
  confirmed: boolean;
  setConfirmed: (val: boolean) => void;
  remark: string;
  setRemark: (val: string) => void;
  reset: () => void;
}

const WarehouseContext = createContext<WarehouseState | undefined>(undefined);

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedExchanges, setSelectedExchanges] = useState<WarehouseExchange[]>([]);
  const [direction, setDirection] = useState<WarehouseDirection | ''>('');
  const [contractType, setContractType] = useState<ContractType>('FUTURES');
  const [transferDate, setTransferDate] = useState('');
  const [outBrokerMemberId, setOutBrokerMemberId] = useState('');
  const [outBrokerName, setOutBrokerName] = useState('');
  const [inBrokerMemberId, setInBrokerMemberId] = useState('');
  const [inBrokerName, setInBrokerName] = useState('');
  const [outClientTradingCodes, setOutClientTradingCodes] = useState<Record<WarehouseExchange, string>>({ DCE: '', CZCE: '', SHFE: '' });
  const [outClientNames, setOutClientNames] = useState<Record<WarehouseExchange, string>>({ DCE: '', CZCE: '', SHFE: '' });
  const [inClientTradingCodes, setInClientTradingCodes] = useState<Record<WarehouseExchange, string>>({ DCE: '', CZCE: '', SHFE: '' });
  const [inClientName, setInClientName] = useState('');
  const [actualControlOutAccount, setActualControlOutAccount] = useState('');
  const [actualControlOutName, setActualControlOutName] = useState('');
  const [actualControlInAccount, setActualControlInAccount] = useState('');
  const [actualControlInName, setActualControlInName] = useState('');
  const [accountPermissions, setAccountPermissions] = useState<Record<string, boolean>>({
    '85171680': true,
    '95281791': true,
    '95281792': true,
    '85171681': true,
    '85171682': true,
  });
  const toggleAccountPermission = (account: string) => {
    setAccountPermissions(prev => ({ ...prev, [account]: !prev[account] }));
  };
  const hasPermissionForAccount = (account: string) => !!accountPermissions[account];
  const [dceTransferByQuantity, setDceTransferByQuantity] = useState<'YES' | 'NO' | ''>('');
  const [transferReason, setTransferReason] = useState('');
  const [positions, setPositions] = useState<PositionRow[]>([]);
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [remark, setRemark] = useState('');

  const reset = () => {
    setSelectedExchanges([]);
    setDirection('');
    setContractType('FUTURES');
    setTransferDate('');
    setOutBrokerMemberId('');
    setOutBrokerName('');
    setInBrokerMemberId('');
    setInBrokerName('');
    setOutClientTradingCodes({ DCE: '', CZCE: '', SHFE: '' });
    setOutClientNames({ DCE: '', CZCE: '', SHFE: '' });
    setInClientTradingCodes({ DCE: '', CZCE: '', SHFE: '' });
    setInClientName('');
    setActualControlOutAccount('');
    setActualControlOutName('');
    setActualControlInAccount('');
    setActualControlInName('');
    setAccountPermissions({
      '85171680': true,
      '95281791': true,
      '95281792': true,
      '85171681': true,
      '85171682': true,
    });
    setDceTransferByQuantity('');
    setTransferReason('');
    setPositions([]);
    setAttachments([]);
    setConfirmed(false);
    setRemark('');
  };

  return (
    <WarehouseContext.Provider value={{
      account: '85171680',
      customerName: '张三科技有限公司',
      branch: '上海浦东分公司',
      customerType: '一般法人',
      selectedExchanges, setSelectedExchanges,
      direction, setDirection,
      contractType, setContractType,
      transferDate, setTransferDate,
      outBrokerMemberId, setOutBrokerMemberId,
      outBrokerName, setOutBrokerName,
      inBrokerMemberId, setInBrokerMemberId,
      inBrokerName, setInBrokerName,
      outClientTradingCodes, setOutClientTradingCodes,
      outClientNames, setOutClientNames,
      inClientTradingCodes, setInClientTradingCodes,
      inClientName, setInClientName,
      actualControlOutAccount, setActualControlOutAccount,
      actualControlOutName, setActualControlOutName,
      actualControlInAccount, setActualControlInAccount,
      actualControlInName, setActualControlInName,
      accountPermissions, toggleAccountPermission, hasPermissionForAccount,
      dceTransferByQuantity, setDceTransferByQuantity,
      transferReason, setTransferReason,
      positions, setPositions,
      attachments, setAttachments,
      confirmed, setConfirmed,
      remark, setRemark,
      reset,
    }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouseContext() {
  const context = useContext(WarehouseContext);
  if (!context) throw new Error('useWarehouseContext must be used within WarehouseProvider');
  return context;
}
