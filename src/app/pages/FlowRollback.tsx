import { useState } from 'react';
import {
  Undo2, History, Trash2, CornerUpLeft, Search, Download,
  ChevronDown, AlertTriangle, Filter, ClipboardList,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// 业务类型选项
const BUSINESS_TYPES = [
  '电话号码更新',
  '增开交易编码',
  '更换银行卡',
  '身份证有效期更新',
  '特殊品种权限申请（新）',
  '手机号更新',
  '交易权限证明开具',
  '基本资料变更',
  '期货销户',
  '账户规范',
];

// 回退节点选项
const ROLLBACK_NODES = [
  '办理中-经办',
  '办理中-复核',
  '已提交',
  '待受理',
];

interface RollbackRecord {
  id: string;
  bizType: string;
  serialNo: string;
  status: string;
  processTime: string;
  operator: string;
  reviewer: string;
  rollbackBy: string;
}

const MOCK_RECORDS: RollbackRecord[] = [
  { id: '1', bizType: '增开交易编码', serialNo: '174047734', status: '办理中-复核', processTime: '2026-07-09 18:22:22', operator: '成璐', reviewer: '成璐', rollbackBy: '成璐' },
  { id: '2', bizType: '更换银行卡', serialNo: '165046385', status: '办理中-复核', processTime: '2026-07-06 22:59:03', operator: '陈铠', reviewer: '-', rollbackBy: '成璐' },
  { id: '3', bizType: '身份证有效期更新', serialNo: '176047742', status: '办理中-复核', processTime: '2026-07-06 14:34:23', operator: '肖驰', reviewer: '肖驰', rollbackBy: '肖驰' },
  { id: '4', bizType: '身份证有效期更新', serialNo: '176047742', status: '办理中-复核', processTime: '2026-07-06 13:47:10', operator: '肖驰', reviewer: '肖驰', rollbackBy: '肖驰' },
  { id: '5', bizType: '身份证有效期更新', serialNo: '175047741', status: '办理中-复核', processTime: '2026-07-06 13:31:24', operator: '陈铠', reviewer: '陈铠', rollbackBy: '陈铠' },
  { id: '6', bizType: '增开交易编码', serialNo: '174047739', status: '办理中-经办', processTime: '2026-07-06 10:48:34', operator: '成璐', reviewer: '成璐', rollbackBy: '成璐' },
  { id: '7', bizType: '特殊品种权限申请（新）', serialNo: '173047685', status: '办理中-经办', processTime: '2026-07-06 10:42:50', operator: '成璐', reviewer: '肖驰', rollbackBy: '肖驰' },
  { id: '8', bizType: '身份证有效期更新', serialNo: '173047703', status: '办理中-经办', processTime: '2026-06-25 17:39:00', operator: '成璐', reviewer: '-', rollbackBy: '陈铠' },
  { id: '9', bizType: '手机号更新', serialNo: '173047707', status: '办理中-复核', processTime: '2026-06-25 15:02:28', operator: '241', reviewer: '-', rollbackBy: '陈铠' },
  { id: '10', bizType: '手机号更新', serialNo: '173047709', status: '办理中-经办', processTime: '2026-06-25 14:01:18', operator: '241', reviewer: '241', rollbackBy: '陈铠' },
  { id: '11', bizType: '身份证有效期更新', serialNo: '172047471', status: '办理中-经办', processTime: '2026-05-21 17:16:00', operator: '陈铠', reviewer: '陈铠', rollbackBy: '陈铠' },
  { id: '12', bizType: '特殊品种权限申请（新）', serialNo: '171047400', status: '办理中-复核', processTime: '2026-05-18 13:57:45', operator: '孙斌', reviewer: '孙斌', rollbackBy: '孙斌' },
  { id: '13', bizType: '增开交易编码', serialNo: '170047339', status: '办理中-复核', processTime: '2026-05-16 18:18:18', operator: '孙斌', reviewer: '孙斌', rollbackBy: '孙斌' },
  { id: '14', bizType: '交易权限证明开具', serialNo: '167047084', status: '办理中-复核', processTime: '2026-03-21 10:18:06', operator: '客户自己', reviewer: '-', rollbackBy: '肖驰' },
  { id: '15', bizType: '基本资料变更', serialNo: '165046380', status: '办理中-经办', processTime: '2026-02-10 16:44:16', operator: '孙斌', reviewer: '-', rollbackBy: '肖驰' },
  { id: '16', bizType: '期货销户', serialNo: '129045338', status: '办理中-经办', processTime: '2026-02-10 16:27:00', operator: '肖驰', reviewer: '肖驰', rollbackBy: '孙斌' },
  { id: '17', bizType: '账户规范', serialNo: '165046262', status: '办理中-复核', processTime: '2026-01-13 09:46:37', operator: '肖驰', reviewer: '肖驰', rollbackBy: '肖驰' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case '办理中-经办': return 'text-amber-700 bg-amber-50 border-amber-200';
    case '办理中-复核': return 'text-blue-700 bg-blue-50 border-blue-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
};

export function FlowRollback() {
  const [activeTab, setActiveTab] = useState<'rollback' | 'records'>('rollback');

  // 流水回退表单
  const [bizType, setBizType] = useState(BUSINESS_TYPES[0]);
  const [serialNos, setSerialNos] = useState('');
  const [rollbackNode, setRollbackNode] = useState(ROLLBACK_NODES[0]);

  const serialCount = serialNos.split('\n').map(s => s.trim()).filter(Boolean).length;

  const handleClear = () => {
    setBizType(BUSINESS_TYPES[0]);
    setSerialNos('');
    setRollbackNode(ROLLBACK_NODES[0]);
  };

  const handleConfirm = () => {
    if (serialCount === 0) return;
    alert(`确认回退\n业务类型：${bizType}\n回退节点：${rollbackNode}\n流水号（${serialCount}条）：\n${serialNos.trim()}`);
  };

  return (
    <div className="w-full mx-auto pb-24 px-4 pt-6">
      {/* Header + Tabs */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-6">
        <div className="px-6 pt-5">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
            流水回退
          </h1>
        </div>
        <div className="px-6 mt-4 flex gap-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('rollback')}
            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === 'rollback'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Undo2 className="w-4 h-4" />
            流水回退
            {activeTab === 'rollback' && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === 'records'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            回退记录
            {activeTab === 'records' && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'rollback' ? <RollbackForm
        bizType={bizType}
        setBizType={setBizType}
        serialNos={serialNos}
        setSerialNos={setSerialNos}
        rollbackNode={rollbackNode}
        setRollbackNode={setRollbackNode}
        serialCount={serialCount}
        onClear={handleClear}
        onConfirm={handleConfirm}
      /> : <RollbackRecords />}
    </div>
  );
}

// ============ Tab 1: 流水回退表单 ============
interface RollbackFormProps {
  bizType: string;
  setBizType: (v: string) => void;
  serialNos: string;
  setSerialNos: (v: string) => void;
  rollbackNode: string;
  setRollbackNode: (v: string) => void;
  serialCount: number;
  onClear: () => void;
  onConfirm: () => void;
}

function RollbackForm({
  bizType, setBizType, serialNos, setSerialNos,
  rollbackNode, setRollbackNode, serialCount, onClear, onConfirm,
}: RollbackFormProps) {
  return (
    <div>
      {/* 表单主体 */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            回退信息
          </h2>
          <Button
            variant="outline"
            onClick={onClear}
            className="rounded-sm text-slate-600 h-8 text-sm flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> 清空内容
          </Button>
        </div>

        <div className="p-6 space-y-5">
          {/* 业务类型 + 回退节点 并排 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                <span className="text-red-500 mr-1">*</span>业务类型
              </label>
              <div className="relative">
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                <span className="text-red-500 mr-1">*</span>回退节点
              </label>
              <div className="relative">
                <select
                  value={rollbackNode}
                  onChange={(e) => setRollbackNode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ROLLBACK_NODES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 流水号 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                <span className="text-red-500 mr-1">*</span>流水号
              </label>
              <span className="text-xs text-slate-400">已输入 <span className="font-semibold text-blue-600">{serialCount}</span> 条</span>
            </div>
            <textarea
              rows={10}
              value={serialNos}
              onChange={(e) => setSerialNos(e.target.value)}
              placeholder={'请输入回退的业务流水号，多个流水号用换行分割，例如：\n12345\n23456\n34567'}
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono leading-relaxed"
            />
          </div>

          {/* 警告提示 */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-700 leading-relaxed">
              流水只能回退到<span className="font-semibold">上游节点</span>，不能回退到当前节点和下游节点；<span className="font-semibold">办结状态</span>不能回退到办结状态。
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              onClick={onConfirm}
              disabled={serialCount === 0}
              className="rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-9 px-8 text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CornerUpLeft className="w-4 h-4" /> 确认回退
            </Button>
            <Button
              variant="outline"
              onClick={onClear}
              className="rounded-sm text-slate-600 h-9 px-6 text-sm"
            >
              重置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Tab 2: 回退记录 ============
function RollbackRecords() {
  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">回退业务</label>
            <div className="relative">
              <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                <option value="">全部</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">流水号</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">处理时间</label>
            <input type="date" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-slate-600" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">回退操作人</label>
            <input type="text" placeholder="请输入" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-slate-100">
          <Button className="px-6 rounded-sm bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm flex items-center gap-2">
            <Search className="w-3.5 h-3.5" /> 查询
          </Button>
          <Button variant="outline" className="px-6 rounded-sm text-slate-600 h-8 text-sm">重置</Button>
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        {/* Action Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3">
          <Button variant="outline" className="text-sm rounded-sm text-slate-700 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> 全部导出
          </Button>
          <div className="flex-1"></div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" /> 共 <span className="font-semibold text-slate-600">1443</span> 条回退记录
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="font-medium px-4 py-3">业务类型</th>
                <th className="font-medium px-4 py-3">流水号</th>
                <th className="font-medium px-4 py-3">回退状态</th>
                <th className="font-medium px-4 py-3">处理时间</th>
                <th className="font-medium px-4 py-3">流水经办人</th>
                <th className="font-medium px-4 py-3">流水复核人</th>
                <th className="font-medium px-4 py-3">回退操作人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECORDS.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-slate-800 font-medium">{r.bizType}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{r.serialNo}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[13px]">{r.processTime}</td>
                  <td className="px-4 py-3 text-slate-600">{r.operator}</td>
                  <td className="px-4 py-3 text-slate-600">{r.reviewer}</td>
                  <td className="px-4 py-3 text-slate-600">{r.rollbackBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>记录数：1443</span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 px-2 py-1 border border-slate-200 bg-white rounded-sm hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" /> 筛选
            </button>
            <span>每页 40 条</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm disabled:opacity-50" disabled>上一页</button>
              <button className="px-2 py-1 border border-slate-200 bg-blue-50 text-blue-600 rounded-sm font-medium">1</button>
              <span className="px-2 py-1 text-slate-400">/ 37</span>
              <button className="px-2 py-1 border border-slate-200 bg-white rounded-sm hover:bg-slate-50">下一页</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
