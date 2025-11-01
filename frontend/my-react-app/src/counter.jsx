import { useState } from "react";

export default function Counter() {

    const [count, setCount] = useState(0);

    return (
        <div

            style={{

                border: "1px solid #e2e8f0",

                backgroundColor: "#f8fafc",

                borderRadius: "0.75rem",

                padding: "1.5rem",

                textAlign: "center",

            }}
        >
            <p

                style={{

                    fontSize: "0.95rem",

                    color: "#475569",

                    marginBottom: "1rem",

                    lineHeight: 1.4,

                }}
            >
                <span style={{ fontWeight: 500, color: "#0f172a" }}>Count:</span>{" "}
                <span

                    style={{

                        fontVariantNumeric: "tabular-nums",

                        fontFeatureSettings: '"tnum"',

                        color: "#0f172a",

                    }}
                >

          {count}
</span>
            </p>

            <button

                onClick={() => setCount(count + 1)}

                style={{

                    backgroundColor: "#0f172a",

                    color: "white",

                    fontSize: "0.9rem",

                    fontWeight: 500,

                    border: "1px solid #0f172a",

                    borderRadius: "0.5rem",

                    padding: "0.6rem 1rem",

                    cursor: "pointer",

                    lineHeight: 1.2,

                    minWidth: "4rem",

                    transition: "all 0.15s ease",

                }}

                onMouseDown={(e) => {

                    // kleiner Klick-Effekt

                    e.currentTarget.style.transform = "scale(0.97)";

                }}

                onMouseUp={(e) => {

                    e.currentTarget.style.transform = "scale(1)";

                }}

                onMouseLeave={(e) => {

                    e.currentTarget.style.transform = "scale(1)";

                }}
            >

                +1
            </button>
        </div>

    );

}

