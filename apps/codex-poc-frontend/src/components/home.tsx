export function Home({ available }: { available: boolean }) {
  return (
    <main>
      <p className="eyebrow">Two players. One puzzle.</p>
      <h1>Sudoku Battle</h1>
      <p>Compete with a friend or solve together as a team.</p>
      <p role="status">{available ? 'API available' : 'Service unavailable'}</p>
      <p className="next">Rooms and shared games are coming next.</p>
    </main>
  );
}
