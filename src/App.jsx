import { useEffect, useState } from "react";

const TABS = [
  { id: "electric", label: "Ola Electric" },
  { id: "cabs", label: "Ola Cabs" },
];

function ago(iso) {
  if (!iso) return "";
  const h = Math.max(0, Math.round((Date.now() - new Date(iso)) / 36e5));
  return h < 1 ? "just now" : h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}

export default function App() {
  const [tab, setTab] = useState("electric");
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let live = true;
    setState({ loading: true });
    fetch(`/api/news?topic=${tab}&summary=1`)
      .then((r) => r.json().then((j) => (r.ok ? j : Promise.reject(new Error(j.error)))))
      .then((data) => live && setState({ data }))
      .catch((e) => live && setState({ error: e.message }));
    return () => (live = false);
  }, [tab]);

  const { data, loading, error } = state;
  return (
    <main>
      <header>
        <h1>Ola News Tracker</h1>
        <p>Latest English-language coverage of Ola, from open news data.</p>
        <nav>
          {TABS.map((t) => (
            <button key={t.id} className={t.id === tab ? "on" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
      </header>
      {loading && <p className="note">Loading...</p>}
      {error && <p className="note err">{error}</p>}
      {data && (
        <>
          {data.demo && <p className="demo">DEMO MODE: these are sample headlines, not real news. Live news needs a news API key.</p>}
          <section className="digest">
            <h2>{data.digest?.mode === "ai" ? "AI brief" : "Top headlines"}</h2>
            <pre>{data.digest?.text}</pre>
          </section>
          <ul className="list">
            {data.articles.map((a) => (
              <li key={a.url}>
                {a.url ? <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a> : <span className="t">{a.title}</span>}
                <span>{a.domain} · {ago(a.publishedAt)}</span>
              </li>
            ))}
            {!data.articles.length && <li>No articles in the last 3 days.</li>}
          </ul>
        </>
      )}
      <footer>News data: {data?.source === "NewsData.io" ? <a href="https://newsdata.io/" target="_blank" rel="noreferrer">NewsData.io</a> : <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">GDELT Project</a>}. Headlines link to the original publishers.</footer>
    </main>
  );
}
