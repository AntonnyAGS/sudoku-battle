import { expect, test } from '@playwright/test';

for (const [port, status] of [
  [3000, 'API available'],
  [3002, 'Service unavailable'],
] as const) {
  test(`${status} is rendered in initial HTML and without browser JavaScript`, async ({
    page,
    request,
  }) => {
    const url = `http://localhost:${port}`;
    const response = await request.get(url);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(`<p role="status">${status}</p>`);
    await page.goto(url);
    await expect(
      page.getByRole('heading', { name: 'Sudoku Battle', level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(status);
  });
}
