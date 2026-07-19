import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeftRight, FileText, ShieldCheck, ChevronRight, Building2, CalendarDays } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/card';
import { ProcessRecord } from '../components/ProcessRecord';

const RULES = [
  '客户账户应当活跃，且移仓交易所交易编码处于正常状态',
  '客户账户应满足移仓合约的适当性限制要求',
  '客户账户保证金满足移仓业务客户风险控制要求，且移仓前一日结算后可用资金不为负',
  '若客户存在质押业务，客户账户在移仓后需满足质押配比的资金要求',
  '对于大商所、上期所实际控制关系组内的套保合约移入申请，客户需已获得相应套保资格或额度',
  '客户不存在被监管限制或其他异常情况',
];

const SUPPORTED_EXCHANGES = [
  {
    name: '郑州商品交易所',
    code: 'CZCE',
    desc: '同一客户在不同期货公司会员之间进行合约持仓及持仓保证金的转移',
  },
  {
    name: '大连商品交易所',
    code: 'DCE',
    desc: '同一客户跨会员转移；同一实控组内单位客户、非期货公司会员或境外特殊非经纪参与者的期货及期权持仓转移',
  },
  {
    name: '上海期货交易所',
    code: 'SHFE',
    desc: '同一实控组内，境外单位客户或境外特殊非经纪参与者向境内一般单位客户或非期货公司会员进行特定品种持仓转移',
  },
];

export function WarehouseHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = location.state?.status;
  const rejectReason = location.state?.rejectReason;

  return (
    <div className="w-full mx-auto space-y-6 pb-24 px-4">
      {/* Page Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            交易所移仓业务
          </h1>
          <p className="text-sm text-slate-500 mt-1">持仓跨期货公司或同一实控组账户间转移</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm px-6"
          onClick={() => navigate('/warehouse-apply')}
        >
          <FileText className="w-4 h-4 mr-2" />
          填写移仓申请表
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">我的移仓申请</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">办理中</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Supported Exchanges */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            已开通移仓业务的交易所
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUPPORTED_EXCHANGES.map((ex) => (
              <div key={ex.code} className="border border-slate-200 rounded-sm p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">{ex.name}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-sm"></span>
            客户申请办理条件
          </h2>
        </div>
        <div className="p-5">
          <ol className="space-y-3">
            {RULES.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process Record */}
      <ProcessRecord status={status} rejectReason={rejectReason} />

      {/* Action CTA */}
      <div className="flex justify-end">
        <Button 
          variant="outline"
          className="rounded-sm text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={() => navigate('/warehouse-list')}
        >
          查看我的申请列表
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
