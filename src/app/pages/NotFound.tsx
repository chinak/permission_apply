import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">页面不存在 (404)</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        抱歉，您访问的页面不存在或已被移除。请检查链接是否正确。
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        返回工作台
      </Link>
    </div>
  );
}
