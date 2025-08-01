import { IProduct } from '../interfaces';

const products: IProduct[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Apple MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD',
    category: 'Laptops',
    price: 2499.99,
    sellerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'iPhone 13 Pro',
    description: 'Apple iPhone 13 Pro with 128GB storage',
    category: 'Smartphones',
    price: 999.99,
    sellerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllProducts = (): IProduct[] => {
  return products;
};

export const getProductById = (id: string): IProduct | undefined => {
  return products.find((product) => product.id === id);
};