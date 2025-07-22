import { Knex } from 'knex';
export async function seed(knex: Knex): Promise<void> {
  await knex('meal_addons').insert([
    {
      id: 1,
      amount: '780',
      meal_id: 'm1',
      is_combo: false,
      created_at: new Date(),
      updated_at: new Date(),
      meal_addon_category_id: 'md1',
    },
    {
      id: 2,
      amount: '2350',
      meal_id: 'm1',
      is_combo: false,
      quantity: 1,
      position: 6,
      created_at: new Date(),
      updated_at: new Date(),
      meal_addon_category_id: '001b1dbf-38ef-462c-b045-598459f03a24',
    },
  ]);
}
