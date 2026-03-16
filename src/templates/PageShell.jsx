function PageShell({ children }) {
  return (
    <div style={{ padding:"26px 32px 80px", width:"100%", boxSizing:"border-box", position:"relative", zIndex:1 }}>
      {children}
    </div>
  );
}

export { PageShell };
