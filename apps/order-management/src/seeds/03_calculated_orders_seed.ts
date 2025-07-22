import { Knex } from 'knex';
export async function seed(knex: Knex): Promise<void> {
  await knex('calculated_orders').del();

  await knex('calculated_orders').insert([
    {
      id: 1,
      total_amount: 26785,
      free_delivery: false,
      delivery_fee: 900,
      service_charge: 0,
      address_details: JSON.stringify({
        city: 'Lekki',
        name: 'Current',
        address_line: 'Lekki, Lagos, Nigeria',
        building_number: 'No.',
      }),
      lat: '6.453235649711961',
      lng: '3.542877760780109',
      cokitchen_polygon_id: 's2',
      user_id: '2',
      cokitchen_id: '3',
      pickup: false,
      prev_price: 15030,
    },
    {
      id: 2,
      total_amount: 39780,
      free_delivery: false,
      delivery_fee: 1200,
      service_charge: 0,
      address_details: JSON.stringify({
        city: 'Yabba',
        name: 'Current',
        address_line: 'Yabba, Lagos, Nigeria',
        building_number: 'No.',
      }),
      lat: '6.453235649711961',
      lng: '3.542877760780109',
      cokitchen_polygon_id: 's2',
      user_id: '2',
      cokitchen_id: '3',
      pickup: false,
      prev_price: 23900,
    },
  ]);

  await knex.raw(
    `SELECT setval('calculated_orders_id_seq', (SELECT MAX(id) FROM calculated_orders))`,
  );
}
