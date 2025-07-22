import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('riders').del();

  await knex('riders').insert([
    {
      id: 1,
      name: 'John Doe',
      is_available: true,
      current_latitude: 6.5244,
      current_longitude: 3.3792,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'Jane Smith',
      is_available: false,
      current_latitude: 6.4654,
      current_longitude: 3.4064,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'Tunde Adebayo',
      is_available: true,
      current_latitude: 6.6,
      current_longitude: 3.35,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: 'Amaka Nwosu',
      is_available: true,
      current_latitude: 6.5001,
      current_longitude: 3.3701,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 5,
      name: 'Ahmed Musa',
      is_available: false,
      current_latitude: 6.43,
      current_longitude: 3.41,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
