import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { STATIONS, useTicket } from "@/lib/ticket-context";
import paytmAsset from "@/assets/paytm.png.asset.json";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Book Ticket — BRTS" }] }),
  component: BookPage,
});

function randDigits(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  if (s[0] === "0") s = "1" + s.slice(1);
  return s;
}

function BookPage() {
  const nav = useNavigate();
  const { username, setTicket } = useTicket();
  const [from, setFrom] = useState("Jhansi Ki Rani");
  const [to, setTo] = useState("Memnagar");
  const [adults, setAdults] = useState(1);
  const [amount, setAmount] = useState<string>("10");
  const [hours, setHours] = useState<string>("3");
  const [minutes, setMinutes] = useState<string>("0");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!username) nav({ to: "/" });
  }, [username, nav]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from === to) { setErr("Departure and destination cannot be the same."); return; }
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr("Please enter a valid fare amount."); return; }
    const h = Math.max(0, Math.min(23, Number(hours) || 0));
    const m = Math.max(0, Math.min(59, Number(minutes) || 0));
    const totalMs = (h * 60 + m) * 60 * 1000;
    if (totalMs <= 0) { setErr("Please set a valid ticket duration."); return; }
    const now = new Date();
    setTicket({
      orderId: randDigits(11),
      orderItemId: randDigits(11),
      transactionId: randDigits(12),
      from, to,
      amount: amt,
      adults,
      busType: "AC",
      issuedOn: now.toISOString(),
      validUntil: new Date(now.getTime() + totalMs).toISOString(),
    });
    nav({ to: "/ticket" });
  };

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100dvh" }}>
      <header style={{ background: "#fff", height: 56, padding: "0 16px", borderBottom: "1px solid #F0F0F0" }} className="flex items-center justify-between">
        <button onClick={() => nav({ to: "/" })} aria-label="Back"><ArrowLeft size={24} color="#212121" /></button>
        <img src={paytmAsset.url} alt="Paytm" style={{ height: 22 }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#00BAF2" }}>Help</span>
      </header>

      <form onSubmit={onSubmit} className="p-4">
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }} className="flex flex-col gap-5">
          <Field label="FROM">
            <select value={from} onChange={(e) => { setFrom(e.target.value); setErr(""); }} style={selectStyle}>
              {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="TO">
            <select value={to} onChange={(e) => { setTo(e.target.value); setErr(""); }} style={selectStyle}>
              {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="ADULTS">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setAdults((a) => Math.max(1, a - 1))} style={stepBtn} aria-label="Decrease"><Minus size={18} color="#29B5E8" /></button>
              <span style={{ fontSize: 18, fontWeight: 600, color: "#212121", minWidth: 40, textAlign: "center" }}>{adults}</span>
              <button type="button" onClick={() => setAdults((a) => Math.min(10, a + 1))} style={stepBtn} aria-label="Increase"><Plus size={18} color="#29B5E8" /></button>
            </div>
          </Field>
          <Field label="BUS TYPE">
            <span style={{ background: "#E3F2FD", color: "#1565C0", borderRadius: 20, padding: "6px 16px", fontSize: 14, fontWeight: 500, display: "inline-block" }}>AC</span>
          </Field>
          <Field label="FARE AMOUNT">
            <div className="relative">
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#757575", fontSize: 16 }}>₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErr(""); }}
                placeholder="Enter amount"
                style={{ ...selectStyle, paddingLeft: 32 }}
                className="w-full"
              />
            </div>
          </Field>
          <Field label="TICKET VALIDITY">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={23}
                  value={hours}
                  onChange={(e) => { setHours(e.target.value); setErr(""); }}
                  style={{ ...selectStyle, paddingRight: 44 }}
                  className="w-full"
                />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#757575", fontSize: 13 }}>hr</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => { setMinutes(e.target.value); setErr(""); }}
                  style={{ ...selectStyle, paddingRight: 50 }}
                  className="w-full"
                />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#757575", fontSize: 13 }}>min</span>
              </div>
            </div>
          </Field>
          {err && <p style={{ color: "#D32F2F", fontSize: 13 }}>{err}</p>}
          <button type="submit" className="active:scale-[0.98] transition-transform" style={{ background: "#29B5E8", color: "#fff", borderRadius: 8, padding: "14px 0", fontSize: 16, fontWeight: 600, border: "none" }}>
            Book Ticket
          </button>
        </div>
      </form>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E0E0E0", borderRadius: 8, padding: "12px 16px",
  fontSize: 15, color: "#212121", background: "#fff", outline: "none",
};
const stepBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: "50%", border: "1px solid #E0E0E0",
  display: "flex", alignItems: "center", justifyContent: "center", background: "#fff",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#9E9E9E", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }} className="block mb-2">{label}</label>
      {children}
    </div>
  );
}