import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meal_addons', (table) => {
    table.increments('id').primary();
    table.string('amount').notNullable();
    table.specificType('images', 'TEXT[]').nullable();
    table
      .string('meal_id')
      .notNullable()
      .references('id')
      .inTable('meals')
      .onDelete('SET NULL');
    table.boolean('is_combo').defaultTo(false);
    table.integer('position').nullable();
    table.integer('quantity').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.jsonb('posist_data').nullable();
    table.string('min_selection_no').nullable();
    table.integer('internal_profit').nullable();
    table.string('meal_addon_category_id').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meal_addons');
}
