export const dynamic = "force-dynamic";

export default function DebugPage() {
  const key = process.env.NEXT_PUBLIC_KAKAO_KEY;
  return (
    <div style={{ padding: 40, fontFamily: "monospace", color: "#fff", background: "#222", minHeight: "100vh" }}>
      <h1>Kakao Key Diagnostic</h1>
      <p>env var name: <code>NEXT_PUBLIC_KAKAO_KEY</code></p>
      <p>present at runtime: <strong>{key ? "YES" : "NO (undefined)"}</strong></p>
      <p>length: {key?.length ?? "-"}</p>
      <p>first 4 chars: <code>{key ? key.slice(0, 4) : "-"}</code></p>
      <p>last 4 chars: <code>{key ? key.slice(-4) : "-"}</code></p>
      <p style={{ marginTop: 24, color: "#aaa" }}>
        Expected: present=YES, length=32, first 4 = e38d
      </p>
    </div>
  );
}
