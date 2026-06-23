const fs = require('fs');
let code = fs.readFileSync('src/app/pages/Home.tsx', 'utf8');
code = code.replace(/\{\/\*[\s\S]*前往补充[^\n]*料[\s\S]*\*\/\}/g, `
            <Button className="rounded-sm bg-blue-600 text-white hover:bg-blue-700" onClick={() => {
              setPartMeetOpen(false);
              navigate('/submit-form');
            }}>
              前往补充材料
            </Button>
`);
code = code.replace(
  `<Button className="rounded-sm" onClick={() => {
              setPartMeetOpen(false);
              setSuccessOpen(true);
            }}>
              先提交已满足条件权限
            </Button>`,
  `<Button variant="outline" className="rounded-sm" onClick={() => {
              setPartMeetOpen(false);
              setSuccessOpen(true);
            }}>
              先提交已满足条件权限
            </Button>`
);
fs.writeFileSync('src/app/pages/Home.tsx', code);
