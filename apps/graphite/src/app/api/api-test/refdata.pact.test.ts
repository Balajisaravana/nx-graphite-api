// 📁 __tests__/referenceData.pact.test.js
import path from 'path';
import { Matcher, Matchers } from '@pact-foundation/pact';
import { Pact } from '@pact-foundation/pact';
import axios from 'axios';

const { like } = Matchers;

const provider = new Pact({
  consumer: 'graphite',// consumer service name
  provider: 'ReferenceAPI',// backend service name
  port: 1234,
  log: path.resolve(process.cwd(), 'pacts', 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
});

describe('Pact test for getReferenceData()', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  describe('when a call to the API is made', () => {
    beforeAll(() => {
      return provider.addInteraction({
        state: 'reference tables exist',
        uponReceiving: 'a GET request to /api/reference-tables',
        withRequest: {
          method: 'GET',
          path: '/api/reference-tables', // Ensure this matches the actual endpoint
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like([
            {
              reference_table_id: '99f76c98-096c-4525-a344-7b7f4fa4cfd2',
              reference_table_name: 'Aba Participant Map',
              editable: true,
              priority: 'high',
              is_favorite: false,
            },
            {
              reference_table_id: 'ac0a264f-4a44-43d9-9736-64e66260777f',
              reference_table_name: 'Aba Transits',
              editable: false,
              priority: 'high',
              is_favorite: false,
            },
          ]),
        },
      });
    });

    it('returns a list of reference tables', async () => {
      const response = await axios.get('http://localhost:1234/api/reference-tables');
      console.log('Response:', response.data);

      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            reference_table_id: '99f76c98-096c-4525-a344-7b7f4fa4cfd2',
            reference_table_name: 'Aba Participant Map',
            editable: true,
            priority: 'high',
            is_favorite: false,
          }),
        ])
      );

      await provider.verify();
    });
  });

  describe('when a POST request is made to create a reference table', () => {
    beforeAll(() => {
      return provider.addInteraction({
        state: 'ready to create a new reference table',
        uponReceiving: 'a POST request to /api/reference-tables',
        withRequest: {
          method: 'POST',
          path: '/api/reference-tables',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            reference_table_name: 'New Reference Table',
            editable: true,
            priority: 'medium',
            is_favorite: false,
          },
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like({
            reference_table_id: '12345',
            reference_table_name: 'New Reference Table',
            editable: true,
            priority: 'medium',
            is_favorite: false,
          }),
        },
      });
    });

    it('creates a new reference table', async () => {
      const response = await axios.post('http://localhost:1234/api/reference-tables', {
        reference_table_name: 'New Reference Table',
        editable: true,
        priority: 'medium',
        is_favorite: false,
      });



      expect(response.status).toBe(201);
      expect(response.data).toEqual(
        expect.objectContaining({
          reference_table_id: '12345',
          reference_table_name: 'New Reference Table',
          editable: true,
          priority: 'medium',
          is_favorite: false,
        })
      );

      await provider.verify();
    });
  });

  describe('when a PUT request is made to update a reference table', () => {
    beforeAll(() => {
      return provider.addInteraction({
        state: 'a reference table exists to be updated',
        uponReceiving: 'a PUT request to /api/reference-tables/12345',
        withRequest: {
          method: 'PUT',
          path: '/api/reference-tables/12345',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            reference_table_name: 'Updated Reference Table',
            editable: false,
            priority: 'low',
            is_favorite: true,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: like({
            reference_table_id: '12345',
            reference_table_name: 'Updated Reference Table',
            editable: false,
            priority: 'low',
            is_favorite: true,
          }),
        },
      });
    });

    it('updates an existing reference table', async () => {
      const response = await axios.put('http://localhost:1234/api/reference-tables/12345', {
        reference_table_name: 'Updated Reference Table',
        editable: false,
        priority: 'low',
        is_favorite: true,
      });

     
      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.objectContaining({
          reference_table_id: '12345',
          reference_table_name: 'Updated Reference Table',
          editable: false,
          priority: 'low',
          is_favorite: true,
        })
      );

      await provider.verify();
    });
  });

  describe('when a DELETE request is made to delete a reference table', () => {
    beforeAll(() => {
      return provider.addInteraction({
        state: 'a reference table exists to be deleted',
        uponReceiving: 'a DELETE request to /api/reference-tables/12345',
        withRequest: {
          method: 'DELETE',
          path: '/api/reference-tables/12345',
        },
        willRespondWith: {
          status: 204,
        },
      });
    });

    it('deletes an existing reference table', async () => {
      const response = await axios.delete('http://localhost:1234/api/reference-tables/12345');

      console.log('Response status:', response.status);

      expect(response.status).toBe(204);

      await provider.verify();
    });
  });
});
