import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ordered_meals', (table) => {
    table
      .integer('calculated_order_id')
      .notNullable()
      .references('id')
      .inTable('calculated_orders')
      .onDelete('SET NULL');
    table
      .string('meal_id')
      .notNullable()
      .references('id')
      .inTable('meals')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ordered_meals');
}
