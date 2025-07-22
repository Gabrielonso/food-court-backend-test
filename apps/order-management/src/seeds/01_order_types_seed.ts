import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('order_types').del();

  await knex('order_types').insert([
    {
      id: 's1',
      name: 'CARD',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
