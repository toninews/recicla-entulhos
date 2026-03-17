"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      email: email || "operacao@reciclaentulhos.com",
      loggedAt: new Date().toISOString(),
    };

    window.localStorage.setItem("recicla:user", JSON.stringify(payload));
    router.replace("/cacambas");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Logo />
        <h1>Entre com sua conta</h1>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email">Usuário</label>
            <input
              id="email"
              placeholder="E-mail de acesso"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              placeholder="******"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <span className="helper-text">
            Use qualquer usuário e senha para entrar.
          </span>

          <button className="primary-button login-submit" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
