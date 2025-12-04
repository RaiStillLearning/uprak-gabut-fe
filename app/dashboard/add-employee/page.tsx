"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const API_URL = "https://uprak-gabut-be.vercel.app/api/employees";

const AddEmployeePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jabatan: "",
    gaji: "",
  });
  const [showCustomJabatan, setShowCustomJabatan] = useState(false);
  const [customJabatan, setCustomJabatan] = useState("");
  const [gajiDisplay, setGajiDisplay] = useState(""); // ← TAMBAH: untuk display formatted

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJabatanChange = (value: string) => {
    if (value === "Other") {
      setShowCustomJabatan(true);
      setForm({ ...form, jabatan: "" });
    } else {
      setShowCustomJabatan(false);
      setCustomJabatan("");
      setForm({ ...form, jabatan: value });
    }
  };

  const handleCustomJabatanChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomJabatan(value);
    setForm({ ...form, jabatan: value });
  };

  // ✅ TAMBAH FUNCTION INI: Format input gaji dengan pemisah ribuan
  const handleGajiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, "");

    // Update state dengan nilai numerik asli (untuk dikirim ke backend)
    setForm({ ...form, gaji: numericValue });

    // Format untuk display dengan pemisah ribuan
    if (numericValue === "") {
      setGajiDisplay("");
    } else {
      const formatted = Number(numericValue).toLocaleString("id-ID");
      setGajiDisplay(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.nik || !form.nama || !form.jabatan) {
      alert("❌ NIK, Nama, dan Jabatan wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nik: form.nik,
          nama: form.nama,
          jabatan: form.jabatan,
          gaji: Number(form.gaji) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.message || "Gagal menambahkan data"}`);
        setLoading(false);
        return;
      }

      alert("✅ Employee berhasil ditambahkan");
      router.push("/dashboard");
    } catch (error) {
      alert("❌ Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NIK */}
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="Masukkan NIK"
                  value={form.nik}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* NAMA */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama</Label>
                <Input
                  id="nama"
                  name="nama"
                  placeholder="Masukkan nama karyawan"
                  value={form.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* JABATAN */}
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Select onValueChange={handleJabatanChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="HRD">HRD</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Other">
                      Lainnya (Tulis Sendiri)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {showCustomJabatan && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Input
                      placeholder="Tulis jabatan..."
                      value={customJabatan}
                      onChange={handleCustomJabatanChange}
                      required
                      className="border-blue-500 focus-visible:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* GAJI - ✅ UPDATE BAGIAN INI */}
              <div className="space-y-2">
                <Label htmlFor="gaji">Gaji (IDR)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="gaji"
                    name="gaji"
                    type="text"
                    placeholder="10.000"
                    value={gajiDisplay}
                    onChange={handleGajiChange}
                    className="pl-10"
                  />
                </div>
                {gajiDisplay && (
                  <p className="text-xs text-muted-foreground">
                    Rp {gajiDisplay}
                  </p>
                )}
              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Employee"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AddEmployeePage;
