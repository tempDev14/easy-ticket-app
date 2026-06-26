import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, ChevronUp, ChevronDown, Ticket as TicketIcon } from "lucide-react";
import { formatDateTime, formatTimer, useTicket } from "@/lib/ticket-context";

export const Route = createFileRoute("/qr")({
  head: () => ({ meta: [{ title: "QR Ticket — BRTS" }] }),
  component: QrPage,
});

function trunc(s: string, n = 14) { return s.length > n ? s.slice(0, n) + "..." : s; }

function QrPage() {
  const nav = useNavigate();
  const { ticket, secondsLeft, username } = useTicket();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!username) { nav({ to: "/" }); return; }
    if (!ticket) { nav({ to: "/book" }); return; }
    const onTap = () => {
      const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el).catch(() => {});
      window.removeEventListener("click", onTap);
    };
    window.addEventListener("click", onTap, { once: true });
    return () => window.removeEventListener("click", onTap);
  }, [username, ticket, nav]);

  if (!ticket) return null;
  const t = formatTimer(secondsLeft);
  const expired = secondsLeft <= 0;

  return (
    <div style={{ background: "#fff", minHeight: "100dvh" }}>
      <div style={{ height: 24, background: "#fff" }} />
      <header style={{ background: "#fff", height: 56, padding: "0 16px", borderBottom: "1px solid #F0F0F0" }} className="flex items-center">
        <button onClick={() => nav({ to: "/ticket" })} aria-label="Back" className="mr-2"><ArrowLeft size={24} color="#212121" /></button>
        <div className="flex-1 flex items-center gap-2">
          <TicketIcon size={22} color="#29B5E8" />
          <span style={{ fontSize: 16, fontWeight: 600, color: "#212121" }}>1 QR Ticket</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#00BAF2" }}>Help</span>
      </header>

      <div style={{ padding: "8px 16px 0" }} className="flex items-center justify-center gap-1.5">
        <span style={{ fontSize: 15, fontWeight: 500, color: "#212121", maxWidth: "40%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(ticket.from)}</span>
        <span style={{ fontSize: 15, color: "#212121" }}>→</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: "#212121", maxWidth: "40%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trunc(ticket.to)}</span>
      </div>

      <p className="text-center" style={{ fontSize: 13, fontWeight: 500, color: "#29B5E8", padding: "10px 16px 4px" }}>Scan this QR at Entry & Exit Points</p>

      <div className="flex justify-center" style={{ margin: "12px auto" }}>
        <div style={{ padding: 8, border: "1px solid #F0F0F0", borderRadius: 8, background: "#fff" }}>
          <QRCodeSVG
            value={`TICKET:${ticket.orderId}:${ticket.from}:${ticket.to}`}
            fgColor="#1A237E"
            bgColor="#FFFFFF"
            level="M"
            size={240}
          />
        </div>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <p className="text-center mb-1" style={{ fontSize: 13, color: "#9E9E9E" }}>Your ticket is valid for</p>
        {expired ? (
          <p className="text-center" style={{ fontSize: 24, fontWeight: 700, color: "#D32F2F", letterSpacing: 2 }}>TICKET EXPIRED</p>
        ) : (
          <p className="timer-digits">{t.h} : {t.m} : {t.s}</p>
        )}
        <div className="flex justify-around" style={{ fontSize: 10, color: "#9E9E9E", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, marginTop: 4 }}>
          <span>Hours</span><span>Minutes</span><span>Seconds</span>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "0 16px" }}>
        <button onClick={() => setOpen((v) => !v)} className="w-full flex justify-between items-center" style={{ padding: "16px 0" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#212121" }}>Ticket Details</span>
          {open ? <ChevronUp size={20} color="#757575" /> : <ChevronDown size={20} color="#757575" />}
        </button>
        <div style={{ maxHeight: open ? 800 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
          {[
            ["Issued On", formatDateTime(ticket.issuedOn)],
            ["Order ID", ticket.orderId],
            ["Order Item ID", ticket.orderItemId],
            ["Ticket Type", `${ticket.adults} Adult`],
            ["Bus Service Type", `(${ticket.busType})`],
          ].map(([k, v], i, arr) => (
            <div key={k} className="flex justify-between" style={{ padding: "10px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid #F0F0F0" }}>
              <span style={{ fontSize: 13, color: "#757575" }}>{k}</span>
              <span style={{ fontSize: 13, color: "#212121", fontWeight: 500, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}