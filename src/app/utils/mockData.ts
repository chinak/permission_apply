// Mock configuration data that acts as a singleton source of truth across the app
export const MOCK_REASONS = [
  { id: '1', content: '客户风险等级与申请品种不匹配', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-01 10:00' },
  { id: '2', content: '缺少必要的内控制度证明材料', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-02 11:30' },
  { id: '3', content: '法人或授权人证件已过期', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-03 14:15' },
  { id: '4', content: '客户适当性评估未通过', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-04 09:20' },
  { id: '5', content: '账户资金余额不满足要求', businessType: 'trade_permission', isEnabled: false, createTime: '2026-06-05 16:45' },
  // 自然人业务 - 注销交易编码/权限
  { id: 'np-cancel-1', content: '客户存在未平仓合约，暂不可注销交易编码/权限', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-10 09:15' },
  { id: 'np-cancel-2', content: '客户账户存在未了结的资金流水', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-10 10:20' },
  { id: 'np-cancel-3', content: '交易所反馈交易编码状态异常，无法注销', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-11 14:05' },
  { id: 'np-cancel-4', content: '客户身份信息核验不通过', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-12 16:30' },
  { id: 'np-cancel-5', content: '客户申请材料不完整或签署不规范', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-13 11:00' },
  { id: 'np-cancel-6', content: '客户未签署权限注销风险揭示书', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-15 10:25' },
  { id: 'np-cancel-7', content: '客户存在待结算的手续费或保证金', businessType: 'natural_person_cancel', isEnabled: true, createTime: '2026-06-16 13:50' },
  { id: 'np-cancel-8', content: '客户申请信息与系统留存信息不一致', businessType: 'natural_person_cancel', isEnabled: false, createTime: '2026-06-17 17:20' },
];

export const getEnabledReasons = (businessType: string = 'trade_permission') => {
  return MOCK_REASONS.filter(r => r.businessType === businessType && r.isEnabled);
};

// ============================================================
// 自然人 - 注销交易编码/权限：办理流水（总部视角）
// 抽到统一 mock 数据源，供页面与左侧导航角标共用
// ============================================================
export interface CancelPermissionApplication {
  id: string;
  account: string;
  name: string;
  channel: string;
  branch: string;
  branchGroup: string;
  applyDate: string;
  processDate: string;
  lastCapTime: string;
  lastCtpTime: string;
  status: '办理中-经办' | '办理中-复核' | '办理失败-经办' | '办理失败-复核' | '办理成功';
  operator: string;
  reviewer: string;
  syncRecord: string;
  remark: string;
}

export const CANCEL_PERMISSION_APPLICATIONS: CancelPermissionApplication[] = [
  {
    id: '17004001',
    account: '1025000009',
    name: '周十四',
    channel: 'LucyApp',
    branch: '1090-新开发模拟',
    branchGroup: '1090-新开发模拟',
    applyDate: '2026-03-25 10:12',
    processDate: '-',
    lastCapTime: '-',
    lastCtpTime: '-',
    status: '办理中-经办',
    operator: '-',
    reviewer: '-',
    syncRecord: '未同步',
    remark: '',
  },
  {
    id: '17004002',
    account: '1025000010',
    name: '钱多多',
    channel: '同花顺手炒APP',
    branch: '1090-新开发模拟',
    branchGroup: '1090-新开发模拟',
    applyDate: '2026-03-24 14:30',
    processDate: '2026-03-24 16:05',
    lastCapTime: '2026-03-24 16:10',
    lastCtpTime: '2026-03-24 16:12',
    status: '办理中-复核',
    operator: '李经办',
    reviewer: '-',
    syncRecord: '同步成功',
    remark: '',
  },
  {
    id: '17004003',
    account: '1025000011',
    name: '孙七',
    channel: '掌期',
    branch: '1080-上海营业部',
    branchGroup: '1080-上海营业部',
    applyDate: '2026-03-22 09:45',
    processDate: '2026-03-22 11:20',
    lastCapTime: '2026-03-22 11:25',
    lastCtpTime: '2026-03-22 11:28',
    status: '办理成功',
    operator: '王经办',
    reviewer: '赵复核',
    syncRecord: '同步成功',
    remark: '',
  },
  {
    id: '17004004',
    account: '1025000012',
    name: '吴九',
    channel: '同花顺期货通',
    branch: '1070-北京营业部',
    branchGroup: '1070-北京营业部',
    applyDate: '2026-03-20 16:00',
    processDate: '2026-03-21 10:30',
    lastCapTime: '2026-03-21 10:35',
    lastCtpTime: '-',
    status: '办理失败-复核',
    operator: '孙经办',
    reviewer: '钱复核',
    syncRecord: '同步失败',
    remark: '材料不齐全，已退回',
  },
];

// 统计“办理中”（经办或复核）的待办理流水数，用于左侧导航角标
// 包含：办理中-经办、办理中-复核
// 不包含：办理成功、办理失败-*（终态）
export const getCancelPermissionPendingCount = (): number => {
  return CANCEL_PERMISSION_APPLICATIONS.filter(a => a.status.startsWith('办理中')).length;
};
