"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, ClipboardList, Truck, ArrowLeftRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
    color: "bg-chart-1",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "-5%",
    changeType: "positive" as const,
    icon: AlertTriangle,
    color: "bg-chart-5",
  },
  {
    title: "Pending Receipts",
    value: "18",
    change: "+3",
    changeType: "neutral" as const,
    icon: ClipboardList,
    color: "bg-chart-2",
  },
  {
    title: "Pending Deliveries",
    value: "7",
    change: "-2",
    changeType: "positive" as const,
    icon: Truck,
    color: "bg-chart-3",
  },
  {
    title: "Transfers Scheduled",
    value: "12",
    change: "+4",
    changeType: "neutral" as const,
    icon: ArrowLeftRight,
    color: "bg-chart-4",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening with your inventory today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-card" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs mt-1 ${
                stat.changeType === "positive" 
                  ? "text-accent" 
                  : stat.changeType === "negative" 
                    ? "text-destructive" 
                    : "text-muted-foreground"
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { supplier: "Acme Corp", product: "Widget A", qty: 500, date: "Today" },
                { supplier: "Tech Supply", product: "Circuit Board", qty: 200, date: "Yesterday" },
                { supplier: "Raw Materials Inc", product: "Steel Sheets", qty: 1000, date: "2 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.qty} units</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { customer: "RetailMax", product: "Widget B", qty: 150, date: "Tomorrow" },
                { customer: "BuildRight", product: "Fasteners", qty: 2000, date: "In 3 days" },
                { customer: "HomeStore", product: "Paint Supplies", qty: 50, date: "Next week" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{item.qty} units</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
