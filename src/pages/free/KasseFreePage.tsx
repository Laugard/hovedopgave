import React, { useMemo, useReducer, useState } from "react";

type Screen =
  | "HOME"
  | "RETUR_MENU"
  | "MANUEL_RETUR"
  | "RETUR_ORIGINAL_BON"
  | "PRINT_BONER";

type Action =
  | { type: "NAVIGATE"; to: Screen }
  | { type: "KEYPAD"; key: string }
  | { type: "CLEAR" }
  | { type: "BACK" }
  | { type: "RESET" };

type State = {
  screen: Screen;
  input: string;
  lastAction?: string;
};

const initialState: State = {
  screen: "HOME",
  input: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, screen: action.to, lastAction: `NAVIGATE:${action.to}` };
    case "KEYPAD": {
      const next = (state.input + action.key).slice(0, 12);
      return { ...state, input: next, lastAction: `KEYPAD:${action.key}` };
    }
    case "CLEAR":
      return { ...state, input: "", lastAction: "CLEAR" };
    case "BACK":
      return { ...state, input: state.input.slice(0, -1), lastAction: "BACK" };
    case "RESET":
      return { ...initialState, lastAction: "RESET" };
    default:
      return state;
  }
}

type GuideStep = {
  title: string;
  hint: string;
  expect: (a: Action, s: State) => boolean;
};

export function KasseFreePage() {
  const [mode, setMode] = useState<"FREE" | "GUIDED">("FREE");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const steps: GuideStep[] = useMemo(
    () => [
      {
        title: "Åbn Retur funktioner",
        hint: "Klik på 'Retur funktioner' i menuen til højre.",
        expect: (a) => a.type === "NAVIGATE" && a.to === "RETUR_MENU",
      },
      {
        title: "Vælg Manuel retur",
        hint: "Klik på 'Manuel retur'.",
        expect: (a) => a.type === "NAVIGATE" && a.to === "MANUEL_RETUR",
      },
      {
        title: "Indtast beløb",
        hint: "Tryk fx 4 0 0 på tastaturet.",
        expect: (a) => a.type === "KEYPAD",
      },
      {
        title: "Nulstil træning",
        hint: "Tryk 'C' for at rydde input.",
        expect: (a) => a.type === "CLEAR",
      },
    ],
    []
  );

  const currentStep = steps[stepIndex];

  function guidedDispatch(a: Action) {
    if (mode === "FREE") {
      setError("");
      dispatch(a);
      return;
    }

    // GUIDED
    if (!currentStep) {
      setError("");
      dispatch(a);
      return;
    }

    const ok = currentStep.expect(a, state);
    if (!ok) {
      setError(`Forkert handling. ${currentStep.hint}`);
      // vi udfører stadig action? typisk nej - for læring stopper vi den
      return;
    }

    setError("");
    dispatch(a);

    // Step-advance efter "logiske" actions
    // For keypad-step: avancer efter 3 tastetryk, så det føles realistisk
    if (stepIndex === 2 && a.type === "KEYPAD") {
      const nextLen = (state.input + a.key).length;
      if (nextLen >= 3) setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      return;
    }

    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  const menuItems: Array<{ label: string; to: Screen }> = [
    { label: "Print boner", to: "PRINT_BONER" },
    { label: "Retur funktioner", to: "RETUR_MENU" },
    { label: "Manuel retur", to: "MANUEL_RETUR" },
    { label: "Retur via. original bon", to: "RETUR_ORIGINAL_BON" },
  ];

  return (
    <div>
      <h1>Kasse – fri træning</h1>
      <p className="muted">
        Digital kasse (mock). Træning kører isoleret og påvirker ikke rigtige systemer.
      </p>

      <div className="panel">
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <strong>Mode:</strong>
          <button
            className={`btn ${mode === "FREE" ? "btn--primary" : "btn--ghost"}`}
            onClick={() => {
              setMode("FREE");
              setError("");
            }}
          >
            Fri træning
          </button>
          <button
            className={`btn ${mode === "GUIDED" ? "btn--primary" : "btn--ghost"}`}
            onClick={() => {
              setMode("GUIDED");
              setStepIndex(0);
              setError("");
              dispatch({ type: "RESET" });
            }}
          >
            Guidet træning
          </button>

          {mode === "GUIDED" ? (
            <button
              className="btn btn--ghost"
              onClick={() => {
                setStepIndex(0);
                setError("");
                dispatch({ type: "RESET" });
              }}
              style={{ marginLeft: "auto" }}
            >
              Nulstil
            </button>
          ) : null}
        </div>

        {mode === "GUIDED" ? (
          <div className="panel" style={{ marginBottom: 14 }}>
            <h2>Trin {stepIndex + 1} / {steps.length}: {currentStep?.title}</h2>
            <p className="muted">{currentStep?.hint}</p>
            {error ? <div className="form-error">{error}</div> : null}
          </div>
        ) : null}

        <CashRegisterUI
          screen={state.screen}
          input={state.input}
          menuItems={menuItems}
          onMenu={(to) => guidedDispatch({ type: "NAVIGATE", to })}
          onKey={(k) => guidedDispatch({ type: "KEYPAD", key: k })}
          onBack={() => guidedDispatch({ type: "BACK" })}
          onClear={() => guidedDispatch({ type: "CLEAR" })}
        />
      </div>
    </div>
  );
}

function CashRegisterUI(props: {
  screen: Screen;
  input: string;
  menuItems: Array<{ label: string; to: Screen }>;
  onMenu: (to: Screen) => void;
  onKey: (k: string) => void;
  onBack: () => void;
  onClear: () => void;
}) {
  const { screen, input, menuItems, onMenu, onKey, onBack, onClear } = props;

  return (
    <div className="kasse-wrap" aria-label="Kasse simulator (UI mock)">
      <div className="kasse-topbar">
        <div className="kasse-topbar-left">
          <span>Butiks nr. 5257</span>
          <span>Kasserer 660</span>
          <span>Terminal 45</span>
        </div>
        <div className="kasse-topbar-right">
          <span>Skærm: {screen}</span>
          <span>21.12.2025, 22.11</span>
        </div>
      </div>

      <div className="kasse-main">
        <div className="kasse-left">
          <div className="kasse-left-header">
            <div className="kasse-user">
              <div className="kasse-user-name">LAUGE</div>
              <div className="kasse-user-sub">*</div>
            </div>
          </div>

          <div className="kasse-totalbar">
            <div className="kasse-total-label">Input</div>
            <div className="kasse-total-amount">{input || "—"}</div>
          </div>

          <div className="kasse-keypad">
            {["7","8","9"].map((k) => <button key={k} className="kbtn" onClick={() => onKey(k)}>{k}</button>)}
            <button className="kbtn kbtn-icon" onClick={onBack} aria-label="Slet">⌫</button>
            <button className="kbtn" onClick={onClear}>C</button>

            {["4","5","6"].map((k) => <button key={k} className="kbtn" onClick={() => onKey(k)}>{k}</button>)}
            <button className="kbtn" onClick={() => onKey("X")}>X</button>
            <button className="kbtn kbtn-icon" onClick={() => onKey("↩")} aria-label="Tilbage">↩</button>

            {["1","2","3"].map((k) => <button key={k} className="kbtn" onClick={() => onKey(k)}>{k}</button>)}
            <button className="kbtn kbtn-spacer" tabIndex={-1} aria-hidden="true" />
            <button className="kbtn kbtn-spacer" tabIndex={-1} aria-hidden="true" />

            <button className="kbtn" onClick={() => onKey("0")}>0</button>
            <button className="kbtn" onClick={() => onKey("00")}>00</button>
            <button className="kbtn kbtn-spacer" tabIndex={-1} aria-hidden="true" />
            <button className="kbtn kbtn-spacer" tabIndex={-1} aria-hidden="true" />
            <button className="kbtn kbtn-spacer" tabIndex={-1} aria-hidden="true" />
          </div>
        </div>

        <div className="kasse-right">
          <div className="kasse-right-header">
            <div className="kasse-avatar" aria-hidden="true">👤</div>
            <div className="kasse-right-user">LAUGE</div>
          </div>

          <div className="kasse-menu">
            {menuItems.map((m) => (
              <button key={m.label} className="kasse-menu-row" onClick={() => onMenu(m.to)}>
                <span className="kasse-menu-text">{m.label}</span>
                <span className="kasse-menu-arrow" aria-hidden="true">›</span>
              </button>
            ))}
          </div>

          <div className="kasse-danger">
            <button className="kasse-danger-btn">Skift sælger</button>
            <button className="kasse-danger-btn">Frameld</button>
          </div>
        </div>
      </div>
    </div>
  );
}
