import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('logs').insert([
    {
      id: 1,
      calculated_order_id: 1,
      description: 'Order waas created',
      time: new Date('2025-07-19T08:30:00Z'),
    },
    {
      id: 2,
      calculated_order_id: 1,
      description: 'User placed an order for 3 items',
      time: new Date('2025-07-19T09:15:00Z'),
    },
    {
      id: 3,
      calculated_order_id: 2,
      description: 'Order was sent out',
      time: new Date('2025-07-19T10:00:00Z'),
    },
  ]);

  await knex.raw(`SELECT setval('logs_id_seq', (SELECT MAX(id) FROM logs))`);
}
