import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CHttp } from './chttp.service';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  countries = [
    { id: '58800b7d-2edf-4aeb-a2e4-622dcd00b131', name: 'Bulgaria' },
    { id: 'df965c14-ab6c-446e-81df-26925b19e0fd', name: 'Germany' },
    { id: 'e2a71c3b-6aa3-475c-ac5f-87f21baae2c7', name: 'Sweden' },
    { id: '5bc9e8a1-cfa2-4109-ba58-6c03635e799b', name: 'Norway' },
    { id: '37e521ce-3f6b-44c4-85b2-4da18fde2af0', name: 'Spain' },
    { id: '615fc923-85b5-4ac1-b6ed-ad6c15fea5ea', name: 'Finland' },
    { id: '977c86e9-9bef-4c99-9341-c03ae45f2927', name: 'Poland' },
    { id: '85923459-10b5-4c14-a263-18f3cf84ddb7', name: 'Italy' },
    { id: 'c4cf16c6-9974-41a3-8cc5-6ab6082878b1', name: 'United Kingdom' },
    { id: '45a20fa2-8b52-4c35-9fcd-c8874ed45ce4', name: 'Romania' },
    { id: 'aa8240f6-f0c1-4aa2-8653-ed591f4a69c4', name: 'Greece' },
    { id: 'cdc37db9-2b11-4d01-a4d3-2a8661556941', name: 'Switzerland' },
    { id: 'dee0df50-0bee-448f-bbcf-022d62f67d05', name: 'Netherlands' },
    { id: 'cbaf5725-c349-4919-90ed-8ec8e6a9d47e', name: 'Denmark' },
    { id: '146094c8-9f20-4561-887a-04e73f3bbeaa', name: 'Estonia' },
    { id: '6599f392-bbb4-429e-ae48-4d308b8bfa5b', name: 'Iceland' },
    { id: '71c21555-f981-42b2-99f7-95f95ece8fdb', name: 'Hungary' },
    { id: '13657c1c-2684-4aca-b665-255554416c8c', name: 'Portugal' },
    { id: 'b4b1c2dc-1660-46b6-bad6-d89ae04ed8ae', name: 'Austria' },
    { id: '3db39287-9141-4229-86ef-bc7dd72a7eea', name: 'Czech Republic' },
    { id: '3ab7a1a6-f6dc-4a27-9f8f-3916d0d8ada1', name: 'Ireland' },
    { id: 'd5d2d399-aa77-4a5a-a7f3-394e815865fd', name: 'Lithuania' },
    { id: '2a170096-2b09-4f18-8165-cc06dbabe3ec', name: 'Latvia' },
    { id: '71cb59a5-86d5-417b-a809-ad196cf2158c', name: 'Croatia' },
    { id: 'a0ff7e66-84ab-456f-a0fb-0148dbd9bd21', name: 'Bosnia and Herzegovina' },
    { id: '8e3d02cf-356c-42b4-8764-2fe930d26e62', name: 'Slovakia' },
    { id: '1c5935bb-af0d-4d9a-ae96-f7a2de0f189d', name: 'Moldova' },
    { id: 'f9f2ecd9-4439-4e98-9d57-aec795dcb01c', name: 'Belgium' },
    { id: '71e0184c-f31e-48bc-a644-a4e828dec2d1', name: 'Armenia' },
    { id: '2ff5d6b3-e54f-4929-90d5-890494ac8049', name: 'Albania' },
    { id: 'bad6d28c-a1ad-4236-aa99-99af3bafbd6f', name: 'Turkey' },
    { id: '09aa4f0c-78d8-412e-944c-262bf98a1f2a', name: 'Slovenia' },
    { id: 'b6f8d331-0a84-481e-a1b0-fc1c1543e130', name: 'Montenegro' },
    { id: 'c1ad0bc9-72a6-4e53-87ec-cd6c1ada8519', name: 'Kosovo' },
  ]

  constructor(private http: CHttp) { }

  search(search: string) {
    search = search.toLowerCase()

    return this.http.get(environment.api_url + 'locations/search?text=' + search)
  }

  getCities(countryId: string) {
    return this.http.get(environment.api_url + 'locations/cities?countryId=' + countryId)
  }
}
