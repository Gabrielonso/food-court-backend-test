import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('logs', (table) => {
    table.increments('id').primary();
    table
      .integer('calculated_order_id')
      .notNullable()
      .references('id')
      .inTable('calculated_orders')
      .onDelete('CASCADE');
    table.timestamp('time').notNullable();
    table.string('description').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('logs');
}
