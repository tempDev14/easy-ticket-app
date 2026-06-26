import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export interface Ticket {
  orderId: string;
  orderItemId: string;
  transactionId: string;
  from: string;
  to: string;
  amount: number;
  adults: number;
  busType: string;
  issuedOn: string; // ISO
  validUntil: string; // ISO
}

interface Ctx {
  ticket: Ticket | null;
  setTicket: (t: Ticket | null) => void;
  secondsLeft: number;
  username: string | null;
  login: (u: string) => void;
  logout: () => void;
}

const TicketContext = createContext<Ctx | null>(null);

const TICKET_KEY = "brts_ticket";
const AUTH_KEY = "brts_auth";

export function TicketProvider({ children }: { children: ReactNode }) {
  const [ticket, setTicketState] = useState<Ticket | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = window.localStorage.getItem(AUTH_KEY);
    if (a) {
      try {
        const parsed = JSON.parse(a);
        if (parsed.exp > Date.now()) setUsername(parsed.username);
        else window.localStorage.removeItem(AUTH_KEY);
      } catch {}
    }
    const t = window.localStorage.getItem(TICKET_KEY);
    if (t) {
      try {
        const parsed: Ticket = JSON.parse(t);
        if (new Date(parsed.validUntil).getTime() > Date.now()) {
          setTicketState(parsed);
        } else {
          window.localStorage.removeItem(TICKET_KEY);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (!ticket) {
      setSecondsLeft(0);
      return;
    }
    const update = () => {
      const s = Math.max(0, Math.floor((new Date(ticket.validUntil).getTime() - Date.now()) / 1000));
      setSecondsLeft(s);
    };
    update();
    tickRef.current = window.setInterval(update, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [ticket]);

  const setTicket = (t: Ticket | null) => {
    setTicketState(t);
    if (typeof window !== "undefined") {
      if (t) window.localStorage.setItem(TICKET_KEY, JSON.stringify(t));
      else window.localStorage.removeItem(TICKET_KEY);
    }
  };

  const login = (u: string) => {
    const exp = Date.now() + 3 * 60 * 60 * 1000;
    window.localStorage.setItem(AUTH_KEY, JSON.stringify({ username: u, exp }));
    setUsername(u);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(TICKET_KEY);
    setUsername(null);
    setTicketState(null);
  };

  return (
    <TicketContext.Provider value={{ ticket, setTicket, secondsLeft, username, login, logout }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  const c = useContext(TicketContext);
  if (!c) throw new Error("useTicket must be used within TicketProvider");
  return c;
}

export function formatTimer(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${String(hours).padStart(2,"0")}:${mins} ${ampm}`;
}

export const STATIONS = [
  "Jhansi Ki Rani",
  "University",
  "Memnagar",
  "Thaltej",
  "Doordarshan Kendra",
  "Paldi",
  "Nehru Nagar",
  "Gurukul",
];