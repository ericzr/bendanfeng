import { useState } from "react";
import {
  User,
  Bell,
  Key,
  Shield,
  CreditCard,
  Palette,
  Copy,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

export function SettingsView() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>设置</h2>
        <p className="text-neutral-500 text-sm mt-1">管理您的账户、通知和系统偏好</p>
      </div>

      <Tabs defaultValue="profile" className="flex-1">
        {/* Mobile tabs - horizontal scrollable */}
        <div className="md:hidden border-b border-white/10 px-4 py-2 overflow-x-auto">
          <TabsList className="bg-white/5 border border-white/10 rounded-lg p-1 inline-flex gap-0 w-auto h-auto">
            {[
              { key: "profile", label: "账户信息", icon: <User className="h-3.5 w-3.5" /> },
              { key: "notifications", label: "通知", icon: <Bell className="h-3.5 w-3.5" /> },
              { key: "api", label: "API", icon: <Key className="h-3.5 w-3.5" /> },
              { key: "security", label: "安全", icon: <Shield className="h-3.5 w-3.5" /> },
              { key: "billing", label: "计费", icon: <CreditCard className="h-3.5 w-3.5" /> },
              { key: "appearance", label: "外观", icon: <Palette className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="gap-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:text-black bg-transparent text-neutral-500 px-3 py-1.5 text-xs whitespace-nowrap border-0 data-[state=active]:border-0"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex">
          {/* Settings sidebar - desktop only */}
          <div className="hidden md:block w-52 border-r border-white/10 p-4 shrink-0">
            <TabsList className="flex-col bg-transparent h-auto p-0 gap-1 w-full">
              {[
                { key: "profile", label: "账户信息", icon: <User className="h-4 w-4" /> },
                { key: "notifications", label: "通知设置", icon: <Bell className="h-4 w-4" /> },
                { key: "api", label: "API 密钥", icon: <Key className="h-4 w-4" /> },
                { key: "security", label: "安全设置", icon: <Shield className="h-4 w-4" /> },
                { key: "billing", label: "订阅与计费", icon: <CreditCard className="h-4 w-4" /> },
                { key: "appearance", label: "外观设置", icon: <Palette className="h-4 w-4" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="w-full justify-start gap-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white bg-transparent text-neutral-500 hover:text-neutral-300 px-3 py-2 border-0 data-[state=active]:border-0"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-w-2xl">
            <TabsContent value="profile">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>账户信息</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>A</div>
                      <button className="text-neutral-400 text-sm hover:text-white transition-colors">更换头像</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 text-sm block mb-2">姓名</label>
                        <Input defaultValue="Admin" className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                      </div>
                      <div>
                        <label className="text-neutral-400 text-sm block mb-2">公司名称</label>
                        <Input defaultValue="笨蛋蜂 Inc." className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                      </div>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">邮箱</label>
                      <Input type="email" defaultValue="admin@bendanfeng.ai" className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">时区</label>
                      <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none text-sm appearance-none">
                        <option>Asia/Shanghai (UTC+8)</option>
                        <option>Asia/Tokyo (UTC+9)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">保存更改</Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>通知偏好</h3>
                    {[
                      { label: "任务完成通知", desc: "AI员工完成任务时发送通知", defaultOn: true },
                      { label: "错误警报", desc: "AI员工执行异常时立即通知", defaultOn: true },
                      { label: "日报摘要", desc: "每天发送任务执行摘要", defaultOn: true },
                      { label: "周报", desc: "每周发送团队运营周报", defaultOn: false },
                      { label: "产品更新", desc: "接收新功能和更新通知", defaultOn: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <div>
                          <span className="text-neutral-300 text-sm">{item.label}</span>
                          <p className="text-neutral-600 text-xs mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.defaultOn} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>通知渠道</h3>
                    {[
                      { label: "邮件通知", desc: "admin@bendanfeng.ai", defaultOn: true },
                      { label: "浏览器推送", desc: "桌面通知提醒", defaultOn: true },
                      { label: "Webhook", desc: "推送至自定义 URL", defaultOn: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <div>
                          <span className="text-neutral-300 text-sm">{item.label}</span>
                          <p className="text-neutral-600 text-xs mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.defaultOn} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">保存设置</Button>
              </div>
            </TabsContent>

            <TabsContent value="api">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>API 密钥</h3>
                    <p className="text-neutral-500 text-sm">使用 API 密钥通过编程方式与笨蛋蜂集成</p>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">Live Key</label>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
                          <span className="text-neutral-300 flex-1">
                            {showApiKey ? "sk-live-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" : "sk-live-••••••••••••••••••••••••"}
                          </span>
                          <button onClick={() => setShowApiKey(!showApiKey)} className="text-neutral-500 hover:text-neutral-300 ml-2 transition-colors">
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <Button variant="outline" size="icon" onClick={handleCopy} className="border-white/10 text-neutral-400 hover:text-white bg-transparent">
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">Test Key</label>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
                          <span className="text-neutral-300">sk-test-••••••••••••••••••••••••</span>
                        </div>
                        <Button variant="outline" size="icon" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>Webhook 配置</h3>
                    <p className="text-neutral-500 text-sm">配置 Webhook URL，接收实时任务状态回调</p>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">Webhook URL</label>
                      <Input placeholder="https://your-domain.com/webhook" className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20" />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">事件类型</label>
                      <div className="flex flex-wrap gap-2">
                        {["task.completed", "task.failed", "agent.error", "agent.status"].map((e) => (
                          <label key={e} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                            <input type="checkbox" defaultChecked className="accent-white" />
                            <span className="text-neutral-400 text-xs font-mono">{e}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>API 使用量</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "本月调用", value: "12,847" },
                        { label: "额度剩余", value: "无限" },
                        { label: "平均延迟", value: "142ms" },
                      ].map((s) => (
                        <div key={s.label} className="p-3 rounded-lg bg-white/5 text-center">
                          <div className="text-white" style={{ fontWeight: 600 }}>{s.value}</div>
                          <div className="text-neutral-600 text-xs mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">保存配置</Button>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>修改密码</h3>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">当前密码</label>
                      <Input type="password" className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">新密码</label>
                      <Input type="password" className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-sm block mb-2">确认新密码</label>
                      <Input type="password" className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20" />
                    </div>
                    <Button className="bg-white text-black hover:bg-neutral-200">更新密码</Button>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>两步验证</h3>
                    <p className="text-neutral-500 text-sm">开启两步验证以增强账户安全</p>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-white" />
                        <div>
                          <span className="text-neutral-300 text-sm">身份验证器 App</span>
                          <p className="text-neutral-600 text-xs">使用 Google Authenticator 或类似应用</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">启用</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>登录记录</h3>
                    <div className="space-y-2">
                      {[
                        { device: "Chrome · macOS", ip: "192.168.1.xxx", time: "刚刚", current: true },
                        { device: "Safari · iPhone", ip: "10.0.0.xxx", time: "2小时前", current: false },
                        { device: "Chrome · Windows", ip: "172.16.0.xxx", time: "昨天 14:30", current: false },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-300 text-sm">{session.device}</span>
                              {session.current && <Badge variant="outline" className="text-green-400 border-green-500/20 bg-green-500/10">当前</Badge>}
                            </div>
                            <span className="text-neutral-600 text-xs">{session.ip} · {session.time}</span>
                          </div>
                          {!session.current && (
                            <button className="text-neutral-600 text-xs hover:text-red-400 transition-colors">撤销</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-2 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-neutral-400 text-xs" style={{ fontWeight: 600 }}>当前方案</span>
                        <h3 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>Pro</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>¥2,999</span>
                        <span className="text-neutral-500">/月</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-white text-black hover:bg-neutral-200">升级 Enterprise</Button>
                      <Button variant="outline" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">管理订阅</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>用量统计</h3>
                    <p className="text-neutral-500 text-sm">当前计费周期 (3月1日 - 3月31日)</p>
                    {[
                      { label: "AI 员工", used: 5, total: 10 },
                      { label: "任务执行", used: 847, total: null },
                      { label: "API 调用", used: 12847, total: null },
                    ].map((u) => (
                      <div key={u.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">{u.label}</span>
                          <span className="text-neutral-300">{u.used.toLocaleString()} / {u.total ? u.total.toLocaleString() : "无限"}</span>
                        </div>
                        {u.total && (
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${(u.used / u.total) * 100}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-white mb-2" style={{ fontWeight: 600 }}>账单历史</h3>
                    {[
                      { date: "2026-03-01", amount: "¥2,999", status: "已支付" },
                      { date: "2026-02-01", amount: "¥2,999", status: "已支付" },
                      { date: "2026-01-01", amount: "¥999", status: "已支付" },
                    ].map((bill) => (
                      <div key={bill.date} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-4">
                          <span className="text-neutral-400 text-sm">{bill.date}</span>
                          <span className="text-white text-sm" style={{ fontWeight: 500 }}>{bill.amount}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-400 text-xs">{bill.status}</span>
                          <button className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors">下载发票</button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <div className="space-y-6">
                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>主题</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "深色", active: true, preview: "bg-black" },
                        { label: "浅色", active: false, preview: "bg-white" },
                        { label: "跟随系统", active: false, preview: "bg-gradient-to-r from-black to-white" },
                      ].map((theme) => (
                        <button
                          key={theme.label}
                          className={`p-3 rounded-xl border transition-colors ${
                            theme.active ? "border-white bg-white/5" : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className={`w-full h-16 rounded-lg ${theme.preview} border border-white/10 mb-2`} />
                          <span className={`text-sm ${theme.active ? "text-white" : "text-neutral-500"}`}>
                            {theme.label}
                            {theme.active && <Check className="h-3.5 w-3.5 inline ml-1" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>语言</h3>
                    <select className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none text-sm appearance-none">
                      <option>简体中文</option>
                      <option>English</option>
                      <option>日本語</option>
                    </select>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-950 border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-white" style={{ fontWeight: 600 }}>密度</h3>
                    <div className="flex gap-3">
                      {[
                        { label: "紧凑", active: false },
                        { label: "默认", active: true },
                        { label: "宽松", active: false },
                      ].map((d) => (
                        <button
                          key={d.label}
                          className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                            d.active ? "border-white bg-white/10 text-white" : "border-white/10 text-neutral-500 hover:text-neutral-300"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">保存设置</Button>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}