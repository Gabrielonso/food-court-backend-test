import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('meals').del();
  await knex('meals').insert([
    {
      id: 'm1',
      name: 'Pepper Rice Special',
      new: true,
      active: true,
      amount: '1550',
      brand: JSON.stringify({ id: '1', name: 'Jollof & Co.' }),
      images: [
        'https://d3u7b9fq2opvwp.cloudfront.net/upload-service1683254602568a1306e1c-1ff3-486f-9e1b-a7057a823213',
      ],
      alcohol: false,
      brand_id: '1',
      item_type: 'FOOD',
      quantity: 1,
      created_at: new Date(),
      updated_at: new Date(),
      description:
        'White rice wrapped in banana leaves served with special pepperstew',
      available_no: 'INFINITE',
      internal_profit: 0,
      meal_category_id: '3dbc3bb6-45ac-4c96-a856-302ef79d1e36',
    },
    {
      id: 'm2',
      name: 'Extra portion',
      new: false,
      active: true,
      amount: '780',
      brand_id: '1',
      item_type: 'FOOD',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'm5',
      name: 'Peppered Turkey.',
      new: false,
      active: true,
      amount: '2350',
      brand_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
