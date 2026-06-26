import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTicket } from "@/lib/ticket-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — BRTS Ticket" },
      { name: "description", content: "Sign in to book BRTS bus tickets." },
    ],
  }),
  component: LoginPage,
});

const VALID_USERS = ["dev@hridayam", "demo", "admin"];

function LoginPage() {
  const nav = useNavigate();
  const { username, login } = useTicket();
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (username) nav({ to: "/book" });
  }, [username, nav]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) { setErr("Please enter a username."); return; }
    if (!VALID_USERS.includes(v)) {
      setErr("Invalid username. Please try again.");
      return;
    }
    login(v);
    nav({ to: "/book" });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-white">
      <div className="paytm-logo mb-2">paytm</div>
      <p style={{ fontSize: 13, color: "#757575" }} className="mb-8">BRTS Bus Ticket</p>
      <form
        onSubmit={onSubmit}
        className="w-full"
        style={{ maxWidth: 360, background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: 24 }}
      >
        <label style={{ fontSize: 14, color: "#757575" }} className="block mb-2">Username</label>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setErr(""); }}
          placeholder="Enter your username"
          className="w-full"
          style={{ border: "1px solid #E0E0E0", borderRadius: 8, padding: "12px 16px", fontSize: 16, color: "#212121", outline: "none" }}
        />
        {err && <p style={{ color: "#D32F2F", fontSize: 13 }} className="mt-2">{err}</p>}
        <button
          type="submit"
          className="w-full mt-5 active:scale-[0.98] transition-transform"
          style={{ background: "#29B5E8", color: "#fff", borderRadius: 8, padding: "14px 0", fontSize: 16, fontWeight: 600, border: "none" }}
        >
          Login
        </button>
        <p className="mt-4 text-center" style={{ fontSize: 12, color: "#9E9E9E" }}>Try: dev@hridayam</p>
      </form>
    </div>
  );
}
