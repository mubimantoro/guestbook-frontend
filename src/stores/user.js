import { create } from "zustand";
import Cookies from "js-cookie";
import Api from "../services/Api";

export const useStore = create((set) => ({
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {},
  permissions: Cookies.get("permissions") ? JSON.parse(Cookies.get("permissions")) : {},
  token: Cookies.get("token") || "",

  login: async (credentials) => {
    const response = await Api.post("/login", credentials);

    set({ user: response.data.data.user });
    set({ token: response.data.data.token });

    Cookies.set("user", JSON.stringify(response.data.data.user));
    Cookies.set("permissions", JSON.stringify(response.data.data.permissions));
    Cookies.set("token", response.data.data.token);
  },

  logout: () => {
    Cookies.remove("user");
    Cookies.remove("token");
    Cookies.remove("permissions")
    set({ user: {}, permissions: [], token: "" });
  },
}));
