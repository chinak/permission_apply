import React, { useState } from 'react';
import { useWarehouseContext, type PositionRow } from '../store/WarehouseContext';
import { Button } from './ui/Button';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { ACTUAL_CONTROL_ACCOUNT_DB } from '../pages/WarehouseApply';

const getName = (acc: string, ctx: ReturnType<typeof useWarehouseContext>) =>
  ctx.hasPermissionForAccount(acc) ? (ACTUAL_CONTROL_ACCOUNT_DB[acc] ?? '') : '';

type ScenarioKey = 'dce_in' | 'dce_out' | 'dce_actual_control' | 'czce_in' | 'shfe_out' | 'shfe_actual_control';

interface Scenario { label: string; fill: () => void; }

export function WarehouseConfigPanel() {
  const [collapsed, setCollapsed] = useState(true);
  const ctx = useWarehouseContext();

  const scenarios: Record<ScenarioKey, Scenario> = {
    dce_in: {
      label: 'DCE · 移入我司',
      fill: () => {
        ctx.setSelectedExchanges(['DCE']);
        ctx.setDirection('IN');
        ctx.setOutBrokerMemberId('0001');
        ctx.setOutBrokerName('中信期货有限公司');
        ctx.setOutClientTradingCodes({ DCE: '012345678', CZCE: '', SHFE: '' });
        ctx.setOutClientNames({ DCE: '张三科技有限公司', CZCE: '', SHFE: '' });
        ctx.setDceTransferByQuantity('YES');
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'DCE', varietyName: '螺纹钢', contractCode: 'rb2501', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 50, transferFunds: 1250000, remark: '' },
        ]);
        ctx.setConfirmed(true);
      },
    },
    dce_out: {
      label: 'DCE · 移出我司',
      fill: () => {
        ctx.setSelectedExchanges(['DCE']);
        ctx.setDirection('OUT');
        ctx.setInBrokerMemberId('0002');
        ctx.setInBrokerName('银河期货有限公司');
        ctx.setInClientTradingCodes({ DCE: '876543210', CZCE: '', SHFE: '' });
        ctx.setInClientName('李四贸易有限公司');
        ctx.setTransferReason('因业务调整需要转出持仓');
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'DCE', varietyName: '铁矿石', contractCode: 'i2501', positionDirection: 'SELL', hedgeType: 'SPEC', lots: 30, transferFunds: 900000, remark: '' },
        ]);
        ctx.setConfirmed(true);
      },
    },
    dce_actual_control: {
      label: 'DCE · 实控组移仓',
      fill: () => {
        ctx.setSelectedExchanges(['DCE']);
        ctx.setDirection('ACTUAL_CONTROL');
        ctx.setActualControlOutAccount('85171680');
        ctx.setActualControlOutName(getName('85171680', ctx));
        ctx.setActualControlInAccount('95281791');
        ctx.setActualControlInName(getName('95281791', ctx));
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'DCE', varietyName: '豆粕', contractCode: 'm2501', positionDirection: 'BUY', hedgeType: 'HEDGE', lots: 200, transferFunds: 3200000, remark: '套保持仓转移' },
        ]);
        ctx.setConfirmed(true);
      },
    },
    czce_in: {
      label: 'CZCE · 移入我司',
      fill: () => {
        ctx.setSelectedExchanges(['CZCE']);
        ctx.setDirection('IN');
        ctx.setOutBrokerMemberId('0001');
        ctx.setOutBrokerName('中信期货有限公司');
        ctx.setOutClientTradingCodes({ DCE: '', CZCE: '012345678', SHFE: '' });
        ctx.setOutClientNames({ DCE: '', CZCE: '张三科技有限公司', SHFE: '' });
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'CZCE', varietyName: '白糖', contractCode: 'SR501', positionDirection: 'ALL', hedgeType: '', lots: 100, transferFunds: 1500000, remark: '' },
        ]);
        ctx.setConfirmed(true);
      },
    },
    shfe_out: {
      label: 'SHFE · 移出我司',
      fill: () => {
        ctx.setSelectedExchanges(['SHFE']);
        ctx.setDirection('OUT');
        ctx.setInBrokerMemberId('0003');
        ctx.setInBrokerName('南华期货股份有限公司');
        ctx.setInClientTradingCodes({ DCE: '', CZCE: '', SHFE: '567890123' });
        ctx.setInClientName('王五实业有限公司');
        ctx.setTransferReason('实控关系组内账户持仓调整');
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'BUY', hedgeType: 'SPEC', lots: 20, transferFunds: 2000000, remark: '' },
        ]);
        ctx.setConfirmed(true);
      },
    },
    shfe_actual_control: {
      label: 'SHFE · 实控组移仓',
      fill: () => {
        ctx.setSelectedExchanges(['SHFE']);
        ctx.setDirection('ACTUAL_CONTROL');
        ctx.setActualControlOutAccount('85171680');
        ctx.setActualControlOutName(getName('85171680', ctx));
        ctx.setActualControlInAccount('95281792');
        ctx.setActualControlInName(getName('95281792', ctx));
        ctx.setPositions([
          { id: 'pos_sc_1', exchange: 'SHFE', varietyName: '铜', contractCode: 'cu2408', positionDirection: 'BUY', hedgeType: 'HEDGE', lots: 15, transferFunds: 1500000, remark: '上期所实控组移仓' },
        ]);
        ctx.setConfirmed(true);
      },
    },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-slate-200 text-xs w-64 transition-all">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-t-lg border-b border-slate-100 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          移仓场景面板
        </span>
        {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div className="p-3 space-y-2">
          <p className="text-slate-400 mb-1">点击场景一键填充表单：</p>
          {Object.entries(scenarios).map(([key, scenario]) => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs h-8 rounded-sm"
              onClick={scenario.fill}
            >
              {scenario.label}
            </Button>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-100">
            <p className="text-slate-500 font-medium mb-2">实控组测试账号：</p>
            <p className="text-slate-400 mb-2 text-[11px]">点击开关切换权限，点击「出」「入」填入表单</p>
            <div className="space-y-1.5">
              {Object.entries(ACTUAL_CONTROL_ACCOUNT_DB).map(([acc, name]) => {
                const hasPerm = ctx.accountPermissions[acc];
                return (
                  <div key={acc} className="flex items-center gap-1.5 rounded px-1.5 py-1 hover:bg-slate-50 group">
                    {/* 权限开关 */}
                    <button
                      type="button"
                      onClick={() => ctx.toggleAccountPermission(acc)}
                      className={`relative flex-shrink-0 w-6 h-3.5 rounded-full transition-colors ${hasPerm ? 'bg-green-500' : 'bg-slate-300'}`}
                      title={hasPerm ? '有权限，点击关闭' : '无权限，点击开启'}
                    >
                      <span
                        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow transition-transform ${hasPerm ? 'left-3' : 'left-0.5'}`}
                      />
                    </button>
                    {/* 账号 + 名称 */}
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-slate-700 text-[11px]">{acc}</span>
                      <span className="text-slate-300 mx-0.5">·</span>
                      <span className={`text-[11px] ${hasPerm ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                        {name}
                      </span>
                    </div>
                    {/* 填入按钮 */}
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          ctx.setDirection('ACTUAL_CONTROL');
                          ctx.setActualControlOutAccount(acc);
                          ctx.setActualControlOutName(hasPerm ? name : '');
                        }}
                        className="px-1 py-0.5 text-[10px] font-medium rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                        title="填入为【移出】账号"
                      >
                        出
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          ctx.setDirection('ACTUAL_CONTROL');
                          ctx.setActualControlInAccount(acc);
                          ctx.setActualControlInName(hasPerm ? name : '');
                        }}
                        className="px-1 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        title="填入为【移入】账号"
                      >
                        入
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
