/**
 * The stall of « Le panier du marché ».
 *
 * Eight fruits and vegetables drawn from the shared pictogram bank. They are
 * chosen for their silhouettes rather than their colours: the patient has to
 * tell two baskets apart at a glance, and the bank only holds five pastels,
 * so what separates a leek from a lemon has to be the shape.
 *
 * `one` and `many` carry the French plural, which is not always a plain `s`
 * (« poireau » gives « poireaux »).
 */
export const PRODUCE = [
  { id: 'apple', one: 'pomme', many: 'pommes' },
  { id: 'banana', one: 'banane', many: 'bananes' },
  { id: 'carrot', one: 'carotte', many: 'carottes' },
  { id: 'eggplant', one: 'aubergine', many: 'aubergines' },
  { id: 'grapes', one: 'raisin', many: 'raisins' },
  { id: 'leek', one: 'poireau', many: 'poireaux' },
  { id: 'lemon', one: 'citron', many: 'citrons' },
  { id: 'mushroom', one: 'champignon', many: 'champignons' },
]

/** « 2 pommes », « 1 poireau ». */
export function quantityLabel(item, count) {
  return `${count} ${count > 1 ? item.many : item.one}`
}
