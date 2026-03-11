function TwoColumnLayout({ left, right }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:24, alignItems:"start" }}>
      {left}
      {right}
    </div>
  );
}

export { TwoColumnLayout };
