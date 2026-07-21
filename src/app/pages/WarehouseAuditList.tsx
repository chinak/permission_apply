import React, { useState } from 'react';
import { Search, ChevronDown, Download, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/checkbox';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import { WarehouseAudit, type AuditData, type Approver } from './WarehouseAudit';

const EXCHANGE_LABELS: Record<string, string> = {
  DCE: '大连商品交易所',
  CZCE: '郑州商品交易所',
  SHFE: '上海期货交易所',
};

const APPLICATIONS = [
  {
    id: 'WH-20260623-001',
    account: '88001234',
    clientName: '张三科技有限公司',
    branch: '上海浦东分公司',
    exchange: '大连商品交易所',
    direction: 'IN',
    directionText: '移入我司',
    type: '跨期货公司转移',
    contract: 'rb2501',
    lots: 50,
    applyDate: '2026-06-23 10:30',
    processDate: '-',
    status: '营业部审核',
    branchOperator: '-',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    rejectReason: '客户风险等级与申请品种不匹配，请重新评估。',
    hasResubmit: true,
    selectedExchanges: ['DCE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-24',
    outBrokerMemberId: '0001',
    outBrokerName: '中信期货有限公司',
    outClientTradingCodes: { DCE: '012345678', CZCE: '', SHFE: '' },
    outClientNames: { DCE: '张三科技有限公司', CZCE: '', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '100001', CZCE: '', SHFE: '' },
    inClientName: '张三科技有限公司',
    dceTransferByQuantity: 'YES',
    positions: [{ id: 'p1a', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2501', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 50, transferFunds: 1250000, remark: '' }, { id: 'p1b', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2505', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 30, transferFunds: 750000, remark: '' }, { id: 'p1c', exchange: 'DCE', varietyName: '铁矿石', contractCode: 'i2509', positionDirection: 'BUY', hedgeType: 'HEDGE', lots: 20, transferFunds: 1600000, remark: '套保合约' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.5 MB' }, { name: '客户身份证明.pdf', size: '1.8 MB' }, { name: '持仓证明.pdf', size: '1.2 MB' }],
  },
  {
    id: 'WH-20260622-002',
    account: '88001235',
    clientName: '李四投资管理有限公司',
    branch: '北京分公司',
    exchange: '上海期货交易所',
    direction: 'OUT',
    directionText: '移出我司',
    type: '实控关系组账户内转移',
    contract: 'cu2408',
    lots: 20,
    applyDate: '2026-06-22 14:20',
    processDate: '2026-06-22 15:00',
    status: '营业部审核',
    branchOperator: '王经办',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    selectedExchanges: ['SHFE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-23',
    inBrokerMemberId: '0003',
    inBrokerName: '永安期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '', SHFE: '112233445' },
    inClientName: '李四投资管理有限公司',
    outBrokerMemberId: '0000',
    outBrokerName: '国泰君安期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '', SHFE: '400005' },
    outClientNames: { DCE: '', CZCE: '', SHFE: '李四投资管理有限公司' },
    transferReason: '因业务调整，需将持仓转移至其他期货公司',
    positions: [{ id: 'p2a', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'SELL', hedgeType: 'HEDGE', lots: 20, transferFunds: 500000, remark: '' }, { id: 'p2b', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2410', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 15, transferFunds: 375000, remark: '' }, { id: 'p2c', exchange: 'SHFE', varietyName: '铝', contractCode: 'al2409', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 40, transferFunds: 800000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.1 MB' }],
  },
  {
    id: 'WH-20260621-003',
    account: '88001236',
    clientName: '王五国际贸易有限公司',
    branch: '深圳分公司',
    exchange: '郑州商品交易所',
    direction: 'IN',
    directionText: '移入我司',
    type: '跨期货公司转移',
    contract: 'SR501',
    lots: 100,
    applyDate: '2026-06-21 09:15',
    processDate: '2026-06-21 10:30',
    status: '总部经办',
    branchOperator: '钱经办',
    branchReviewer: '王复核',
    hqOperator: '-',
    hqReviewer: '-',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-21 14:20:00' },
      { role: '运营中心交割评估', name: '周经办', org: '运营中心', status: 'approved', time: '2026-06-21 15:10:00' },
      { role: '运营中心结算评估', name: '吴经办', org: '运营中心', status: 'approved', time: '2026-06-21 16:00:00' },
    ] as Approver[],
    selectedExchanges: ['CZCE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-22',
    outBrokerMemberId: '0005',
    outBrokerName: '银河期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '998877665', SHFE: '' },
    outClientNames: { DCE: '', CZCE: '王五国际贸易有限公司', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '200002', SHFE: '' },
    inClientName: '王五国际贸易有限公司',
    positions: [{ id: 'p3a', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR501', positionDirection: 'ALL', hedgeType: '', lots: 100, transferFunds: 2000000, remark: '郑商所全部持仓转移' }, { id: 'p3b', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR509', positionDirection: 'ALL', hedgeType: '', lots: 80, transferFunds: 1600000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '1.9 MB' }, { name: '客户身份证明.pdf', size: '1.5 MB' }],
  },
  {
    id: 'WH-20260620-004',
    account: '88001237',
    clientName: '赵六实业有限公司',
    branch: '广州分公司',
    exchange: '大连商品交易所',
    direction: 'ACTUAL_CONTROL',
    directionText: '实控组移仓',
    type: '实控关系组账户内转移',
    contract: 'i2505',
    lots: 80,
    applyDate: '2026-06-20 11:00',
    processDate: '2026-06-20 14:00',
    status: '总部复核',
    branchOperator: '赵经办',
    branchReviewer: '李复核',
    hqOperator: '周经办',
    hqReviewer: '-',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-20 14:20:00' },
      { role: '运营中心交割评估', name: '周经办', org: '运营中心', status: 'approved', time: '2026-06-20 15:10:00' },
      { role: '运营中心结算评估', name: '吴经办', org: '运营中心', status: 'approved', time: '2026-06-20 16:00:00' },
    ] as Approver[],
    selectedExchanges: ['DCE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-21',
    actualControlOutAccount: 'ACC90001',
    actualControlOutName: '赵六实业有限公司-账户A',
    actualControlInAccount: 'ACC90002',
    actualControlInName: '赵六实业有限公司-账户B',
    positions: [{ id: 'p4a', exchange: 'DCE', varietyName: '铁矿石', contractCode: 'i2505', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 80, transferFunds: 3000000, remark: '' }, { id: 'p4b', exchange: 'DCE', varietyName: '焦煤', contractCode: 'jm2509', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 25, transferFunds: 1250000, remark: '' }, { id: 'p4c', exchange: 'DCE', varietyName: '焦炭', contractCode: 'j2509', positionDirection: 'SELL', hedgeType: 'HEDGE', lots: 10, transferFunds: 800000, remark: '' }],
    remark: '实控关系组内账户转移',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '3.0 MB' }, { name: '实控关系证明.pdf', size: '1.7 MB' }],
  },
  {
    id: 'WH-20260619-005',
    account: '88001238',
    clientName: '华夏贸易有限公司',
    branch: '上海浦东分公司',
    exchange: '郑州商品交易所',
    direction: 'OUT',
    directionText: '移出我司',
    type: '跨期货公司转移',
    contract: 'CF501',
    lots: 200,
    applyDate: '2026-06-19 13:45',
    processDate: '2026-06-19 15:20',
    status: '已完成',
    branchOperator: '钱经办',
    branchReviewer: '孙复核',
    hqOperator: '李经办',
    hqReviewer: '赵复核',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-19 14:20:00' },
      { role: '运营中心交割评估', name: '周经办', org: '运营中心', status: 'approved', time: '2026-06-19 15:10:00' },
      { role: '运营中心结算评估', name: '吴经办', org: '运营中心', status: 'approved', time: '2026-06-19 16:00:00' },
    ] as Approver[],
    selectedExchanges: ['CZCE'],
    contractType: 'OPTIONS',
    transferDate: '2026-06-20',
    inBrokerMemberId: '0007',
    inBrokerName: '中信建投期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '554433221', SHFE: '' },
    inClientName: '华夏贸易有限公司',
    outBrokerMemberId: '0000',
    outBrokerName: '国泰君安期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '500006', SHFE: '' },
    outClientNames: { DCE: '', CZCE: '华夏贸易有限公司', SHFE: '' },
    transferReason: '业务需要，变更期货经纪商',
    positions: [{ id: 'p5a', exchange: 'CZCE', varietyName: '棉花', contractCode: 'CF501', positionDirection: 'ALL', hedgeType: '', lots: 200, transferFunds: 4500000, remark: '' }, { id: 'p5b', exchange: 'CZCE', varietyName: '棉花', contractCode: 'CF509', positionDirection: 'ALL', hedgeType: '', lots: 150, transferFunds: 3375000, remark: '' }, { id: 'p5c', exchange: 'CZCE', varietyName: 'PTA', contractCode: 'TA501', positionDirection: 'ALL', hedgeType: '', lots: 300, transferFunds: 1800000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.3 MB' }],
  },
  {
    id: 'WH-20260618-006',
    account: '88001239',
    clientName: '明达资产管理有限公司',
    branch: '杭州分公司',
    exchange: '大连商品交易所、上海期货交易所',
    direction: 'IN',
    directionText: '移入我司',
    type: '跨期货公司转移',
    contract: 'm2505, ag2506',
    lots: 120,
    applyDate: '2026-06-18 08:50',
    processDate: '2026-06-18 11:30',
    status: '已完成',
    branchOperator: '吴经办',
    branchReviewer: '郑复核',
    hqOperator: '钱经办',
    hqReviewer: '陈复核',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-18 14:20:00' },
      { role: '运营中心交割评估', name: '周经办', org: '运营中心', status: 'approved', time: '2026-06-18 15:10:00' },
      { role: '运营中心结算评估', name: '吴经办', org: '运营中心', status: 'approved', time: '2026-06-18 16:00:00' },
    ] as Approver[],
    selectedExchanges: ['DCE', 'SHFE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-19',
    outBrokerMemberId: '0008',
    outBrokerName: '方正中期期货有限公司',
    outClientTradingCodes: { DCE: '778899001', CZCE: '', SHFE: '223344556' },
    outClientNames: { DCE: '明达资产管理有限公司', CZCE: '', SHFE: '明达资产管理有限公司' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '300003', CZCE: '', SHFE: '300004' },
    inClientName: '明达资产管理有限公司',
    dceTransferByQuantity: 'YES',
    transferReason: '',
    positions: [{ id: 'p6a', exchange: 'DCE', varietyName: '豆粕', contractCode: 'm2505', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 70, transferFunds: 1400000, remark: '' }, { id: 'p6b', exchange: 'SHFE', varietyName: '白银', contractCode: 'ag2506', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 50, transferFunds: 3000000, remark: '' }, { id: 'p6c', exchange: 'DCE', varietyName: '豆粕', contractCode: 'm2509', positionDirection: 'BUY', hedgeType: 'HEDGE', lots: 30, transferFunds: 600000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.8 MB' }, { name: '客户身份证明.pdf', size: '1.6 MB' }],
  },
  {
    id: 'WH-20260617-007',
    account: '88001240',
    clientName: '融创投资集团有限公司',
    branch: '深圳分公司',
    exchange: '大连商品交易所、郑州商品交易所、上海期货交易所',
    direction: 'OUT',
    directionText: '移出我司',
    type: '跨期货公司转移',
    contract: 'rb2501, CF501, cu2408',
    lots: 450,
    applyDate: '2026-06-17 13:20',
    processDate: '2026-06-17 16:00',
    status: '营业部审核',
    branchOperator: '-',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    selectedExchanges: ['DCE', 'CZCE', 'SHFE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-18',
    inBrokerMemberId: '0010',
    inBrokerName: '华泰期货有限公司',
    inClientTradingCodes: { DCE: '999888777', CZCE: '999888777', SHFE: '999888777' },
    inClientName: '融创投资集团有限公司',
    outBrokerMemberId: '0000',
    outBrokerName: '国泰君安期货有限公司',
    outClientTradingCodes: { DCE: '600007', CZCE: '600008', SHFE: '600009' },
    outClientNames: { DCE: '融创投资集团有限公司', CZCE: '融创投资集团有限公司', SHFE: '融创投资集团有限公司' },
    transferReason: '业务整合需要，统一转移至新期货公司',
    positions: [{ id: 'p7a', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2501', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 100, transferFunds: 2500000, remark: '' }, { id: 'p7b', exchange: 'CZCE', varietyName: '棉花', contractCode: 'CF501', positionDirection: 'ALL', hedgeType: '', lots: 200, transferFunds: 4500000, remark: '' }, { id: 'p7c', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'SELL', hedgeType: 'HEDGE', lots: 150, transferFunds: 3750000, remark: '' }, { id: 'p7d', exchange: 'DCE', varietyName: '铁矿石', contractCode: 'i2505', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 80, transferFunds: 3000000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '3.5 MB' }, { name: '客户身份证明.pdf', size: '1.9 MB' }, { name: '持仓证明.pdf', size: '2.1 MB' }],
  },
  // 会签进行中（1/3 已通过）
  {
    id: 'WH-20260625-008',
    account: '88001241',
    clientName: '宏远期货投资有限公司',
    branch: '上海浦东分公司',
    exchange: '大连商品交易所',
    direction: 'IN',
    directionText: '移入我司',
    type: '跨期货公司转移',
    contract: 'm2509',
    lots: 60,
    applyDate: '2026-06-25 09:00',
    processDate: '2026-06-25 10:30',
    status: '运营中心会签',
    branchOperator: '王审核',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-25 14:20:00' },
      { role: '运营中心交割评估', name: '', org: '运营中心', status: 'pending', time: '-' },
      { role: '运营中心结算评估', name: '', org: '运营中心', status: 'pending', time: '-' },
    ] as Approver[],
    selectedExchanges: ['DCE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-26',
    outBrokerMemberId: '0011',
    outBrokerName: '光大期货有限公司',
    outClientTradingCodes: { DCE: '445566778', CZCE: '', SHFE: '' },
    outClientNames: { DCE: '宏远期货投资有限公司', CZCE: '', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '400008', CZCE: '', SHFE: '' },
    inClientName: '宏远期货投资有限公司',
    dceTransferByQuantity: 'NO',
    positions: [{ id: 'p8a', exchange: 'DCE', varietyName: '豆粕', contractCode: 'm2509', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 60, transferFunds: 1200000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.2 MB' }, { name: '客户身份证明.pdf', size: '1.5 MB' }],
  },
  // 会签已驳回（风控评估驳回，一票否决）
  {
    id: 'WH-20260624-009',
    account: '88001242',
    clientName: '泰和资产管理有限公司',
    branch: '北京分公司',
    exchange: '上海期货交易所',
    direction: 'OUT',
    directionText: '移出我司',
    type: '跨期货公司转移',
    contract: 'cu2509',
    lots: 30,
    applyDate: '2026-06-24 10:00',
    processDate: '2026-06-24 11:00',
    status: '运营中心会签',
    branchOperator: '李审核',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'rejected', time: '2026-06-24 15:30:00', comment: '客户保证金不足，不满足移仓条件' },
      { role: '运营中心交割评估', name: '', org: '运营中心', status: 'pending', time: '-' },
      { role: '运营中心结算评估', name: '', org: '运营中心', status: 'pending', time: '-' },
    ] as Approver[],
    selectedExchanges: ['SHFE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-25',
    inBrokerMemberId: '0012',
    inBrokerName: '申银万国期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '', SHFE: '667788990' },
    inClientName: '泰和资产管理有限公司',
    outBrokerMemberId: '0000',
    outBrokerName: '国泰君安期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '', SHFE: '600010' },
    outClientNames: { DCE: '', CZCE: '', SHFE: '泰和资产管理有限公司' },
    transferReason: '业务调整，变更期货经纪商',
    positions: [{ id: 'p9a', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2509', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 30, transferFunds: 750000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '1.8 MB' }],
  },
  // 会签全部通过（3/3），当前在总部经办
  {
    id: 'WH-20260623-010',
    account: '88001243',
    clientName: '中诚国际贸易有限公司',
    branch: '深圳分公司',
    exchange: '郑州商品交易所',
    direction: 'IN',
    directionText: '移入我司',
    type: '跨期货公司转移',
    contract: 'SR509',
    lots: 120,
    applyDate: '2026-06-23 08:30',
    processDate: '2026-06-23 09:00',
    status: '总部经办',
    branchOperator: '赵审核',
    branchReviewer: '-',
    hqOperator: '-',
    hqReviewer: '-',
    counterSignApprovers: [
      { role: '运营中心风控评估', name: '孙经办', org: '运营中心', status: 'approved', time: '2026-06-24 10:15:00' },
      { role: '运营中心交割评估', name: '周经办', org: '运营中心', status: 'approved', time: '2026-06-24 11:30:00' },
      { role: '运营中心结算评估', name: '吴经办', org: '运营中心', status: 'approved', time: '2026-06-24 14:00:00' },
    ] as Approver[],
    selectedExchanges: ['CZCE'],
    contractType: 'FUTURES',
    transferDate: '2026-06-25',
    outBrokerMemberId: '0013',
    outBrokerName: '海通期货有限公司',
    outClientTradingCodes: { DCE: '', CZCE: '334455667', SHFE: '' },
    outClientNames: { DCE: '', CZCE: '中诚国际贸易有限公司', SHFE: '' },
    inBrokerMemberId: '0000',
    inBrokerName: '国泰君安期货有限公司',
    inClientTradingCodes: { DCE: '', CZCE: '300009', SHFE: '' },
    inClientName: '中诚国际贸易有限公司',
    positions: [{ id: 'p10a', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR509', positionDirection: 'ALL', hedgeType: '', lots: 120, transferFunds: 2400000, remark: '' }],
    remark: '',
    attachments: [{ name: '移仓业务申请表_盖章.pdf', size: '2.0 MB' }, { name: '客户身份证明.pdf', size: '1.3 MB' }],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case '营业部审核': return 'text-amber-700 bg-amber-50 border-amber-200';
    case '运营中心会签': return 'text-cyan-700 bg-cyan-50 border-cyan-200';
    case '总部经办': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case '总部复核': return 'text-purple-700 bg-purple-50 border-purple-200';
    case '已完成': return 'text-green-700 bg-green-50 border-green-200';
    case '已驳回': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
};

const getDirectionColor = (direction: string) => {
  switch (direction) {
    case 'IN': return 'bg-green-50 text-green-700 border-green-200';
    case 'OUT': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'ACTUAL_CONTROL': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export function WarehouseAuditList() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<typeof APPLICATIONS[0] | null>(null);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(APPLICATIONS.map(app => app.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, id]);
    } else {
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const hasSelection = selectedRowIds.length > 0;

  const handleRowClick = (app: typeof APPLICATIONS[0]) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Filter Panel */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">流水号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">资金账号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">客户名称</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">营业部</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">上海浦东分公司</option>
                <option value="2">北京分公司</option>
                <option value="3">深圳分公司</option>
                <option value="4">广州分公司</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">交易所</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="DCE">大连商品交易所</option>
                <option value="CZCE">郑州商品交易所</option>
                <option value="SHFE">上海期货交易所</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">移仓方向</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="IN">移入我司</option>
                <option value="OUT">移出我司</option>
                <option value="ACTUAL_CONTROL">实控组移仓</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">申请日期</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">办理状态</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                <option value="1">营业部审核</option>
                <option value="2">运营中心会签</option>
                <option value="3">总部经办</option>
                <option value="4">总部复核</option>
                <option value="5">已完成</option>
                <option value="6">已驳回</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">经办人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">复核人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-slate-100">
          <Button className="px-6 rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            查询
          </Button>
          <Button variant="outline" className="px-6 rounded-sm text-slate-600 h-8 text-sm">重置</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        {/* Action Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3">
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection}>批量处理</Button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <Button variant="outline" className="text-sm rounded-sm text-slate-700" disabled={!hasSelection}>批量导出</Button>
          <Button variant="outline" className="text-sm rounded-sm text-slate-700">全部导出</Button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <Button variant="outline" className="text-sm rounded-sm text-slate-700 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> 附件全部下载
          </Button>
          <div className="flex-1" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="font-medium px-4 py-3 w-10">
                  <Checkbox
                    className="rounded-sm"
                    checked={selectedRowIds.length === APPLICATIONS.length && APPLICATIONS.length > 0}
                    onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                  />
                </th>
                <th className="font-medium px-4 py-3">流水号</th>
                <th className="font-medium px-4 py-3">资金账号</th>
                <th className="font-medium px-4 py-3">客户名称</th>
                <th className="font-medium px-4 py-3">营业部</th>
                <th className="font-medium px-4 py-3">交易所</th>
                <th className="font-medium px-4 py-3">移仓方向</th>
                <th className="font-medium px-4 py-3">申请日期</th>
                <th className="font-medium px-4 py-3">办理状态</th>
                <th className="font-medium px-4 py-3">营业部审核人</th>
                <th className="font-medium px-4 py-3">运营中心会签</th>
                <th className="font-medium px-4 py-3">总部经办人</th>
                <th className="font-medium px-4 py-3">总部复核人</th>
                <th className="font-medium px-4 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {APPLICATIONS.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(app)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      className="rounded-sm"
                      checked={selectedRowIds.includes(app.id)}
                      onCheckedChange={(checked) => toggleSelectRow(app.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{app.id}</td>
                  <td className="px-4 py-3 text-slate-600">{app.account}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium truncate max-w-[150px]" title={app.clientName}>{app.clientName}</td>
                  <td className="px-4 py-3 text-slate-600">{app.branch}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="block truncate max-w-[200px]" title={app.selectedExchanges?.length ? app.selectedExchanges.map(ex => EXCHANGE_LABELS[ex] || ex).join('、') : app.exchange}>
                      {app.selectedExchanges?.length ? app.selectedExchanges.map(ex => EXCHANGE_LABELS[ex] || ex).join('、') : app.exchange}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border',
                      getDirectionColor(app.direction)
                    )}>
                      {app.directionText}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{app.applyDate}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border',
                      getStatusColor(app.status)
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.branchOperator}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {app.counterSignApprovers ? (
                      <span className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium border',
                        app.counterSignApprovers.some(a => a.status === 'rejected')
                          ? 'text-red-700 bg-red-50 border-red-200'
                          : app.counterSignApprovers.every(a => a.status === 'approved')
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : 'text-cyan-700 bg-cyan-50 border-cyan-200'
                      )}>
                        {app.counterSignApprovers.some(a => a.status === 'rejected')
                          ? '已驳回'
                          : `${app.counterSignApprovers.filter(a => a.status === 'approved').length}/${app.counterSignApprovers.length}`}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{app.hqOperator}</td>
                  <td className="px-4 py-3 text-slate-600">{app.hqReviewer}</td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto text-xs"
                      onClick={() => handleRowClick(app)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> 详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>共 {APPLICATIONS.length} 条记录</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>上一页</button>
            <button className="px-2 py-1 border border-slate-200 bg-blue-50 text-blue-600 rounded-sm font-medium">1</button>
            <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="!max-w-[50vw] w-full h-[90vh] p-0 border-none rounded-sm overflow-hidden bg-slate-50 flex flex-col gap-0">
          <DialogDescription className="sr-only">移仓业务审批详情</DialogDescription>
          {/* Sticky modal header */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-20">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-wide">移仓业务总部审核</DialogTitle>
            {selectedApp && (
              <span className="ml-3 text-xs text-slate-400 font-mono">{selectedApp.id}</span>
            )}
          </div>
          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {selectedApp && (
              <WarehouseAudit
                isModal={true}
                hideTitle={true}
                onClose={() => setIsDetailOpen(false)}
                data={{
                  ...selectedApp,
                  exchangeName: selectedApp.exchange,
                  status: selectedApp.status === '已完成' ? 'success' : 'processing',
                  statusText: selectedApp.status,
                } as AuditData}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
