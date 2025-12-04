"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts"

type Employee = {
  _id: string
  nik: string
  nama: string
  jabatan: string
  gaji?: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

const API_URL = "http://localhost:5000/api/employees"

// Warna biru shadcn yang konsisten
const BLUE_COLORS = [
  "hsl(221.2 83.2% 53.3%)", // blue-500
  "hsl(217.2 91.2% 59.8%)", // blue-400
  "hsl(213.9 93.9% 67.8%)", // blue-300
  "hsl(210 100% 78%)",      // blue-200
  "hsl(214.3 100% 85.1%)",  // blue-100
]

const DashboardPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // ================= FETCH =================
  const fetchEmployees = async (keyword = "") => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}?search=${keyword}`)
      const data = await res.json()
      setEmployees(data.data || [])
    } catch (error) {
      console.error("Gagal ambil data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees(search)
    }, 400)
    return () => clearTimeout(delay)
  }, [search])

  // ================= DATA UNTUK PIE CHART =================
  const pieData = useMemo(() => {
    const map = new Map<string, number>()

    employees.forEach((emp) => {
      map.set(emp.jabatan, (map.get(emp.jabatan) || 0) + 1)
    })

    return Array.from(map.entries()).map(([jabatan, total]) => ({
      name: jabatan,
      value: total,
    }))
  }, [employees])

  // Total karyawan
  const totalEmployees = employees.length

  return (
    <section className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-bold tracking-tight">Employee Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Komposisi karyawan berdasarkan jabatan
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/add-employee">
              + Add Employee
            </Link>
          </Button>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="w-full sm:w-80">
          <Input
            type="text"
            placeholder="Cari Jabatan..."
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Karyawan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jabatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pieData.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* ================= PIE CHART ================= */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Distribusi Karyawan per Jabatan</CardTitle>
            <CardDescription>
              Visualisasi jumlah karyawan untuk setiap posisi jabatan
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Memuat data chart...
                </p>
              </div>
            ) : pieData.length === 0 ? (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Belum ada data karyawan.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={{
                  value: {
                    label: "Jumlah Karyawan",
                  },
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'transparent' }}
                    />

                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{
                        paddingTop: "20px"
                      }}
                    />

                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={true}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={BLUE_COLORS[index % BLUE_COLORS.length]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

      </div>
    </section>
  )
}

export default DashboardPage