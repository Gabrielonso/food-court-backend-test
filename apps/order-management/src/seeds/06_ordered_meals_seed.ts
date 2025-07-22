import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('ordered_meals').del();
  await knex('ordered_meals').insert([
    {
      calculated_order_id: 1,
      meal_id: 'm1',
    },
    {
      calculated_order_id: 1,
      meal_id: 'm2',
    },
    {
      calculated_order_id: 2,
      meal_id: 'm5',
    },
  ]);
}
