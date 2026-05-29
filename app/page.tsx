"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- BACKGROUND MESSAGES ---------------- */

const messages = [
  "stay here",
  "breathe in",
  "focus returns",
  "no distractions",
  "you are present",
  "quiet mind",
  "time flows",
  "keep going",
  "soft silence",
  "observe",
  "reset",
  "nothing urgent",
  "calm state",
  "attention drifting",
  "come back",
  "you are safe",
  "work gently",
  "focus mode",
  "still here",
  "continue",
];

type Floating = {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
};

type Task = {
  text: string;
  done: boolean;
};

export default function Home() {
  /* ---------------- STATE ---------------- */

  const [message, setMessage] = useState("");
  const [floating, setFloating] = useState<Floating[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const [rain, setRain] = useState(false);
  const [deepFocus, setDeepFocus] = useState(false);

  /* ---------------- POMODORO (30 MIN) ---------------- */

  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setSecondsLeft(30 * 60);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  /* ---------------- BACKGROUND FLOW ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      const item: Floating = {
        id: Date.now() + Math.random(),
        text: messages[Math.floor(Math.random() * messages.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0,
      };

      setFloating((prev) => [...prev, item].slice(-40));

      setTimeout(() => {
        setFloating((prev) =>
          prev.map((m) =>
            m.id === item.id ? { ...m, opacity: 0.18 } : m
          )
        );
      }, 50);

      setTimeout(() => {
        setFloating((prev) =>
          prev.map((m) =>
            m.id === item.id ? { ...m, opacity: 0 } : m
          )
        );
      }, 3500);

      setTimeout(() => {
        setFloating((prev) => prev.filter((m) => m.id !== item.id));
      }, 4500);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- TASKS ---------------- */

  const addTask = () => {
    if (!input.trim()) return;
    setTasks((p) => [...p, { text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (i: number) => {
    setTasks((p) =>
      p.map((t, idx) =>
        idx === i ? { ...t, done: !t.done } : t
      )
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <main
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: "#000",
        color: "#fff",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* ---------------- RAIN (visual only placeholder) ---------------- */}

      {rain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.03) 3px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ---------------- FLOATING TEXT ---------------- */}

      {floating.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: 12,
            opacity: m.opacity,
            transition: "opacity 1.5s ease",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            color: "white",
          }}
        >
          {m.text}
        </div>
      ))}

      {/* ---------------- CENTER UI ---------------- */}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 300 }}>
          let’s focus
        </h1>

        <p style={{ opacity: 0.7 }}>{message}</p>

        {/* TIMER */}

        <div style={{ fontSize: 28, marginTop: 10 }}>
          {formatTime(secondsLeft)}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={startTimer}>start</button>
          <button onClick={resetTimer}>reset</button>
        </div>

        {/* CONTROLS */}

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={() => setRain((r) => !r)}>
            {rain ? "turn rain off" : "turn rain on"}
          </button>

          <button onClick={() => setDeepFocus((d) => !d)}>
            {deepFocus ? "exit deep focus" : "deep focus"}
          </button>
        </div>

        {/* TASKS (hidden in deep focus) */}

        {!deepFocus && (
          <div
            style={{
              marginTop: 20,
              width: 300,
              background: "rgba(255,255,255,0.06)",
              padding: 12,
              borderRadius: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="add task..."
                style={{
                  flex: 1,
                  padding: 8,
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              />
              <button onClick={addTask}>+</button>
            </div>

            <div style={{ marginTop: 10 }}>
              {tasks.map((t, i) => (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    opacity: t.done ? 0.4 : 0.9,
                    textDecoration: t.done ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                >
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}