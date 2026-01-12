// src/pages/free/KasseFreePage.tsx
import React, { useReducer } from "react";

type Screen =
  | "HOME"
  | "RETUR_MENU"
  | "MANUEL_RETUR"
  | "RETUR_ORIGINAL_BON"
  | "PRINT_BONER"
  | "SALGS_MENU"
  | "KORREKTIONER"
  | "SPECIELLE";

type State = {
  screen: Screen;
  header: {
    shop: string;
    cashier: string;
    terminal: string;
    receipt: string;
    dateTime: string;
  };
  userName: string;
  total: string;
  keypad: string; // det brugeren har indtastet
  log: string[];
};

type Action =
  | { type: "NAV"; to: Screen }
  | { type: "KEY"; key: string }
  | { type: "CLEAR" }
  | { type: "BACKSPACE" }
  | { type: "RESET" };

const initialState: State = {
  screen: "HOME",
  header: {
    shop: "Butiks nr. 5257",
    cashier: "Kasserer 660",
    terminal: "Terminal 45",
    receipt: "Bon nr. 69",
    dateTime: "21.12.2025, 22.11",
  },
  userName: "LAUGE",
  total: "0,00 kr.",
  keypad: "",
  log: ["Klar (HOME)"],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NAV": {
      const next = action.to;
      return {
        ...state,
        screen: next,
        log: [`Skærm: ${next}`, ...state.log].slice(0, 20),
      };
    }
    case "KEY": {
      const next = (state.keypad + action.key).slice(0, 16);
      return { ...state, keypad: next };
    }
    case "CLEAR":
      return { ...state, keypad: "" };
    case "BACKSPACE":
      return { ...state, keypad: state.keypad.slice(0, -1) };
    case "RESET":
      return { ...initialState, log: ["Nulstil (HOME)"] };
    default:
      return state;
  }
}

export function KasseFreePage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Kasse – fri træning</h1>
      <p className="muted">Digital kasse (mock) i fri tilstand.</p>

      <div className="panel">
        <h2>Interaktiv del</h2>

        <div className="kasse-wrap" aria-label="Kasse simulator (UI mock)">
          <div className="kasse-topbar">
            <div className="kasse-topbar-left">
              <span>{state.header.shop}</span>
              <span>{state.header.cashier}</span>
              <span>{state.header.terminal}</span>
            </div>
            <div className="kasse-topbar-right">
              <span>{state.header.receipt}</span>
              <span>{state.header.dateTime}</span>
            </div>
          </div>

          <div className="kasse-main">
            <div className="kasse-left">
              <div className="kasse-left-header">
                <div className="kasse-user">
                  <div className="kasse-user-name">{state.userName}</div>
                  <div className="kasse-user-sub">*</div>
                </div>

                <div className="kasse-mini">
                  <div className="pill pill--soft">Skærm: {state.screen}</div>
                  <div className="pill pill--soft">Input: {state.keypad || "—"}</div>
                </div>
              </div>

              <div className="kasse-totalbar">
                <div className="kasse-total-label">Total</div>
                <div className="kasse-total-amount">{state.total}</div>
              </div>

              <div className="kasse-keypad">
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "7" })}>
                  7
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "8" })}>
                  8
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "9" })}>
                  9
                </button>
                <button className="kbtn kbtn-icon" onClick={() => dispatch({ type: "BACKSPACE" })} aria-label="Slet">
                  ⌫
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "CLEAR" })}>
                  C
                </button>

                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "4" })}>
                  4
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "5" })}>
                  5
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "6" })}>
                  6
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "X" })}>
                  X
                </button>
                <button className="kbtn kbtn-icon" onClick={() => dispatch({ type: "KEY", key: "↩" })} aria-label="Tilbage">
                  ↩
                </button>

                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "1" })}>
                  1
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "2" })}>
                  2
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "3" })}>
                  3
                </button>
                <div className="kbtn kbtn-spacer" aria-hidden="true" />
                <div className="kbtn kbtn-spacer" aria-hidden="true" />

                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "0" })}>
                  0
                </button>
                <button className="kbtn" onClick={() => dispatch({ type: "KEY", key: "00" })}>
                  00
                </button>
                <div className="kbtn kbtn-spacer" aria-hidden="true" />
                <div className="kbtn kbtn-spacer" aria-hidden="true" />
                <div className="kbtn kbtn-spacer" aria-hidden="true" />
              </div>

              <div className="kasse-log">
                <div className="kasse-log-title">Log</div>
                <ul>
                  {state.log.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
                <button className="btn btn--ghost" onClick={() => dispatch({ type: "RESET" })}>
                  Nulstil
                </button>
              </div>
            </div>

            <div className="kasse-right">
              <div className="kasse-right-header">
                <div className="kasse-avatar" aria-hidden="true">
                  👤
                </div>
                <div className="kasse-right-user">{state.userName}</div>
              </div>

              <div className="kasse-menu">
                <MenuRow label="Print boner" onClick={() => dispatch({ type: "NAV", to: "PRINT_BONER" })} />
                <MenuRow label="Retur funktioner" onClick={() => dispatch({ type: "NAV", to: "RETUR_MENU" })} />
                <MenuRow label="Manuel retur" onClick={() => dispatch({ type: "NAV", to: "MANUEL_RETUR" })} />
                <MenuRow label="Retur via. original bon" onClick={() => dispatch({ type: "NAV", to: "RETUR_ORIGINAL_BON" })} />
                <MenuRow label="Salgs funktioner" onClick={() => dispatch({ type: "NAV", to: "SALGS_MENU" })} />
                <MenuRow label="Specielle funktioner" onClick={() => dispatch({ type: "NAV", to: "SPECIELLE" })} />
                <MenuRow label="Korrektioner" onClick={() => dispatch({ type: "NAV", to: "KORREKTIONER" })} />
              </div>

              <div className="kasse-danger">
                <button className="kasse-danger-btn" onClick={() => dispatch({ type: "NAV", to: "HOME" })}>
                  Skift sælger
                </button>
                <button className="kasse-danger-btn" onClick={() => dispatch({ type: "RESET" })}>
                  Frameld
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 12 }}>
          (UI-only: Reducer styrer navigation og input, så du kan “klikke rundt” som en kasse.)
        </p>
      </div>
    </div>
  );
}

function MenuRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="kasse-menu-row" onClick={onClick}>
      <span className="kasse-menu-text">{label}</span>
      <span className="kasse-menu-arrow" aria-hidden="true">
        ›
      </span>
    </button>
  );
}
