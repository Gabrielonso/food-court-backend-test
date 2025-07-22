import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.string('id').primary();
    table.boolean('new').defaultTo(false);
    table.string('name').notNullable();
    table.jsonb('brand').nullable();
    table.boolean('active').defaultTo(true);
    table.string('amount').notNullable();
    table.specificType('images', 'TEXT[]').nullable();
    table.boolean('alcohol').defaultTo('false');
    table.string('item_no').nullable();
    table.string('summary').nullable();
    table.string('brand_id');
    table.string('calories').nullable();
    table.boolean('is_addon').defaultTo(false);
    table.boolean('is_combo').defaultTo(false);
    table.integer('position').nullable();
    table.integer('quantity').nullable();
    table.boolean('home_page').defaultTo(false);
    table.string('item_type').nullable();
    table.specificType('meal_tags', 'TEXT[]').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false);
    table.string('order_note').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('description').nullable();
    table.string('minimum_age').nullable();
    table.jsonb('posist_data').nullable();
    table.string('available_no').nullable();
    table.specificType('meal_keywords', 'TEXT[]').nullable();
    table.integer('internal_profit').nullable();
    table.string('meal_category_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
