"use client";

import { useEffect, useRef, useState } from "react";

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

type Task = {
  text: string;
  done: boolean;
};

type Floating = {
  id: number;
  text: string;
  x: number;
  y: number;
};

export default function Home() {
  const [deepFocus, setDeepFocus] = useState(false);
  const [rainOn, setRainOn] = useState(false);

  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("quiet-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [floating, setFloating] = useState<Floating[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* TIMER */
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  /* SAVE TASKS */
  useEffect(() => {
    localStorage.setItem("quiet-tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* FLOATING TEXT */
  useEffect(() => {
    if (deepFocus) {
      setFloating([]);
      return;
    }

    const id = setInterval(() => {
      setFloating((prev) => {
        const next = {
          id: Date.now() + Math.random(),
          text: messages[Math.floor(Math.random() * messages.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
        };

        return [...prev, next].slice(-40);
      });
    }, 1200);

    return () => clearInterval(id);
  }, [deepFocus]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;

    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const addTask = () => {
    if (!input.trim()) return;
    setTasks((p) => [...p, { text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (index: number) => {
    setTasks((prev) => {
      const updated = prev.map((t, i) =>
        i === index ? { ...t, done: !t.done } : t
      );

      return [
        ...updated.filter((t) => !t.done),
        ...updated.filter((t) => t.done),
      ];
    });
  };

  const toggleRain = () => {
    setRainOn((prev) => {
      const next = !prev;

      if (audioRef.current) {
        if (next) {
          audioRef.current.volume = 0.4;
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }

      return next;
    });
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "#000",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <audio ref={audioRef} loop>
        <source src="/rain.mp3" type="audio/mpeg" />
      </audio>

      {/* RAIN VISUAL */}
      {rainOn && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 3px, rgba(255,255,255,0.06) 4px)",
          }}
        />
      )}

      {/* FLOATING TEXT */}
      {!deepFocus &&
        floating.map((f) => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: 0.2,
              fontSize: 14,
              pointerEvents: "none",
            }}
          >
            {f.text}
          </div>
        ))}

      {/* CENTER UI */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ fontWeight: 300 }}>let's focus</h1>

        <div style={{ fontSize: deepFocus ? 54 : 32 }}>
          {format(time)}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setRunning(true)}>start</button>
          <button onClick={() => setRunning(false)}>pause</button>
          <button onClick={() => setTime(30 * 60)}>reset</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={toggleRain}>
            {rainOn ? "TURN OFF RAIN" : "TURN ON RAIN"}
          </button>

          <button onClick={() => setDeepFocus((p) => !p)}>
            {deepFocus ? "exit focus" : "deep focus"}
          </button>
        </div>

        {!deepFocus && (
          <div
            style={{
              width: 340,
              marginTop: 20,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: 14,
              borderRadius: 12,
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

            <div style={{ marginTop: 10 }}>
              {tasks.map((t, i) => (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  style={{
                    marginTop: 8,
                    cursor: "pointer",
                    opacity: t.done ? 0.4 : 1,
                    textDecoration: t.done ? "line-through" : "none",
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