"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Settings, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Adjustment {
  id: string
  product: string
  location: string
  previousQty: number
  actualQty: number
  difference: number
  reason: string
  date: string
}

const locations = ["Warehouse A", "Warehouse B", "Warehouse C", "Store Front", "Distribution Center"]
const products = [
  { name: "Widget A", stock: { "Warehouse A": 150, "Warehouse B": 45, "Store Front": 30 } },
  { name: "Widget B", stock: { "Warehouse A": 80, "Warehouse C": 120 } },
  { name: "Circuit Board", stock: { "Warehouse B": 45, "Distribution Center": 200 } },
  { name: "Steel Sheet", stock: { "Warehouse A": 200 } },
  { name: "Fastener Pack", stock: { "Warehouse C": 500, "Store Front": 150 } },
  { name: "Paint Can", stock: { "Warehouse B": 75, "Store Front": 25 } },
]

const initialAdjustments: Adjustment[] = [
  { id: "1", product: "Widget A", location: "Warehouse A", previousQty: 155, actualQty: 150, difference: -5, reason: "Damaged items removed", date: "2026-03-14" },
  { id: "2", product: "Circuit Board", location: "Warehouse B", previousQty: 40, actualQty: 45, difference: 5, reason: "Found unreported stock", date: "2026-03-13" },
  { id: "3", product: "Fastener Pack", location: "Store Front", previousQty: 160, actualQty: 150, difference: -10, reason: "Inventory count correction", date: "2026-03-12" },
]

export default function InventoryPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>(initialAdjustments)
  const [formData, setFormData] = useState({
    product: "",
    location: "",
    actualQty: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProductStock = formData.product && formData.location
    ? products.find((p) => p.name === formData.product)?.stock[formData.location as keyof typeof products[0]["stock"]] || 0
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const actualQty = Number(formData.actualQty)
    const newAdjustment: Adjustment = {
      id: Date.now().toString(),
      product: formData.product,
      location: formData.location,
      previousQty: selectedProductStock,
      actualQty: actualQty,
      difference: actualQty - selectedProductStock,
      reason: formData.reason,
      date: new Date().toISOString().split("T")[0],
    }

    setAdjustments([newAdjustment, ...adjustments])
    setFormData({ product: "", location: "", actualQty: "", reason: "" })
    setIsSubmitting(false)
  }

  const getDifferenceIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-accent" />
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-destructive" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getDifferenceColor = (diff: number) => {
    if (diff > 0) return "text-accent"
    if (diff < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  const availableLocations = formData.product
    ? Object.keys(products.find((p) => p.name === formData.product)?.stock || {})
    : locations

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Inventory Adjustment</h1>
        <p className="text-muted-foreground mt-1">Correct stock levels based on physical counts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Adjustment
            </CardTitle>
            <CardDescription>Record inventory discrepancies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="product">Product</FieldLabel>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => setFormData({ ...formData, product: value, location: "", actualQty: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    disabled={!formData.product}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                {formData.product && formData.location && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Current System Stock</p>
                    <p className="text-lg font-bold text-foreground">{selectedProductStock} units</p>
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="actualQty">Actual Quantity (Physical Count)</FieldLabel>
                  <Input
                    id="actualQty"
                    type="number"
                    min="0"
                    placeholder="Enter actual count"
                    value={formData.actualQty}
                    onChange={(e) => setFormData({ ...formData, actualQty: e.target.value })}
                    required
                  />
                </Field>

                {formData.actualQty && formData.location && (
                  <div className={`p-3 rounded-lg ${Number(formData.actualQty) !== selectedProductStock ? "bg-chart-5/10" : "bg-accent/10"}`}>
                    <p className="text-sm text-muted-foreground">Difference</p>
                    <p className={`text-lg font-bold ${getDifferenceColor(Number(formData.actualQty) - selectedProductStock)}`}>
                      {Number(formData.actualQty) - selectedProductStock > 0 ? "+" : ""}
                      {Number(formData.actualQty) - selectedProductStock} units
                    </p>
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="reason">Reason for Adjustment</FieldLabel>
                  <Textarea
                    id="reason"
                    placeholder="Explain the reason for this adjustment..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    required
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full"
                disabled={!formData.product || !formData.location || !formData.actualQty || !formData.reason || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Adjustment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Adjustments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Adjustment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                      <TableCell className="font-medium">{adjustment.product}</TableCell>
                      <TableCell>{adjustment.location}</TableCell>
                      <TableCell>{adjustment.previousQty}</TableCell>
                      <TableCell>{adjustment.actualQty}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getDifferenceIcon(adjustment.difference)}
                          <span className={getDifferenceColor(adjustment.difference)}>
                            {adjustment.difference > 0 ? "+" : ""}
                            {adjustment.difference}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={adjustment.reason}>
                        {adjustment.reason}
                      </TableCell>
                      <TableCell>{new Date(adjustment.date).toLocaleDateString()}</TableCell>
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
