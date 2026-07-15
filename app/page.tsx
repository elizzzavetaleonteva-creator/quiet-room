"use client";

import { useEffect, useRef, useState } from "react";

const messages = [
  "the hallway never ends",
  "someone forgot this room",
  "the lights stay on after midnight",
  "nothing has happened here for years",
  "the elevator is still waiting",
  "the rain arrives before the storm",
  "you have been here before",
  "the clock stopped caring",
  "the building is asleep",
  "the last train already left",
  "nobody remembers why the light is on",
  "the air feels familiar",
  "the corridor continues",
  "the room is quieter than yesterday",
  "there is no audience",
  "the city is far away now",
  "some windows never go dark",
  "the silence belongs here",
  "the walls are listening to nothing",
  "time moves differently inside",
  "you can stay as long as you need",
  "the outside world is buffering",
  "the static fades",
  "everything is temporarily suspended",
  "the room remains open",
];

type Task = {
  id: number;
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

  const [focusMinutes, setFocusMinutes] = useState(30);
  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("focus-tasks");

    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [floating, setFloating] = useState<Floating[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const iconButtonStyle = {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  /* TIMER */
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const format = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /* FLOATING TEXT */
  useEffect(() => {
    if (deepFocus) {
      setFloating([]);
      return;
    }

    const id = setInterval(() => {
      setFloating((prev) => {
        let next: Floating | null = null;

        for (let i = 0; i < 10; i++) {
          const candidate: Floating = {
            id: Date.now() + Math.random(),
            text: messages[Math.floor(Math.random() * messages.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
          };

          const tooClose = prev.some((item) => {
            const dx = item.x - candidate.x;
            const dy = item.y - candidate.y;

            return Math.sqrt(dx * dx + dy * dy) < 12;
          });

          if (!tooClose) {
            next = candidate;
            break;
          }
        }

        if (!next) return prev;

        return [...prev, next].slice(-40);
      });
    }, 1200);

    return () => clearInterval(id);
  }, [deepFocus]);

  /* SAVE TASKS */
  useEffect(() => {
    localStorage.setItem(
      "focus-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: input,
        done: false,
      },
    ]);

    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.done) - Number(b.done)
  );

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
      <audio ref={audioRef} loop preload="auto">
        <source src="/rain.mp3" type="audio/mpeg" />
      </audio>

      {/* RAIN */}
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

      {/* UI */}
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

        {deepFocus ? (
          <>
            <div
              style={{
                fontSize: 13,
                letterSpacing: 6,
                textTransform: "uppercase",
                opacity: 0.45,
                fontWeight: 500,
              }}
            >
              Slow Hours
            </div>

            <div
              style={{
                fontSize: 80,
                fontWeight: 200,
                letterSpacing: 2,
              }}
            >
              {format(time)}
            </div>

            <button
              onClick={() => setDeepFocus(false)}
              style={{
                marginTop: 30,
                opacity: 0.5,
              }}
            >
              exit deep focus
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  opacity: 0.45,
                  fontWeight: 500,
                }}
              >
                Slow Hours
              </div>

              <h1
                style={{
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                let's focus
              </h1>
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 200,
              }}
            >
              {format(time)}
            </div>


            {!running && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span>focus:</span>

                <input
                  type="number"
                  min={1}
                  max={180}
                  value={focusMinutes || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!value) {
                      setFocusMinutes(0);
                      return;
                    }

                    setFocusMinutes(value);
                    setTime(value * 60);
                  }}
                  style={{
                    width: 60,
                    textAlign: "center",
                  }}
                />

                <span>min</span>
              </div>
            )}


            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button
                onClick={() => setRunning(true)}
              >
                start
              </button>

              <button
                onClick={() => setRunning(false)}
              >
                pause
              </button>

              <button
                onClick={() => {
                  setRunning(false);
                  setTime(focusMinutes * 60);
                }}
              >
                reset
              </button>
            </div>


            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button onClick={toggleRain}>
                {rainOn
                  ? "TURN OFF RAIN"
                  : "TURN ON RAIN"}
              </button>

              <button
                onClick={() => {
                  setRunning(true);
                  setDeepFocus(true);
                }}
              >
                deep focus
              </button>
            </div>


            <div
              style={{
                width: 340,
                marginTop: 20,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(12px)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                padding: 14,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <input
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="add task..."
                  style={{
                    flex: 1,
                  }}
                />

                <button
                  onClick={addTask}
                  style={iconButtonStyle}
                >
                  +
                </button>
              </div>


              <div
                style={{
                  marginTop: 10,
                }}
              >
                {sortedTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginTop: 8,
                      opacity: task.done
                        ? 0.4
                        : 1,
                      textDecoration:
                        task.done
                          ? "line-through"
                          : "none",
                    }}
                  >
                    <span
                      onClick={() =>
                        toggleTask(task.id)
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {task.text}
                    </span>

                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      style={iconButtonStyle}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}