"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Employee = {
  _id: string
  nik: string
  nama: string
  jabatan: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

const DashboardPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Fetch data dari backend
  const fetchEmployees = async (keyword = "") => {
    try {
      setLoading(true)
      const res = await fetch(
        `http://localhost:5000/api/employees?search=${keyword}`
      )
      const data = await res.json()
      setEmployees(data.data || [])
    } catch (error) {
      console.error("Gagal ambil data:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Load pertama kali
  useEffect(() => {
    fetchEmployees()
  }, [])

  // ✅ Handle search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees(search)
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  return (
    <section
      id="home"
      className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

          {/* KIRI */}
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold">Employee Data Overview</h1>
            <p className="mb-3 text-sm text-muted-foreground">
              Kelola dan cari data karyawan dengan cepat
            </p>

            <div className="w-full md:w-72">
              <Input
                type="text"
                placeholder="Search employee..."
                className="w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* KANAN */}
          <div className="flex flex-wrap gap-2">
            <Button>Export CSV</Button>
            <Button variant="outline">Print PDF</Button>
            <Button variant="secondary">+ Add Employee</Button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <Table>
            <TableCaption>Daftar data karyawan</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp._id}>
                    <TableCell className="font-medium">{emp.nik}</TableCell>
                    <TableCell>{emp.nama}</TableCell>
                    <TableCell>{emp.jabatan}</TableCell>
                    <TableCell>
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(emp.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{emp.createdBy}</TableCell>
                    <TableCell>{emp.updatedBy}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-right">
                  {employees.length} Data
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

      </div>
    </section>
  )
}

export default DashboardPage
