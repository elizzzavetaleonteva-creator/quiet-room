"use client";

import { useEffect, useState } from "react";

/* ---------------- TEXTS ---------------- */

const messages = [
  "stay here",
  "breathe",
  "focus returns",
  "no distractions",
  "you are present",
  "quiet mind",
  "keep going",
  "observe",
  "reset",
  "calm state",
  "just continue",
  "soft silence",
  "you are okay",
  "work gently",
  "nothing urgent",
];

/* ---------------- TYPES ---------------- */

type Task = {
  text: string;
  done: boolean;
};

export default function Home() {
  /* ---------------- STATE ---------------- */

  const [message, setMessage] = useState("");
  const [rain, setRain] = useState(true);
  const [deepFocus, setDeepFocus] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(false);

  /* ---------------- INIT MESSAGE ---------------- */

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

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
        width: "100vw",
        height: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ---------------- RAIN ---------------- */}

      {rain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 3px, rgba(255,255,255,0.06) 4px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ---------------- CENTER ---------------- */}

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
        <h1 style={{ fontWeight: 300 }}>let’s focus</h1>

        <p style={{ opacity: 0.7 }}>{message}</p>

        {/* TIMER */}

        <div style={{ fontSize: 28 }}>
          {format(time)}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setRunning(true)}>start</button>
          <button onClick={() => setRunning(false)}>pause</button>
          <button onClick={() => setTime(30 * 60)}>reset</button>
        </div>

        {/* CONTROLS */}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setRain((r) => !r)}>
            rain: {rain ? "on" : "off"}
          </button>

          <button onClick={() => setDeepFocus((d) => !d)}>
            deep focus: {deepFocus ? "on" : "off"}
          </button>
        </div>

        {/* TASKS */}

        {!deepFocus && (
          <div
            style={{
              marginTop: 20,
              width: 320,
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
                  border: "1px solid rgba(255,255,255,0.2)",
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
                    fontSize: 13,
                    marginTop: 6,
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