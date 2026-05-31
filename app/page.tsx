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
const [deepFocus, setDeepFocus] = useState(false);
const [rainOn, setRainOn] = useState(false);

const [time, setTime] = useState(30 * 60);
const [running, setRunning] = useState(false);

const [tasks, setTasks] = useState<Task[]>(() => {
if (typeof window === "undefined") return [];

```
const saved = localStorage.getItem("quiet-room-tasks");
return saved ? JSON.parse(saved) : [];
```

});

const [input, setInput] = useState("");

const [floating, setFloating] = useState<Floating[]>([]);

const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
localStorage.setItem(
"quiet-room-tasks",
JSON.stringify(tasks)
);
}, [tasks]);

useEffect(() => {
if (!running) return;

```
const interval = setInterval(() => {
  setTime((t) => (t > 0 ? t - 1 : 0));
}, 1000);

return () => clearInterval(interval);
```

}, [running]);

useEffect(() => {
if (deepFocus) {
setFloating([]);
return;
}

```
const interval = setInterval(() => {
  const id = Date.now() + Math.random();

  setFloating((prev) => [
    ...prev,
    {
      id,
      text:
        messages[
          Math.floor(Math.random() * messages.length)
        ],
      x: Math.random() * 100,
      y: Math.random() * 100,
    },
  ].slice(-60));
}, 1200);

return () => clearInterval(interval);
```

}, [deepFocus]);

const format = (s: number) => {
const m = Math.floor(s / 60);
const sec = s % 60;

```
return `${m.toString().padStart(2, "0")}:${sec
  .toString()
  .padStart(2, "0")}`;
```

};

const addTask = () => {
if (!input.trim()) return;

```
setTasks((prev) => [
  ...prev,
  {
    text: input,
    done: false,
  },
]);

setInput("");
```

};

const toggleTask = (index: number) => {
setTasks((prev) => {
const updated = prev.map((task, i) =>
i === index
? { ...task, done: !task.done }
: task
);

```
  return [
    ...updated.filter((t) => !t.done),
    ...updated.filter((t) => t.done),
  ];
});
```

};

const toggleRain = () => {
setRainOn((prev) => {
const next = !prev;

```
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
```

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
> <audio ref={audioRef} loop preload="auto"> <source src="/rain.mp3" type="audio/mpeg" /> </audio>

```
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

  {!deepFocus &&
    floating.map((item) => (
      <div
        key={item.id}
        style={{
          position: "absolute",
          left: `${item.x}%`,
          top: `${item.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: 0.15,
          fontSize: 14,
          pointerEvents: "none",
          animation: "fade 12s linear",
        }}
      >
        {item.text}
      </div>
    ))}

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
    <h1
      style={{
        fontWeight: 300,
        letterSpacing: 2,
      }}
    >
      let’s focus
    </h1>

    {deepFocus ? (
      <>
        <div
          style={{
            fontSize: 54,
            fontWeight: 200,
          }}
        >
          {format(time)}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => setRunning(true)}>
            start
          </button>

          <button onClick={() => setRunning(false)}>
            pause
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setTime(30 * 60);
            }}
          >
            reset
          </button>
        </div>

        <button
          onClick={() => setDeepFocus(false)}
        >
          exit deep focus
        </button>
      </>
    ) : (
      <>
        <div
          style={{
            fontSize: 34,
            fontWeight: 200,
          }}
        >
          {format(time)}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => setRunning(true)}>
            start
          </button>

          <button onClick={() => setRunning(false)}>
            pause
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setTime(30 * 60);
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
            onClick={() => setDeepFocus(true)}
          >
            DEEP FOCUS
          </button>
        </div>

        <div
          style={{
            width: 340,
            marginTop: 20,
            background:
              "rgba(0,0,0,0.75)",
            backdropFilter: "blur(14px)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
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

            <button onClick={addTask}>
              +
            </button>
          </div>

          <div
            style={{
              marginTop: 10,
            }}
          >
            {tasks.map((task, index) => (
              <div
                key={index}
                onClick={() =>
                  toggleTask(index)
                }
                style={{
                  cursor: "pointer",
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
                {task.text}
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
</main>
```

);
}
