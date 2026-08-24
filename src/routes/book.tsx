import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Clock, Info, QrCode, ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { STATIONS, useTicket, formatDateTime } from "@/lib/ticket-context";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Buy City Bus Ticket — BRTS" },
      { name: "description", content: "Book BRTS city bus tickets in Ahmedabad." },
    ],
  }),
  component: BookPage,
});

function randDigits(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  if (s[0] === "0") s = "1" + s.slice(1);
  return s;
}

const BLUE = "#0B57D0";
const AMBER = "#F59E0B";

interface RecentOrder { from: string; to: string; adults: number }

function BookPage() {
  const nav = useNavigate();
  const { username, setTicket, ticket, secondsLeft } = useTicket();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [adults, setAdults] = useState(1);
  const [picker, setPicker] = useState<null | "from" | "to">(null);
  const [passOpen, setPassOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [hours, setHours] = useState("3");
  const [minutes, setMinutes] = useState("0");
  const [err, setErr] = useState("");
  const [customStations, setCustomStations] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("custom_stations") || "[]"); } catch { return []; }
  });
  const [recent, setRecent] = useState<RecentOrder[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("recent_orders") || "[]"); } catch { return []; }
  });

  const allStations = Array.from(new Set([...STATIONS, ...customStations]));

  useEffect(() => {
    if (!username) nav({ to: "/" });
  }, [username, nav]);

  const pick = (val: string) => {
    const setter = picker === "from" ? setFrom : setTo;
    if (val === "__add__") {
      const name = window.prompt("Enter custom location name")?.trim();
      if (!name) return;
      const next = Array.from(new Set([...customStations, name]));
      setCustomStations(next);
      try { localStorage.setItem("custom_stations", JSON.stringify(next)); } catch {}
      setter(name);
    } else setter(val);
    setPicker(null);
    setErr("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
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
    const next = [{ from, to, adults }, ...recent].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem("recent_orders", JSON.stringify(next)); } catch {}
    nav({ to: "/ticket" });
  };

  const canBuy = Boolean(from && to);
  const active = ticket && secondsLeft > 0 ? ticket : null;

  return (
    <div style={{ background: "#fff", minHeight: "100dvh" }}>
      {/* Header */}
      <header style={{ background: "#fff", padding: "20px 20px 18px" }} className="flex items-start gap-4">
        <button onClick={() => nav({ to: "/" })} aria-label="Back" style={{ marginTop: 2 }}><ArrowLeft size={22} color="#212121" /></button>
        <div className="flex-1">
          <p style={{ fontSize: 17.5, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>Buy City Bus Ticket</p>
          <button className="flex items-center gap-0.5" style={{ marginTop: 4 }}>
            <span style={{ fontSize: 13, color: "#616161" }}>Ahmedabad</span>
            <ChevronDown size={14} color="#616161" />
          </button>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: BLUE, marginTop: 2 }}>Help</span>
      </header>

      <div style={{ padding: "8px 20px 40px" }}>
        {active && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Your Active Ticket</p>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden", marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>BRTS · {active.adults} Adult Ticket</p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-2.5">
                      <Dot />
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{active.from}</p>
                        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Via BRTS</p>
                      </div>
                    </div>
                    <div style={{ height: 18, marginLeft: 6.5, borderLeft: "1.5px solid #C7CBD1" }} />
                    <div className="flex items-start gap-2.5">
                      <Dot />
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{active.to}</p>
                    </div>
                  </div>
                  <button onClick={() => nav({ to: "/qr" })} className="flex flex-col items-center active:opacity-70">
                    <QRCodeSVG value={`TICKET:${active.orderId}:${active.from}:${active.to}`} size={58} level="M" fgColor="#000" bgColor="#fff" />
                    <span style={{ fontSize: 12, color: BLUE, marginTop: 6 }}>Tap to View</span>
                  </button>
                </div>
                <div style={{ borderTop: "1px solid #F0F1F3", margin: "12px 0" }} />
                <div className="flex items-center gap-1.5" style={{ paddingBottom: 4 }}>
                  <Clock size={14} color={AMBER} />
                  <span style={{ fontSize: 13, color: "#4B5563" }}>Ticket will expire at</span>
                  <span style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 700 }}>{expiryLabel(active.validUntil)}</span>
                </div>
              </div>
              <div style={{ height: 4, background: AMBER }} />
            </div>
          </>
        )}

        {recent.length > 0 && (
          <>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Recent Orders</p>
              <span style={{ fontSize: 13, color: BLUE }}>View All</span>
            </div>
            <div className="flex flex-col gap-2" style={{ marginBottom: 22, maxHeight: 196, overflowY: recent.length > 2 ? "auto" : "visible" }}>
              {recent.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { setFrom(r.from); setTo(r.to); setAdults(r.adults); }}
                  style={{ textAlign: "left", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 11 }}
                  className="active:bg-black/5"
                >
                  <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 3 }}>BRTS · {r.adults} Adult Ticket</p>
                  <div className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                    <span>{r.from}</span><ArrowRight size={14} color="#6B7280" /><span>{r.to}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Via BRTS</p>
                </button>
              ))}
            </div>
          </>
        )}

        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Buy New Ticket</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <button type="button" onClick={() => setPicker("from")} style={fieldStyle} className="active:bg-black/5 text-left">
              <span style={{ color: from ? "#1A1A1A" : "#9CA3AF", fontSize: 15 }}>{from || "From"}</span>
            </button>
            <div className="flex flex-col items-center" style={{ position: "absolute", right: 12, top: 8 }}>
              <QrCode size={19} color={BLUE} />
              <span style={{ fontSize: 10.5, color: BLUE, marginTop: 2 }}>Scan at bus stop</span>
            </div>
          </div>

          <button type="button" onClick={() => setPicker("to")} style={fieldStyle} className="active:bg-black/5 text-left">
            <span style={{ color: to ? "#1A1A1A" : "#9CA3AF", fontSize: 15 }}>{to || "To"}</span>
          </button>

          <div className="relative">
            <button type="button" onClick={() => setPassOpen((v) => !v)} style={fieldStyle} className="active:bg-black/5 text-left flex items-center justify-between">
              <span style={{ color: "#1A1A1A", fontSize: 15 }}>{adults} Adult</span>
              <ChevronDown size={18} color="#6B7280" style={{ transform: passOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            {passOpen && (
              <div style={dropdownStyle}>
                {[1, 2, 5].map((n) => (
                  <button key={n} type="button" onClick={() => { setAdults(n); setPassOpen(false); }} style={optionStyle} className="active:bg-black/5 w-full text-left">{n} Adult</button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const v = Number(window.prompt("Enter number of passengers", String(adults)));
                    if (v && v > 0) setAdults(Math.min(50, Math.floor(v)));
                    setPassOpen(false);
                  }}
                  style={{ ...optionStyle, color: BLUE }}
                  className="active:bg-black/5 w-full text-left"
                >
                  Custom…
                </button>
              </div>
            )}
          </div>

          <button type="button" onClick={() => setMoreOpen((v) => !v)} className="flex items-center gap-1.5 self-start active:opacity-70" style={{ padding: "2px 0" }}>
            <Info size={15} color={BLUE} />
            <span style={{ fontSize: 13, color: BLUE }}>Additional info</span>
            <ChevronDown size={15} color={BLUE} style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform .22s ease" }} />
          </button>

          <div style={{ maxHeight: moreOpen ? 400 : 0, overflow: "hidden", transition: "max-height .24s ease" }}>
            <div className="flex flex-col gap-4" style={{ paddingTop: 4 }}>
              <div>
                <p style={labelStyle}>BUS TYPE</p>
                <span style={{ background: "#E8F0FE", color: BLUE, borderRadius: 20, padding: "6px 16px", fontSize: 14, fontWeight: 500, display: "inline-block" }}>AC</span>
              </div>
              <div>
                <p style={labelStyle}>FARE AMOUNT</p>
                <div className="relative">
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: 15 }}>₹</span>
                  <input type="number" inputMode="numeric" value={amount} onChange={(e) => { setAmount(e.target.value); setErr(""); }} style={{ ...fieldStyle, paddingLeft: 32 }} className="w-full" />
                </div>
              </div>
              <div>
                <p style={labelStyle}>TICKET VALIDITY</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input type="number" min={0} max={23} value={hours} onChange={(e) => { setHours(e.target.value); setErr(""); }} style={{ ...fieldStyle, paddingRight: 44 }} className="w-full" />
                    <span style={unitStyle}>hr</span>
                  </div>
                  <div className="flex-1 relative">
                    <input type="number" min={0} max={59} value={minutes} onChange={(e) => { setMinutes(e.target.value); setErr(""); }} style={{ ...fieldStyle, paddingRight: 50 }} className="w-full" />
                    <span style={unitStyle}>min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {err && <p style={{ color: "#D32F2F", fontSize: 13 }}>{err}</p>}

          <button
            type="submit"
            disabled={!canBuy}
            className={canBuy ? "active:scale-[0.98] transition-transform" : ""}
            style={{
              background: canBuy ? BLUE : "#E9EAEC",
              color: canBuy ? "#fff" : "#9CA3AF",
              borderRadius: 11, padding: "14px 0", fontSize: 16, fontWeight: 700, border: "none",
              cursor: canBuy ? "pointer" : "not-allowed", marginTop: 4,
            }}
          >
            Buy Ticket
          </button>
          <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 6 }}>
            <Clock size={13} color="#9CA3AF" />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>All bus tickets will be valid for 3 hours post booking</span>
          </div>
        </form>
      </div>

      {picker && (
        <div
          onClick={() => setPicker(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "flex-end" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", width: "100%", borderRadius: "16px 16px 0 0", padding: "16px 0 20px", maxHeight: "60dvh", display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", padding: "0 16px 12px" }}>
              Select {picker === "from" ? "departure" : "destination"}
            </p>
            <div style={{ overflowY: "auto" }}>
              {allStations.map((s) => (
                <button key={s} type="button" onClick={() => pick(s)} style={optionStyle} className="w-full text-left active:bg-black/5">{s}</button>
              ))}
              <button type="button" onClick={() => pick("__add__")} style={{ ...optionStyle, color: BLUE }} className="w-full text-left active:bg-black/5">+ Add custom location…</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dot() {
  return <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#1A1A1A", display: "inline-block", marginTop: 5, flexShrink: 0 }} />;
}

function expiryLabel(iso: string) {
  const [date, time] = formatDateTime(iso).split(", ");
  return `${time}, ${date}`;
}

const fieldStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E5E7EB", borderRadius: 12, padding: "15px 16px",
  fontSize: 15, color: "#1A1A1A", background: "#fff", outline: "none",
};
const dropdownStyle: React.CSSProperties = {
  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff",
  border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  zIndex: 50, maxHeight: 200, overflowY: "auto",
};
const optionStyle: React.CSSProperties = { padding: "13px 16px", fontSize: 15, color: "#1A1A1A", background: "transparent", border: "none", display: "block" };
const labelStyle: React.CSSProperties = { fontSize: 11, color: "#9CA3AF", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 };
const unitStyle: React.CSSProperties = { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: 13 };
