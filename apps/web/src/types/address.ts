export interface Address {
    id: number;
    label: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    reference: string | null;
    isDefault: boolean;
}

export type SaveAddressRequest = Omit<Address, "id" | "isDefault"> & {
    isDefault?: boolean;
};
