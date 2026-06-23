const fs = require('fs');
const content = fs.readFileSync('src/app/pages/Home.tsx', 'utf8');
const newContent = content.replace(
  /<div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">[\s\S]*?前往补充材料[\s\S]*?<\/div>/m,
  \`<div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button variant="outline" className="rounded-sm" onClick={() => setPartMeetOpen(false)}>
              返回修改
            </Button>
            <Button className="rounded-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              setPartMeetOpen(false);
              setSuccessOpen(true);
            }}>
              先提交已满足条件权限
            </Button>
          </div>\`
);
fs.writeFileSync('src/app/pages/Home.tsx', newContent);