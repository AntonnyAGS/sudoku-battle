import { GetAvailability } from '@sudoku/frontend-application';
import { HttpHealth } from '@sudoku/frontend-http-adapter';
import { Home } from '../components/home';
import { readEnvironment } from '../config/environment';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { apiBaseUrl } = readEnvironment(process.env);
  const available = await new GetAvailability(
    new HttpHealth(apiBaseUrl),
  ).execute();
  return <Home available={available} />;
}
