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

const API_URL = "http://localhost:5000/api/employees"

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

  // ================= ADD =================
  const handleAdd = async () => {
    const nik = prompt("Masukkan NIK:")
    const nama = prompt("Masukkan Nama:")
    const jabatan = prompt("Masukkan Jabatan:")
    const gaji = prompt("Masukkan Gaji:")

    if (!nik || !nama || !jabatan) return alert("Data wajib diisi!")

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nik,
          nama,
          jabatan,
          gaji: Number(gaji) || 0,
        }),
      })

      alert("✅ Data berhasil ditambahkan")
      fetchEmployees()
    } catch (err) {
      alert("❌ Gagal menambah data")
    }
  }

  // ================= EDIT =================
  const handleEdit = async (emp: Employee) => {
    const nama = prompt("Edit Nama:", emp.nama)
    const jabatan = prompt("Edit Jabatan:", emp.jabatan)

    if (!nama || !jabatan) return

    try {
      await fetch(`${API_URL}/${emp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          jabatan,
          updatedBy: "admin",
        }),
      })

      alert("✅ Data berhasil diupdate")
      fetchEmployees()
    } catch (err) {
      alert("❌ Gagal update data")
    }
  }

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus data ini?")
    if (!confirmDelete) return

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      alert("✅ Data berhasil dihapus")
      fetchEmployees()
    } catch (err) {
      alert("❌ Gagal menghapus data")
    }
  }

  // ================= PRINT BY ID =================
const handlePrintById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/${id}`)
    const emp = await res.json()

    const printWindow = window.open("", "_blank", "width=800,height=600")

    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Data Karyawan</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            td { border: 1px solid black; padding: 10px; }
            .label { font-weight: bold; width: 35%; }
            .ttd { margin-top: 60px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Detail Data Karyawan</h1>

          <table>
            <tr><td class="label">ID</td><td>${emp._id}</td></tr>
            <tr><td class="label">NIK</td><td>${emp.nik}</td></tr>
            <tr><td class="label">Nama</td><td>${emp.nama}</td></tr>
            <tr><td class="label">Jabatan</td><td>${emp.jabatan}</td></tr>
            <tr><td class="label">Gaji</td><td>${emp.gaji}</td></tr>
            <tr><td class="label">Created At</td><td>${new Date(emp.createdAt).toLocaleString()}</td></tr>
            <tr><td class="label">Updated At</td><td>${new Date(emp.updatedAt).toLocaleString()}</td></tr>
            <tr><td class="label">Created By</td><td>${emp.createdBy}</td></tr>
            <tr><td class="label">Updated By</td><td>${emp.updatedBy}</td></tr>
          </table>

          <div class="ttd">
            <p>_______________________</p>
            <p>Tanda Tangan</p>
          </div>

          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  } catch (error) {
    alert("❌ Gagal print data")
    console.error(error)
  }
}


  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">

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

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleAdd}>
              Print
            </Button>
            <Button variant="secondary" onClick={handleAdd}>
              + Add Employee
            </Button>
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
  <Button
    size="sm"
    variant="outline"
    onClick={() => handleEdit(emp)}
  >
    Edit
  </Button>

  <Button
    size="sm"
    variant="destructive"
    onClick={() => handleDelete(emp._id)}
  >
    Delete
  </Button>

  <Button
    size="sm"
    variant="secondary"
    onClick={() => handlePrintById(emp._id)}
  >
    Print
  </Button>
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
