/**
 * Mock Customers for Dashboard
 */
export interface Customer {
    id: string;
    amountSpent: number;
    avatar: string;
    createdAt: number;
    isOnboarded: boolean;
    name: string;
    orders: number;
}

export const mockCustomers: Customer[] = [
    {
        id: '5e887ac47a44b92f73511111',
        amountSpent: 500,
        avatar: '/assets/avatars/avatar-1.png',
        createdAt: new Date().getTime() - 1000 * 60 * 60 * 2,
        isOnboarded: true,
        name: 'Ekani Valentin',
        orders: 3
    },
    {
        id: '5e887b209c28ac3dd97f1111',
        amountSpent: 1200,
        avatar: '/assets/avatars/avatar-2.png',
        createdAt: new Date().getTime() - 1000 * 60 * 60 * 5,
        isOnboarded: false,
        name: 'Kouassi Marie',
        orders: 1
    },
    {
        id: '5e887b760244b21a52011111',
        amountSpent: 850,
        avatar: '/assets/avatars/avatar-3.png',
        createdAt: new Date().getTime() - 1000 * 60 * 60 * 12,
        isOnboarded: true,
        name: 'Boateng Paul',
        orders: 5
    }
];
