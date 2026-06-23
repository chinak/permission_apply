// Mock configuration data that acts as a singleton source of truth across the app
export const MOCK_REASONS = [
  { id: '1', content: '客户风险等级与申请品种不匹配', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-01 10:00' },
  { id: '2', content: '缺少必要的内控制度证明材料', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-02 11:30' },
  { id: '3', content: '法人或授权人证件已过期', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-03 14:15' },
  { id: '4', content: '客户适当性评估未通过', businessType: 'trade_permission', isEnabled: true, createTime: '2026-06-04 09:20' },
  { id: '5', content: '账户资金余额不满足要求', businessType: 'trade_permission', isEnabled: false, createTime: '2026-06-05 16:45' },
];

export const getEnabledReasons = (businessType: string = 'trade_permission') => {
  return MOCK_REASONS.filter(r => r.businessType === businessType && r.isEnabled);
};
