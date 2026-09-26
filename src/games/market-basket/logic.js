/**
 * Building and correcting a round of « Le panier du marché ».
 *
 * The order asks for a few kinds among the eight on the stall, so filling the
 * basket means picking the right ones out rather than taking everything in
 * sight. With the « quantités » setting on, each kind is asked for one to
 * three times, which turns the same board into a counting exercise.
 *
 * The basket is held as a plain `{ [id]: count }` map: comparing it to the
 * order is then a set comparison, and an item taken back simply decrements.
 */
import { randomInt, sample } from '../../lib/random.js'
import { PRODUCE } from './data.js'

export const MAX_PER_KIND = 3

/** The order to reproduce: `[{ id, one, many, count }]`, stall order kept. */
export function buildOrder(config) {
  const kinds = Math.min(Math.max(config.kinds ?? 3, 1), PRODUCE.length)
  const max = config.quantities === 'multiple' ? MAX_PER_KIND : 1
  const drawn = sample(PRODUCE, kinds)
  return PRODUCE.filter((item) => drawn.includes(item)).map((item) => ({
    ...item,
    count: randomInt(1, max),
  }))
}

/** How many items the order holds in total, quantities included. */
export function orderSize(order) {
  return order.reduce((total, item) => total + item.count, 0)
}

/** The order as a `{ [id]: count }` map, to compare with a basket. */
export function orderCounts(order) {
  return Object.fromEntries(order.map((item) => [item.id, item.count]))
}

/**
 * The state of one kind in the basket against the order: 'ok' when the count
 * matches, 'err' when the patient took some but not the right number, and
 * 'expected' for a kind that was asked for and never taken.
 */
export function kindState(id, order, basket) {
  const wanted = orderCounts(order)[id] ?? 0
  const taken = basket[id] ?? 0
  if (wanted === taken) return taken === 0 ? null : 'ok'
  return taken === 0 ? 'expected' : 'err'
}

/** True when the basket holds exactly the order, no more and no less. */
export function basketMatches(order, basket) {
  const wanted = orderCounts(order)
  const takenIds = Object.keys(basket).filter((id) => basket[id] > 0)
  if (takenIds.length !== Object.keys(wanted).length) return false
  return takenIds.every((id) => basket[id] === wanted[id])
}
