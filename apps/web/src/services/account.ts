import { request } from "./api";
import type {
    AuthUser,
    ChangePasswordRequest,
    UpdateProfileRequest
} from "../types/auth";

export function updateProfile(token: string, data: UpdateProfileRequest) {
    return request<AuthUser>("/account/profile", { method: "PATCH", body: data, token });
}

export function changePassword(token: string, data: ChangePasswordRequest) {
    return request<{ accessToken: string }>("/account/password", {
        method: "PATCH",
        body: data,
        token
    });
}
