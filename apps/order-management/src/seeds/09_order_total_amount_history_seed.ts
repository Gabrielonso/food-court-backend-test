import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('order_total_amount_history').insert([
    {
      id: 1,
      order_id: 1,
      total_amount: 4500.0,
      time: new Date('2025-07-19T08:00:00Z'),
    },
    {
      id: 2,
      order_id: 1,
      total_amount: 4800.0,
      time: new Date('2025-07-19T08:15:00Z'),
    },
    {
      id: 3,
      order_id: 2,
      total_amount: 3200.0,
      time: new Date('2025-07-19T09:00:00Z'),
    },
    {
      id: 4,
      order_id: 2,
      total_amount: 3000.0,
      time: new Date('2025-07-19T09:10:00Z'),
    },
  ]);
}
