"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ✅ Dummy akun login
  const dummyUser = {
    email: "admin@gmail.com",
    password: "admin",
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      if (email === dummyUser.email && password === dummyUser.password) {
        alert("Login berhasil!")

        // Simpan dummy session
        localStorage.setItem("user", JSON.stringify({
          email,
          role: "admin"
        }))

        // Redirect ke dashboard (ubah sesuai kebutuhan)
        window.location.href = "/dashboard"
      } else {
        setError("Email atau password salah")
      }

      setLoading(false)
    }, 1000) // simulasi loading 1 detik
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Gunakan akun dummy untuk masuk ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <p className="text-xs text-muted-foreground">
                Dummy Login: <br />
                Email: <b>admin@gmail.com</b> <br />
                Password: <b>123456</b>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
