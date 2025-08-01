import { ISeller } from '../interfaces';

const sellers: ISeller[] = [
  {
    id: '1',
    name: 'Tech Haven',
    location: 'London, UK',
    contact: 'contact@techhaven.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Gadget World',
    location: 'Manchester, UK',
    contact: 'sales@gadgetworld.co.uk',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllSellers = (): ISeller[] => {
  return sellers;
};

export const getSellerById = (id: string): ISeller | undefined => {
  return sellers.find((seller) => seller.id === id);
};