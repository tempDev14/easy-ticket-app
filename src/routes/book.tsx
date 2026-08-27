import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Clock, Info, ArrowRight } from "lucide-react";
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
      <header style={{ background: "#fff", padding: "42px 20px 24px" }} className="flex items-start gap-4">
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

      <div style={{ padding: "14px 20px 40px" }}>
        {active && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Your Active Ticket</p>
            <div
              role="button"
              tabIndex={0}
              onClick={() => nav({ to: "/qr" })}
              onKeyDown={(e) => { if (e.key === "Enter") nav({ to: "/qr" }); }}
              className="active:opacity-90 cursor-pointer"
              style={{ position: "relative", background: "#fff", border: "1px solid #EEF0F3", borderRadius: 18, marginBottom: 22, boxShadow: "0 10px 26px rgba(16,24,40,0.14), 0 2px 6px rgba(16,24,40,0.06)" }}
            >
              <div style={{ padding: "18px 20px 0" }}>
                <p style={{ fontSize: 13, color: "#5F6570", marginBottom: 16 }}>BRTS · {active.adults} Adult Ticket</p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <Dot />
                      <div>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15 }}>{active.from}</p>
                        <p style={{ fontSize: 12, color: "#B0B4BA", marginTop: 2 }}>Via BRTS</p>
                      </div>
                    </div>
                    <div style={{ height: 26, marginLeft: 7, borderLeft: "1.5px solid #DCDFE3" }} />
                    <div className="flex items-start gap-3">
                      <Dot />
                      <p style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.15 }}>{active.to}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center" style={{ marginTop: 2, marginRight: 4 }}>
                    <QRCodeSVG value={`TICKET:${active.orderId}:${active.from}:${active.to}`} size={62} level="M" fgColor="#000" bgColor="#fff" />
                    <span style={{ fontSize: 13, color: "#29B5E8", marginTop: 10 }}>Tap to View</span>
                  </div>
                </div>
              </div>

              {/* Perforation notches sit on the divider above the expiry row */}
              <div style={{ position: "relative", height: 22, marginTop: 20 }}>
                <div style={{ position: "absolute", left: -9, top: 2, width: 18, height: 18, borderRadius: "50%", background: "#F5F5F5", border: "1px solid #EEF0F3", clipPath: "inset(0 0 0 50%)" }} />
                <div style={{ position: "absolute", right: -9, top: 2, width: 18, height: 18, borderRadius: "50%", background: "#F5F5F5", border: "1px solid #EEF0F3", clipPath: "inset(0 50% 0 0)" }} />
                <div style={{ position: "absolute", left: 14, right: 14, top: 10, borderTop: "1px solid #F0F1F3" }} />
              </div>

              <div className="flex items-center gap-2" style={{ padding: "0 20px 18px" }}>
                <Clock size={15} color={AMBER} />
                <span style={{ fontSize: 13.5, color: "#4B5563" }}>Ticket will expire at</span>
                <span style={{ fontSize: 13.5, color: "#1A1A1A", fontWeight: 700 }}>{expiryLabel(active.validUntil)}</span>
              </div>
              <div style={{ height: 4, background: AMBER, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} />
            </div>
          </>
        )}


        {recent.length > 0 && (
          <>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Recent Orders</p>
              <span style={{ fontSize: 13, color: BLUE }}>View All</span>
            </div>
            <div className="flex flex-col gap-2 no-scrollbar" style={{ marginBottom: 22, maxHeight: 196, overflowY: recent.length > 2 ? "auto" : "visible" }}>
              {recent.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { setFrom(r.from); setTo(r.to); setAdults(r.adults); }}
                  style={{ textAlign: "left", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: 13, flexShrink: 0 }}
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

        <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>Buy New Ticket</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5" style={{ background: "#fff", border: "1px solid #EDEEF0", borderRadius: 14, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div className="relative">
            <button type="button" onClick={() => setPicker("from")} style={{ ...fieldStyle, paddingRight: 104 }} className="active:bg-black/5 text-left">
              <span style={{ color: from ? "#1A1A1A" : "#9CA3AF", fontSize: 16 }}>{from || "From"}</span>
            </button>
            <div className="flex flex-col items-center" style={{ position: "absolute", right: 12, top: 7, pointerEvents: "none" }}>
              <ScanQrIcon size={20} />
              <span style={{ fontSize: 9.5, color: "#7FB4DC", fontWeight: 400, marginTop: 5, letterSpacing: 0.1, whiteSpace: "nowrap" }}>Scan at bus stop</span>
            </div>
          </div>

          <button type="button" onClick={() => setPicker("to")} style={fieldStyle} className="active:bg-black/5 text-left">
            <span style={{ color: to ? "#1A1A1A" : "#9CA3AF", fontSize: 16 }}>{to || "To"}</span>
          </button>

          <div className="relative">
            <span style={{ position: "absolute", top: -8, left: 12, background: "#fff", padding: "0 6px", fontSize: 12, color: "#6B7280", zIndex: 1 }}>Passenger</span>
            <button type="button" onClick={() => setPassOpen((v) => !v)} style={fieldStyle} className="active:bg-black/5 text-left flex items-center justify-between">
              <span style={{ color: "#1A1A1A", fontSize: 16 }}>{adults} Adult</span>
              <ChevronDown size={20} color="#6B7280" style={{ transform: passOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
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

function ScanQrIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#69C7D8" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="15" y="15" width="35" height="35" rx="3" />
        <circle cx="32.5" cy="32.5" r="3.5" fill="#69C7D8" stroke="none" />
        <rect x="68" y="15" width="35" height="35" rx="3" />
        <circle cx="85.5" cy="32.5" r="3.5" fill="#69C7D8" stroke="none" />
        <rect x="14" y="67" width="38" height="38" rx="3" />
        <circle cx="33" cy="86" r="3.5" fill="#69C7D8" stroke="none" />
        <path d="M68 68H78" />
        <path d="M68 68V78" />
        <path d="M93 68H101" />
        <path d="M101 68V77" />
        <path d="M68 91V101" />
        <path d="M68 101H79" />
        <path d="M98 91V99" />
        <path d="M98 99H91" />
        <circle cx="85" cy="85" r="3.5" fill="#69C7D8" stroke="none" />
      </g>
    </svg>
  );
}

function Dot() {
  return (
    <span style={{ width: 15, height: 15, borderRadius: "50%", background: "#E7E9EC", display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 5, flexShrink: 0 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2B2F36" }} />
    </span>

  );
}

function expiryLabel(iso: string) {
  const [date, time] = formatDateTime(iso).split(", ");
  return `${time}, ${date}`;
}

const fieldStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #D8DBDF", borderRadius: 10, padding: "17px 16px",
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
