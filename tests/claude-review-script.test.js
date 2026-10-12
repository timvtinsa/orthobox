import { describe, expect, it } from 'vitest'
import {
  MARKER,
  MAX_CHANGED_LINES,
  MAX_FINDINGS,
  buildPrompt,
  capDiff,
  clean,
  extractReview,
  formatReview,
  shouldReview,
} from '../scripts/claude-review.mjs'

const review = (findings = [], extra = {}) => ({ verdict: findings.length ? 'issues' : 'ok', summary: 'Fine.', findings, ...extra })

describe('claude-review: when to spend a review', () => {
  it('reviews a small pull request', () => {
    expect(shouldReview({ action: 'opened', additions: 120, deletions: 30 }).run).toBe(true)
  })

  it('skips a very large one, and says how to ask for it anyway', () => {
    const result = shouldReview({ action: 'opened', additions: MAX_CHANGED_LINES, deletions: 1 })
    expect(result.run).toBe(false)
    expect(result.reason).toContain('claude-review')
  })

  it('reviews whatever the size when asked for by label', () => {
    expect(shouldReview({ action: 'labeled', additions: 99999, deletions: 0 }).run).toBe(true)
    expect(shouldReview({ action: 'opened', additions: 99999, deletions: 0, force: true }).run).toBe(true)
  })

  it('reads the line counts the event gives as text', () => {
    expect(shouldReview({ action: 'opened', additions: '2000', deletions: '10' }).run).toBe(false)
  })
})

describe('claude-review: the diff the model reads', () => {
  it('leaves a short diff alone', () => {
    expect(capDiff('a\nb', 10)).toEqual({ diff: 'a\nb', truncated: false })
  })

  it('cuts a long one at a line boundary', () => {
    const result = capDiff('line one\nline two\nline three', 20)
    expect(result.truncated).toBe(true)
    expect(result.diff).toBe('line one\nline two')
  })

  it('wraps the diff in a fence the diff cannot predict, and tells the model it is data', () => {
    const one = buildPrompt('+ x', false, 'aaaa')
    const other = buildPrompt('+ x', false, 'bbbb')
    expect(one).toContain('DIFF-aaaa\n+ x\nDIFF-aaaa')
    expect(one).not.toBe(other)
    expect(one).toContain('untrusted data')
    expect(one).toContain('You have no tool')
  })

  it('asks the model to say when the diff was cut', () => {
    expect(buildPrompt('x', true)).toContain('was cut')
    expect(buildPrompt('x', false)).not.toContain('was cut')
  })
})

describe('claude-review: reading the answer', () => {
  it('reads a plain JSON answer', () => {
    expect(extractReview('{"verdict":"ok","summary":"Fine.","findings":[]}').verdict).toBe('ok')
  })

  it('reads an answer wrapped in a code fence and a sentence', () => {
    const answer = 'Here:\n```json\n{"verdict":"issues","summary":"One.","findings":[{"severity":"high","file":"a.js","title":"t","detail":"d"}]}\n```'
    expect(extractReview(answer).findings).toHaveLength(1)
  })

  it('rejects an answer that is not a review', () => {
    expect(() => extractReview('Sorry, I cannot.')).toThrow()
    expect(() => extractReview('{"verdict":"approve","summary":"","findings":[]}')).toThrow()
    expect(() => extractReview('{"verdict":"ok","summary":"x","findings":"none"}')).toThrow()
    expect(() => extractReview('{"verdict":"ok","findings":[]}')).toThrow()
  })
})

describe('claude-review: what reaches the comment', () => {
  it('removes links, images, HTML and mentions', () => {
    const text = clean('See [x](https://evil.example/?q=1) ![i](http://e.example/a.png) <img src=x onerror=y> @owner www.evil.example', 500)
    expect(text).not.toMatch(/https?:/)
    expect(text).not.toContain('<')
    expect(text).not.toContain('www.')
    expect(text).not.toContain('![')
    expect(text).not.toMatch(/@(?!\u200b)/)
    expect(text).not.toContain('](')
  })

  it('keeps it to one line and to its length', () => {
    expect(clean('a\n\nb\tc', 50)).toBe('a b c')
    expect(clean('x'.repeat(100), 10)).toHaveLength(10)
    expect(clean(undefined, 10)).toBe('')
  })

  it('formats findings under the marker, with a fixed severity set and a valid line', () => {
    const body = formatReview(
      review([
        { severity: 'critical', file: 'src/a.js', line: 12, title: 'Unsafe', detail: 'Reads storage unchecked.' },
        { severity: 'high', file: '`src/b.js`', line: -3, title: 'Other', detail: 'Bad.' },
      ]),
    )
    expect(body.startsWith(MARKER)).toBe(true)
    expect(body).toContain('- **low** `src/a.js:12`: Unsafe. Reads storage unchecked.')
    expect(body).toContain('- **high** `src/b.js`: Other. Bad.')
  })

  it('caps the number of findings', () => {
    const findings = Array.from({ length: 20 }, (_, index) => ({ severity: 'low', file: `f${index}.js`, title: 't', detail: 'd' }))
    expect(formatReview(review(findings)).match(/^- \*\*/gm)).toHaveLength(MAX_FINDINGS)
  })

  it('says so when nothing was found', () => {
    expect(formatReview(review([], { summary: '' }))).toContain('No issue found')
  })

  it('does not let a hijacked answer put a link or a mention in the comment', () => {
    const body = formatReview(
      review([{ severity: 'high', file: 'a.js', title: 'Click https://evil.example/steal', detail: 'ping @everyone ![x](https://evil.example/p.png)' }], {
        summary: 'Visit <a href="https://evil.example">here</a>',
      }),
    )
    expect(body).not.toMatch(/https?:\/\//)
    expect(body).not.toContain('<a')
    expect(body).not.toMatch(/@(?!\u200b)/)
  })
})
