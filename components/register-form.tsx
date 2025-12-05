"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://uprak-gabut-be.vercel.app/api/auth/request-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim permintaan");
      }

      setSuccess(true);

      // Redirect ke login setelah 5 detik
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Permintaan Terkirim!</h3>
                <p className="text-sm text-muted-foreground">
                  Permintaan pembuatan akun Anda telah dikirim ke admin.
                  <br />
                  Anda akan menerima email konfirmasi setelah akun disetujui.
                </p>
              </div>
              <div className="w-full space-y-2 rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-900">
                  📧 Email notifikasi telah dikirim ke:
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  {formData.email}
                </p>
              </div>
              <Button onClick={() => router.push("/login")} className="w-full">
                Kembali ke Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Request Account</CardTitle>
          </div>
          <CardDescription>
            Isi form di bawah untuk mengajukan pembuatan akun. Admin akan
            meninjau permintaan Anda dan mengirimkan kredensial login via email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap *</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Kredensial login akan dikirim ke email ini
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="reason">
                  Alasan Pengajuan Akun *
                </FieldLabel>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Jelaskan mengapa Anda membutuhkan akses ke sistem ini..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="resize-none"
                />
              </Field>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  ❌ {error}
                </div>
              )}
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Permintaan"
                  )}
                </Button>
              </Field>

              <p className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
