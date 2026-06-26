import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bus, CheckCircle2, ChevronDown, Clock, Gift, Home, RefreshCw, User } from "lucide-react";
import { formatDateTime, formatTimer, useTicket } from "@/lib/ticket-context";

export const Route = createFileRoute("/ticket")({
  head: () => ({ meta: [{ title: "Ticket Booked — BRTS" }] }),
  component: TicketPage,
});

function requestFS() {
  if (typeof document === "undefined") return;
  const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
  const fn = el.requestFullscreen || el.webkitRequestFullscreen;
  fn?.call(el).catch(() => {});
}

function TicketPage() {
  const nav = useNavigate();
  const { ticket, secondsLeft, username } = useTicket();
  const [tripOpen, setTripOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) { nav({ to: "/" }); return; }
    if (!ticket) { nav({ to: "/book" }); return; }
    const onTap = () => { requestFS(); window.removeEventListener("click", onTap); };
    window.addEventListener("click", onTap, { once: true });
    return () => window.removeEventListener("click", onTap);
  }, [username, ticket, nav]);

  if (!ticket) return null;
  const t = formatTimer(secondsLeft);
  const expired = secondsLeft <= 0;

  return (
    <div style={{ background: "#fff", minHeight: "100dvh", paddingBottom: 96 }}>
      <div style={{ height: 24, background: "#fff" }} />
      <header style={{ background: "#fff", height: 56, padding: "0 16px", borderBottom: "1px solid #F0F0F0" }} className="flex items-center justify-between">
        <button onClick={() => nav({ to: "/book" })} aria-label="Back"><ArrowLeft size={24} color="#212121" /></button>
        <div className="paytm-logo">paytm</div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#00BAF2" }}>Help</span>
      </header>

      {/* Blue card */}
      <div style={{ background: "#DCF0FB", borderRadius: 20, margin: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px 16px 0" }}>
          <div className="flex justify-center mb-3">
            <div style={{ width: 64, height: 64, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bus size={32} color="#1565C0" />
            </div>
          </div>
          <div className="flex justify-center items-center gap-1.5 mb-1" style={{ fontSize: 22, fontWeight: 700, color: "#212121" }}>
            <span style={{ maxWidth: "38%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ticket.from}</span>
            <ArrowRight size={18} color="#212121" />
            <span style={{ maxWidth: "38%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ticket.to}</span>
          </div>
          <p className="text-center" style={{ fontSize: 13, color: "#757575" }}>{ticket.busType}</p>
          <p className="text-center mb-3" style={{ fontSize: 13, color: "#757575" }}>{ticket.adults} Adult Ticket{ticket.adults > 1 ? "s" : ""}</p>

          <div className="flex justify-center items-center gap-2 mb-1.5">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1976D2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#212121" }}>{ticket.adults}</span>
          </div>

          <div className="flex justify-center items-center gap-2 mb-1">
            <span style={{ fontSize: 36, fontWeight: 700, color: "#212121" }}>₹{ticket.amount}</span>
            <CheckCircle2 size={28} color="#fff" fill="#4CAF50" />
          </div>
          <p className="text-center mb-1" style={{ fontSize: 13, fontWeight: 600, color: "#212121", letterSpacing: 2, textTransform: "uppercase" }}>Ticket Booked Successfully</p>
          <p className="text-center mb-4" style={{ fontSize: 12, color: "#757575" }}>{formatDateTime(ticket.issuedOn)}</p>

          {/* Inner white card */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <p className="text-center mb-2" style={{ fontSize: 13, color: "#9E9E9E" }}>Your ticket is valid for</p>
            {expired ? (
              <p className="text-center" style={{ fontSize: 24, fontWeight: 700, color: "#D32F2F", letterSpacing: 2 }}>TICKET EXPIRED</p>
            ) : (
              <p className="timer-digits">{t.h} : {t.m} : {t.s}</p>
            )}
            <div className="flex justify-around mb-4" style={{ fontSize: 10, color: "#9E9E9E", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>
              <span>Hours</span><span>Minutes</span><span>Seconds</span>
            </div>
            <button onClick={() => nav({ to: "/qr" })} className="w-full active:scale-[0.98] transition-transform" style={{ background: "#29B5E8", color: "#fff", borderRadius: 8, padding: "14px 0", fontSize: 16, fontWeight: 600, border: "none" }}>
              View your Tickets
            </button>
          </div>

          {/* Expected Arrivals */}
          <div style={{ paddingTop: 8 }}>
            <div className="flex justify-between items-center mb-2.5">
              <span style={{ fontSize: 14, fontWeight: 600, color: "#212121" }}>Expected Arrivals</span>
              <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#9E9E9E" }}>
                <RefreshCw size={11} color="#9E9E9E" /> Auto refresh in 2 mins
              </span>
            </div>
            <div className="flex gap-3 mb-2">
              {[{n:"3U",a:1},{n:"9U-VM",a:1}].map((b) => (
                <div key={b.n} className="flex items-center gap-1.5 flex-1">
                  <Bus size={20} color="#1A237E" />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#212121" }}>{b.n}</p>
                    <p style={{ fontSize: 11, color: "#757575" }}>Arriving in {b.a} min</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="pb-3" style={{ fontSize: 13, color: "#00BAF2", fontWeight: 500, cursor: "pointer" }}>Check other buses ›</p>
          </div>
        </div>

        {/* Gradient stripe */}
        <div style={{ height: 6, background: "linear-gradient(90deg, #1565C0 0%, #0D47A1 50%, #0A2D82 100%)" }} />
      </div>

      {/* Trip Details accordion */}
      <Accordion title="Trip Details" open={tripOpen} onToggle={() => setTripOpen((v) => !v)}>
        <div className="mb-3">
          <p style={labelStyle}>OPERATOR</p>
          <p style={valueStyle}>BRTS</p>
        </div>
        <div className="mb-3">
          <p style={labelStyle}>BUS NUMBER</p>
          <p style={valueStyle}>BRTS</p>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #E0E0E0", margin: "12px 0" }} />
        <div>
          <p style={{ fontSize: 14, color: "#212121" }}>
            Order ID: <span style={{ fontWeight: 500 }}>{ticket.orderId}</span>{" "}
            <button
              onClick={() => { navigator.clipboard?.writeText(ticket.orderId); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              style={{ fontSize: 13, color: "#00BAF2", fontWeight: 500, marginLeft: 4, background: "none", border: "none" }}
            >{copied ? "copied" : "copy"}</button>
          </p>
          <p style={{ fontSize: 12, color: "#9E9E9E", fontStyle: "italic", marginTop: 6 }}>For any queries regarding QR Ticket, please contact BRTS with Order Id.</p>
        </div>
      </Accordion>

      {/* Payment Details accordion */}
      <Accordion title="Payment Details" open={payOpen} onToggle={() => setPayOpen((v) => !v)}>
        <p style={{ ...labelStyle, marginBottom: 8 }}>FARE BREAKUP ▾</p>
        <div className="flex justify-between" style={{ padding: "6px 0" }}>
          <span style={{ fontSize: 14, color: "#212121" }}>{ticket.adults} X Adult</span>
          <span style={{ fontSize: 14, color: "#212121", fontWeight: 500 }}>₹{ticket.amount}</span>
        </div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}>
          <span style={{ fontSize: 14, color: "#212121", fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 14, color: "#212121", fontWeight: 600 }}>₹{ticket.amount}</span>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #E0E0E0", margin: "12px 0" }} />
        <p style={labelStyle}>PAYMENT MODE</p>
        <div className="flex justify-between mt-2" style={{ padding: "6px 0" }}>
          <span style={{ fontSize: 14, color: "#212121" }}>UPI Linked Bank Account</span>
          <span style={{ fontSize: 14, color: "#212121", fontWeight: 500 }}>₹{ticket.amount}</span>
        </div>
        <p style={{ fontSize: 12, color: "#9E9E9E", marginTop: 4 }}>Transaction ID: {ticket.transactionId}</p>
      </Accordion>

      {/* Floating nav */}
      <nav style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 398, background: "#1A237E", borderRadius: 40,
        padding: "12px 24px", boxShadow: "0 4px 20px rgba(26,35,126,0.4)", zIndex: 100,
      }} className="flex justify-around items-center">
        {[{Icon:Home,label:"Home"},{Icon:Gift,label:"CASH BACK"},{Icon:Clock,label:"Help"}].map(({Icon,label}) => (
          <button key={label} className="flex flex-col items-center gap-1">
            <Icon size={22} color="#fff" />
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 11, color: "#9E9E9E", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" };
const valueStyle: React.CSSProperties = { fontSize: 14, color: "#212121", fontWeight: 500, marginTop: 2 };

function Accordion({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
      <button onClick={onToggle} className="w-full flex justify-between items-center" style={{ padding: 16 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#212121" }}>{title}</span>
        <ChevronDown size={20} color="#757575" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
      </button>
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      </div>
    </div>
  );
}