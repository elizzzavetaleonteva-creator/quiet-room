"use client";

import { useEffect, useState } from "react";

/* ---------------- BACKGROUND MESSAGES ---------------- */

const messages = [
  "still awake?",
  "breathe in",
  "focus returns",
  "no distractions",
  "you are here",
  "quiet system",
  "time passes",
  "stay present",
  "nothing urgent",
  "attention drifting",
  "calm environment",
  "processing...",
  "idle state",
  "background noise",
  "let it pass",
  "observe",
  "reset focus",
  "silence active",
  "you are online",
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
  const [message, setMessage] = useState("");
  const [bg, setBg] = useState<Floating[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  /* ---------------- INIT MESSAGE ---------------- */

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  /* ---------------- FLOATING TEXT ENGINE ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      const newMsg: Floating = {
        id: Date.now() + Math.random(),
        text: messages[Math.floor(Math.random() * messages.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: 0,
      };

      setBg((prev) => [...prev, newMsg].slice(-30));

      // плавное появление
      setTimeout(() => {
        setBg((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, opacity: 0.18 } : m
          )
        );
      }, 50);

      // плавное исчезновение
      setTimeout(() => {
        setBg((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, opacity: 0 } : m
          )
        );
      }, 4000);

      // удаление
      setTimeout(() => {
        setBg((prev) => prev.filter((m) => m.id !== newMsg.id));
      }, 5000);
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

  return (
    <main
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: "black",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* ---------------- BACKGROUND ---------------- */}

      {bg.map((m) => (
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
            color: "white",
            whiteSpace: "nowrap",
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

        {/* ---------------- TASKS ---------------- */}

        <div
          style={{
            marginTop: 20,
            width: 280,
            background: "rgba(255,255,255,0.06)",
            padding: 12,
            borderRadius: 8,
            backdropFilter: "blur(6px)",
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
                fontSize: 12,
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
                  fontSize: 12,
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
      </div>
    </main>
  );
}