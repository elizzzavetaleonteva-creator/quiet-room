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

const timerOptions = [15, 30, 45, 60];

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

  // Точное время, когда таймер должен закончиться
  const [endTime, setEndTime] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("focus-tasks");

    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [floating, setFloating] = useState<Floating[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const buttonStyle = {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.75)",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 12,
    letterSpacing: 1,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const iconButtonStyle = {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.45)",
    cursor: "pointer",
    fontSize: 16,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  /* TIMER */

  useEffect(() => {
    if (!running || endTime === null) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setTime(remaining);

      if (remaining <= 0) {
        setRunning(false);
        setEndTime(null);
      }
    };

    // Обновляем сразу
    updateTimer();

    // Интервал теперь только обновляет экран.
    // Он НЕ отвечает за течение времени.
    const interval = window.setInterval(updateTimer, 250);

    return () => window.clearInterval(interval);
  }, [running, endTime]);

  const format = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${restSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (time <= 0) {
      const seconds = focusMinutes * 60;

      setTime(seconds);
      setEndTime(Date.now() + seconds * 1000);
    } else {
      setEndTime(Date.now() + time * 1000);
    }

    setRunning(true);
  };

  const pauseTimer = () => {
    if (endTime !== null) {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setTime(remaining);
    }

    setEndTime(null);
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setEndTime(null);
    setTime(focusMinutes * 60);
  };

  /* FLOATING TEXT */

  useEffect(() => {
    if (deepFocus) {
      setFloating([]);
      return;
    }

    const interval = setInterval(() => {
      setFloating((previous) => {
        let newMessage: Floating | null = null;

        for (let i = 0; i < 10; i++) {
          const candidate = {
            id: Date.now() + Math.random(),
            text: messages[
              Math.floor(Math.random() * messages.length)
            ],
            x: Math.random() * 100,
            y: Math.random() * 100,
          };

          const tooClose = previous.some((item) => {
            const dx = item.x - candidate.x;
            const dy = item.y - candidate.y;

            return Math.sqrt(dx * dx + dy * dy) < 12;
          });

          if (!tooClose) {
            newMessage = candidate;
            break;
          }
        }

        if (!newMessage) return previous;

        return [...previous, newMessage].slice(-40);
      });
    }, 1200);

    return () => clearInterval(interval);
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

    setTasks((previous) => [
      ...previous,
      {
        id: Date.now(),
        text: input,
        done: false,
      },
    ]);

    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks((previous) =>
      previous.map((task) =>
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
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.done) - Number(b.done)
  );

  const toggleRain = () => {
    setRainOn((previous) => {
      const next = !previous;

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
        floating.map((item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: 0.12,
              fontSize: 13,
              letterSpacing: 0.5,
              pointerEvents: "none",
            }}
          >
            {item.text}
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
          gap: 14,
        }}
      >
        {/* DEEP FOCUS MODE */}
        {deepFocus ? (
          <>
            <div
              style={{
                fontSize: 13,
                letterSpacing: 6,
                textTransform: "uppercase",
                opacity: 0.45,
              }}
            >
              Slow Hours
            </div>

            <div
              style={{
                fontSize: 82,
                fontWeight: 200,
                letterSpacing: 2,
              }}
            >
              {format(time)}
            </div>

            <button
              onClick={() => setDeepFocus(false)}
              style={{
                ...buttonStyle,
                marginTop: 30,
                opacity: 0.5,
              }}
            >
              exit deep focus
            </button>
          </>
        ) : (
          /* NORMAL MODE */
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

            {/* TIMER PRESETS */}
            {!running && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                {timerOptions.map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setFocusMinutes(minutes);
                      setTime(minutes * 60);
                      setEndTime(null);
                    }}
                    style={{
                      width: 42,
                      height: 30,
                      borderRadius: 15,
                      cursor: "pointer",
                      color: "#fff",
                      border:
                        focusMinutes === minutes
                          ? "1px solid rgba(255,255,255,0.5)"
                          : "1px solid rgba(255,255,255,0.15)",
                      background:
                        focusMinutes === minutes
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {minutes}
                  </button>
                ))}
              </div>
            )}

            {/* TIMER BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button
                onClick={startTimer}
                style={buttonStyle}
              >
                start
              </button>

              <button
                onClick={pauseTimer}
                style={buttonStyle}
              >
                pause
              </button>

              <button
                onClick={resetTimer}
                style={buttonStyle}
              >
                reset
              </button>
            </div>

            {/* CONTROLS */}
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button
                onClick={toggleRain}
                style={buttonStyle}
              >
                {rainOn ? "rain on" : "rain"}
              </button>

              <button
                style={buttonStyle}
                onClick={() => {
                  if (!running) {
                    startTimer();
                  }

                  setDeepFocus(true);
                }}
              >
                deep focus
              </button>
            </div>

            {/* TASKS */}
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
              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                  placeholder="add task..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
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
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                      opacity: task.done ? 0.4 : 1,
                      textDecoration: task.done
                        ? "line-through"
                        : "none",
                    }}
                  >
                    <span
                      onClick={() => toggleTask(task.id)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {task.text}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
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