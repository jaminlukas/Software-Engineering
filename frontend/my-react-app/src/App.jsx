import { useEffect, useState } from "react";

function App() {

    const [data, setData] = useState(null);

    // 🚀 Daten vom Backend abrufen

    useEffect(() => {

        fetch("http://localhost:3000/api/info")

            .then((res) => res.json())

            .then((json) => setData(json))

            .catch((err) => console.error("Fehler beim Abrufen 🚀:", err));

    }, []);

    return (
        <main

            style={{

                minHeight: "100vh",

                backgroundColor: "#f1f5f9",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                fontFamily: "sans-serif",

            }}
        >
            <section

                style={{

                    background: "white",

                    borderRadius: "1rem",

                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",

                    padding: "2rem 3rem",

                    textAlign: "center",

                    maxWidth: "400px",

                }}
            >
                <h1>React ↔ Node Verbindung 🚀</h1>

                {!data ? (
                    <p>Daten werden geladen … 🌀</p>

                ) : (
                    <>
                        <p>
                            <strong>Nachricht:</strong> {data.message}
                        </p>
                        <p>
                            <strong>Zeit:</strong> {data.time}
                        </p>
                    </>

                )}
            </section>
        </main>

    );

}

export default App;



