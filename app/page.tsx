"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- ATMOSPHERIC TEXT ---------------- */

const messages = [
  "still awake?",
  "no new notifications.",
  "the system is quiet.",
  "you are online, but no one is here.",
  "focus drifts slowly.",
  "background processes are active.",
  "time passes without asking.",
  "silence fills the gaps.",
  "nothing urgent is happening.",
  "you are present, but not engaged.",
  "memory cache is cold.",
  "attention is fragmented.",
  "low activity detected.",
  "system idle.",
  "thoughts buffering...",
  "waiting for input.",
  "connection stable but unused.",
  "everything continues without you noticing.",
  "you forgot why you opened this tab.",
  "nothing new since last check.",
  "the moment is still running.",
  "quiet persists.",
];

type Task = {
  text: string;
  done: boolean;
};

/* ---------------- FLOATING MESSAGE ---------------- */

type FloatingMsg = {
  id: number;
  text: string;
  x: number;
  y: number;
};

export default function Home() {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const WORK = 30 * 60;
  const BREAK = 5 * 60;

  const [mode, setMode] = useState<"work" | "break">("work");
  const [pomodoro, setPomodoro] = useState(WORK);
  const [running, setRunning] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const [rainOn, setRainOn] = useState(true);
  const [deepFocus, setDeepFocus] = useState(false);

  /* 🌫 floating background */
  const [bg, setBg] = useState<FloatingMsg[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    audioRef.current = new Audio("/rain.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    audioRef.current.play().catch(() => {});
  }, []);

  /* ---------------- CLOCK ---------------- */

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- POMODORO ---------------- */

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setPomodoro((prev) => {
        if (prev <= 1) {
          const next = mode === "work" ? "break" : "work";
          setMode(next);
          return next === "work" ? WORK : BREAK;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode]);

  /* ---------------- FLOATING BACKGROUND ENGINE ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      const text = messages[Math.floor(Math.random() * messages.length)];

      const newMsg: FloatingMsg = {
        id: Date.now() + Math.random(),
        text,
        x: Math.random() * 90, // %
        y: Math.random() * 90, // %
      };

      setBg((prev) => [...prev, newMsg].slice(-40));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- DEEP FOCUS AUTO START ---------------- */

  useEffect(() => {
    if (deepFocus) setRunning(true);
  }, [deepFocus]);

  /* ---------------- FORMAT ---------------- */

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ---------------- RAIN ---------------- */

  const toggleRain = async () => {
    setRainOn((prev) => {
      const next = !prev;

      if (audioRef.current) {
        if (next) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }

      return next;
    });
  };

  /* ---------------- TASKS ---------------- */

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks((p) => [...p, { text: taskInput, done: false }]);
    setTaskInput("");
  };

  const toggleTask = (i: number) => {
    setTasks((p) =>
      p.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t))
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <main
      style={{
        position: "relative",
        height: "100vh",
        background: "black",
        color: "white",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 🌧 RAIN */}
      {rainOn && <div className="rain" />}

      {/* 🌫 FLOATING TEXT (FULL SCREEN RANDOM) */}
      {!deepFocus &&
        bg.map((m) => (
          <div
            key={m.id}
            style={{
              position: "absolute",
              left: `${m.x}%`,
              top: `${m.y}%`,
              fontSize: 12,
              opacity: 0.12,
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
            }}
          >
            {m.text}
          </div>
        ))}

      {/* ================= DEEP FOCUS ================= */}

      {deepFocus ? (
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <div style={{ opacity: 0.4, fontSize: 12 }}>
            deep focus mode
          </div>

          <div style={{ fontSize: 64 }}>{format(pomodoro)}</div>

          <div style={{ opacity: 0.4 }}>{mode.toUpperCase()}</div>

          <button onClick={() => setRunning((r) => !r)}>
            {running ? "pause" : "start"}
          </button>

          <button onClick={() => setDeepFocus(false)}>
            exit focus
          </button>
        </div>
      ) : (
        /* ================= NORMAL ================= */

        <div style={{ textAlign: "center", zIndex: 10 }}>
          <h1 style={{ fontSize: 32, fontWeight: 300 }}>
            quiet room
          </h1>

          <p style={{ opacity: 0.75 }}>let's focus</p>

          <div style={{ opacity: 0.4 }}>{time}</div>

          <div style={{ opacity: 0.6 }}>
            {mode.toUpperCase()} — {format(pomodoro)}
          </div>

          <button onClick={() => setRunning((r) => !r)}>
            {running ? "pause" : "start"}
          </button>

          <button onClick={() => setDeepFocus(true)}>
            deep focus
          </button>

          <button onClick={toggleRain}>
            turn {rainOn ? "off" : "on"} rain
          </button>

          {/* TASKS */}
          <div style={{ marginTop: 20, width: 260, textAlign: "left" }}>
            <div style={{ opacity: 0.4, fontSize: 12 }}>tasks</div>

            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="add task..."
                style={{
                  flex: 1,
                  padding: 8,
                  fontSize: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button onClick={addTask}>+</button>
            </div>

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
    </main>
  );
}