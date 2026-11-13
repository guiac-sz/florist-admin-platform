import { request } from "./api";
import type { Address, SaveAddressRequest } from "../types/address";

export function getAddresses(token: string) {
    return request<Address[]>("/account/addresses", { token });
}

export function createAddress(token: string, data: SaveAddressRequest) {
    return request<Address>("/account/addresses", { method: "POST", body: data, token });
}

export function updateAddress(token: string, id: number, data: SaveAddressRequest) {
    return request<Address>(`/account/addresses/${id}`, { method: "PUT", body: data, token });
}

/** Devolve a lista inteira, já com o novo principal no topo. */
export function setDefaultAddress(token: string, id: number) {
    return request<Address[]>(`/account/addresses/${id}/default`, { method: "PATCH", token });
}

export function deleteAddress(token: string, id: number) {
    return request<void>(`/account/addresses/${id}`, { method: "DELETE", token });
}
