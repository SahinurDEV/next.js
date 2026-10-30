import { buildPagesStaticPaths } from './pages'

const build = (page: string, params: Record<string, unknown>) =>
  buildPagesStaticPaths({
    page,
    configFileName: 'next.config.js',
    getStaticPaths: async () => ({
      paths: [{ params: params as any }],
      fallback: false,
    }),
  })

describe('buildPagesStaticPaths', () => {
  it('builds paths for valid catch-all params', async () => {
    const result = await build('/[...slug]', { slug: ['a', 'b'] })
    expect(result.prerenderedRoutes?.map((r) => r.pathname)).toEqual(['/a/b'])
  })

  it('throws a clear error for a non-string dynamic param', async () => {
    await expect(build('/[id]', { id: 1 })).rejects.toThrow(
      'A required parameter (id) was not provided as a string received number in getStaticPaths for /[id]'
    )
  })

  it('throws a clear error for non-string items in a catch-all param', async () => {
    await expect(build('/[...slug]', { slug: ['a', 2] })).rejects.toThrow(
      'A required parameter (slug) must be an array of strings, but item 1 is number in getStaticPaths for /[...slug]'
    )
  })

  it('throws a clear error for non-string items in an optional catch-all param', async () => {
    await expect(build('/[[...slug]]', { slug: [undefined] })).rejects.toThrow(
      'A required parameter (slug) must be an array of strings, but item 0 is undefined in getStaticPaths for /[[...slug]]'
    )
  })
})
