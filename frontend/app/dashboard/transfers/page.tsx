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
import { ArrowLeftRight, Plus, ArrowRight, Check } from "lucide-react"

interface Transfer {
  id: string
  fromLocation: string
  toLocation: string
  product: string
  quantity: number
  date: string
  status: "scheduled" | "in-progress" | "completed"
}

const locations = ["Warehouse A", "Warehouse B", "Warehouse C", "Store Front", "Distribution Center"]
const products = ["Widget A", "Widget B", "Circuit Board", "Steel Sheet", "Fastener Pack", "Paint Can"]

const initialTransfers: Transfer[] = [
  { id: "1", fromLocation: "Warehouse A", toLocation: "Store Front", product: "Widget A", quantity: 50, date: "2026-03-15", status: "scheduled" },
  { id: "2", fromLocation: "Warehouse B", toLocation: "Warehouse C", product: "Circuit Board", quantity: 100, date: "2026-03-14", status: "in-progress" },
  { id: "3", fromLocation: "Distribution Center", toLocation: "Warehouse A", product: "Steel Sheet", quantity: 200, date: "2026-03-13", status: "completed" },
]

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers)
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    product: "",
    quantity: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.fromLocation === formData.toLocation) {
      alert("From and To locations must be different")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newTransfer: Transfer = {
      id: Date.now().toString(),
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      product: formData.product,
      quantity: Number(formData.quantity),
      date: new Date().toISOString().split("T")[0],
      status: "scheduled",
    }

    setTransfers([newTransfer, ...transfers])
    setFormData({ fromLocation: "", toLocation: "", product: "", quantity: "" })
    setIsSubmitting(false)
  }

  const updateStatus = (id: string, newStatus: Transfer["status"]) => {
    setTransfers(transfers.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  const getStatusColor = (status: Transfer["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-chart-2/10 text-chart-2"
      case "in-progress":
        return "bg-chart-3/10 text-chart-3"
      case "completed":
        return "bg-accent/10 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Transfers</h1>
        <p className="text-muted-foreground mt-1">Move inventory between locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Transfer
            </CardTitle>
            <CardDescription>Schedule an inventory transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fromLocation">From Location</FieldLabel>
                  <Select
                    value={formData.fromLocation}
                    onValueChange={(value) => setFormData({ ...formData, fromLocation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="toLocation">To Location</FieldLabel>
                  <Select
                    value={formData.toLocation}
                    onValueChange={(value) => setFormData({ ...formData, toLocation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.filter((loc) => loc !== formData.fromLocation).map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
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
              </FieldGroup>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.fromLocation || !formData.toLocation || !formData.product || !formData.quantity || isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Transfer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transfers List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Transfer History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transfer.fromLocation}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{transfer.toLocation}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.product}</TableCell>
                      <TableCell>{transfer.quantity} units</TableCell>
                      <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transfer.status)}`}>
                          {transfer.status.replace("-", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {transfer.status === "scheduled" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(transfer.id, "in-progress")}>
                            Start
                          </Button>
                        )}
                        {transfer.status === "in-progress" && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(transfer.id, "completed")}>
                            <Check className="w-4 h-4 mr-1" />
                            Complete
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
