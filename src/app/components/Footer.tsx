import logoImg from "@/assets/9029735ff07ec438509bff8d0513e653f98f5671.png";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="笨蛋蜂" className="h-7 invert" />
            </div>
            <p className="text-neutral-500 text-sm">
              一键部署 AI 员工团队
              <br />
              让企业 24 小时自动运转
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>产品</h4>
            <ul className="space-y-2 text-neutral-500 text-sm">
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">员工/团队库</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">团队方案</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">定价</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">API 文档</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>公司</h4>
            <ul className="space-y-2 text-neutral-500 text-sm">
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">关于我们</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">博客</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">联系我们</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">加入我们</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>支持</h4>
            <ul className="space-y-2 text-neutral-500 text-sm">
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">帮助中心</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">隐私政策</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">服务条款</li>
              <li className="hover:text-neutral-300 cursor-pointer transition-colors">安全合规</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-neutral-600 text-sm">
          © 2026 笨蛋蜂. All rights reserved.
        </div>
      </div>
    </footer>
  );
}