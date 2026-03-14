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
import { ClipboardList, Plus, Check } from "lucide-react"

interface Receipt {
  id: string
  supplier: string
  product: string
  quantity: number
  date: string
  status: "pending" | "received"
}

const suppliers = ["Acme Corp", "Tech Supply", "Raw Materials Inc", "Global Parts", "FastShip Logistics"]
const products = ["Widget A", "Widget B", "Circuit Board", "Steel Sheet", "Fastener Pack", "Paint Can"]

const initialReceipts: Receipt[] = [
  { id: "1", supplier: "Acme Corp", product: "Widget A", quantity: 500, date: "2026-03-14", status: "received" },
  { id: "2", supplier: "Tech Supply", product: "Circuit Board", quantity: 200, date: "2026-03-13", status: "received" },
  { id: "3", supplier: "Global Parts", product: "Widget B", quantity: 150, date: "2026-03-15", status: "pending" },
]

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [formData, setFormData] = useState({
    supplier: "",
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

    const newReceipt: Receipt = {
      id: Date.now().toString(),
      supplier: formData.supplier,
      product: formData.product,
      quantity: Number(formData.quantity),
      date: formData.date,
      status: "pending",
    }

    setReceipts([newReceipt, ...receipts])
    setFormData({ supplier: "", product: "", quantity: "", date: "" })
    setIsSubmitting(false)
  }

  const markAsReceived = (id: string) => {
    setReceipts(receipts.map((r) => (r.id === id ? { ...r, status: "received" } : r)))
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Receipts</h1>
        <p className="text-muted-foreground mt-1">Record incoming inventory from suppliers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Receipt
            </CardTitle>
            <CardDescription>Enter receipt details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="supplier">Supplier</FieldLabel>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
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
                  <FieldLabel htmlFor="date">Date</FieldLabel>
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
                disabled={!formData.supplier || !formData.product || !formData.quantity || !formData.date || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Receipt"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Receipts List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Receipt History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.supplier}</TableCell>
                      <TableCell>{receipt.product}</TableCell>
                      <TableCell>{receipt.quantity} units</TableCell>
                      <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            receipt.status === "received"
                              ? "bg-accent/10 text-accent"
                              : "bg-chart-3/10 text-chart-3"
                          }`}
                        >
                          {receipt.status === "received" ? "Received" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {receipt.status === "pending" && (
                          <Button variant="outline" size="sm" onClick={() => markAsReceived(receipt.id)}>
                            <Check className="w-4 h-4 mr-1" />
                            Mark Received
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
