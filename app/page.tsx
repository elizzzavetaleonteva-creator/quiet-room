"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- PHRASES (25) ---------------- */

const messages = [
  "breathe",
  "stay here",
  "you are safe",
  "focus returns",
  "quiet mind",
  "no rush",
  "observe",
  "let it pass",
  "just continue",
  "soft silence",
  "reset",
  "you are present",
  "nothing urgent",
  "one step",
  "keep going",
  "slow down",
  "be still",
  "it’s okay",
  "trust the process",
  "you’re doing fine",
  "calm space",
  "let go",
  "return",
  "focus again",
  "now",
];

/* ---------------- TYPES ---------------- */

type Floating = {
  id: number;
  text: string;
  x: number;
  y: number;
};

type Task = {
  text: string;
  done: boolean;
};

export default function Home() {
  /* ---------------- STATE ---------------- */

  const [rainOn, setRainOn] = useState(false);
  const [deepFocus, setDeepFocus] = useState(false);

  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const [floating, setFloating] = useState<Floating[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setTime((p) => (p > 0 ? p - 1 : 0));
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

  /* ---------------- FLOATING TEXT ---------------- */

  useEffect(() => {
    if (deepFocus) return; // 🚫 ключевая блокировка

    const interval = setInterval(() => {
      const id = Date.now() + Math.random();

      setFloating((prev) =>
        [
          ...prev,
          {
            id,
            text: messages[Math.floor(Math.random() * messages.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
          },
        ].slice(-60)
      );

      setTimeout(() => {
        setFloating((prev) => prev.filter((f) => f.id !== id));
      }, 6000);
    }, 900);

    return () => clearInterval(interval);
  }, [deepFocus]);

  /* ---------------- CLEANUP ON DEEP FOCUS ---------------- */

  useEffect(() => {
    if (deepFocus) {
      setFloating([]); // сразу чистим экран
    }
  }, [deepFocus]);

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

  /* ---------------- RAIN ---------------- */

  const toggleRain = () => {
    setRainOn((prev) => {
      const next = !prev;
      const audio = audioRef.current;

      if (audio) {
        if (next) {
          audio.volume = 0.4;
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }

      return next;
    });
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
      {/* AUDIO */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/rain.mp3" type="audio/mpeg" />
      </audio>

      {/* RAIN VISUAL */}
      {rainOn && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 3px, rgba(255,255,255,0.07) 4px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* FLOATING TEXT */}
      {floating.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: 13,
            opacity: 0.2,
            color: "rgba(255,255,255,0.7)",
            pointerEvents: "none",
          }}
        >
          {m.text}
        </div>
      ))}

      {/* CENTER */}
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

        {/* DEEP FOCUS */}
        {deepFocus ? (
          <>
            <div style={{ fontSize: 44 }}>{format(time)}</div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRunning(true)}>start</button>
              <button onClick={() => setRunning(false)}>pause</button>
              <button onClick={() => setTime(30 * 60)}>reset</button>
            </div>

            <button onClick={() => setDeepFocus(false)}>
              exit deep focus
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28 }}>{format(time)}</div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRunning(true)}>start</button>
              <button onClick={() => setRunning(false)}>pause</button>
              <button onClick={() => setTime(30 * 60)}>reset</button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={toggleRain}>
                {rainOn ? "TURN OFF RAIN" : "TURN ON RAIN"}
              </button>

              <button onClick={() => setDeepFocus(true)}>
                deep focus
              </button>
            </div>

            {/* TASKS */}
            <div
              style={{
                marginTop: 20,
                width: 320,
                background: "rgba(255,255,255,0.05)",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="add task..."
                  style={{ flex: 1 }}
                />
                <button onClick={addTask}>+</button>
              </div>

              {tasks.map((t, i) => (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  style={{
                    marginTop: 6,
                    textDecoration: t.done ? "line-through" : "none",
                    opacity: t.done ? 0.4 : 1,
                    cursor: "pointer",
                  }}
                >
                  {t.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}