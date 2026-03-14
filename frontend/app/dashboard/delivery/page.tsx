"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Truck, Plus, Check } from "lucide-react"

interface Delivery {
  id: string
  customer: string
  product: string
  quantity: number
  date: string
  status: "scheduled" | "in-transit" | "delivered"
}

const customers = ["RetailMax", "BuildRight", "HomeStore", "MegaMart", "QuickShop", "Industrial Co"]
const products = ["Widget A", "Widget B", "Circuit Board", "Steel Sheet", "Fastener Pack", "Paint Can"]

const initialDeliveries: Delivery[] = [
  { id: "1", customer: "RetailMax", product: "Widget B", quantity: 150, date: "2026-03-15", status: "scheduled" },
  { id: "2", customer: "BuildRight", product: "Fastener Pack", quantity: 2000, date: "2026-03-16", status: "scheduled" },
  { id: "3", customer: "HomeStore", product: "Paint Can", quantity: 50, date: "2026-03-14", status: "in-transit" },
  { id: "4", customer: "MegaMart", product: "Widget A", quantity: 300, date: "2026-03-12", status: "delivered" },
]

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries)
  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: "",
    date: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      customer: formData.customer,
      product: formData.product,
      quantity: Number(formData.quantity),
      date: formData.date,
      status: "scheduled",
    }

    setDeliveries([newDelivery, ...deliveries])
    setFormData({ customer: "", product: "", quantity: "", date: "" })
    setIsSubmitting(false)
  }

  const updateStatus = (id: string, newStatus: Delivery["status"]) => {
    setDeliveries(deliveries.map((d) => (d.id === id ? { ...d, status: newStatus } : d)))
  }

  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-chart-2/10 text-chart-2"
      case "in-transit":
        return "bg-chart-3/10 text-chart-3"
      case "delivered":
        return "bg-accent/10 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Delivery</h1>
        <p className="text-muted-foreground mt-1">Manage outgoing deliveries to customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Delivery
            </CardTitle>
            <CardDescription>Schedule a new delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="customer">Customer</FieldLabel>
                  <Select
                    value={formData.customer}
                    onValueChange={(value) => setFormData({ ...formData, customer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="product">Product</FieldLabel>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => setFormData({ ...formData, product: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="date">Delivery Date</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.customer || !formData.product || !formData.quantity || !formData.date || isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Delivery"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Deliveries List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.customer}</TableCell>
                      <TableCell>{delivery.product}</TableCell>
                      <TableCell>{delivery.quantity} units</TableCell>
                      <TableCell>{new Date(delivery.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace("-", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {delivery.status === "scheduled" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(delivery.id, "in-transit")}>
                            Ship
                          </Button>
                        )}
                        {delivery.status === "in-transit" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(delivery.id, "delivered")}>
                            <Check className="w-4 h-4 mr-1" />
                            Delivered
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
