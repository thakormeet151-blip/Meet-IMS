const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  getToken() {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
        window.location.href = "/";
      }
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data.user;
  }

  async signup(name: string, email: string, password: string) {
    const data = await this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.token);
    return data.user;
  }

  // Products
  async getProducts() {
    return this.request("/products");
  }

  async addProduct(product: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: any) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request("/dashboard");
  }

  // Receipts
  async addReceipt(receipt: any) {
    return this.request("/receipts", {
      method: "POST",
      body: JSON.stringify(receipt),
    });
  }

  // Deliveries
  async addDelivery(delivery: any) {
    return this.request("/deliveries", {
      method: "POST",
      body: JSON.stringify(delivery),
    });
  }

  // Transfers
  async addTransfer(transfer: any) {
    return this.request("/transfers", {
      method: "POST",
      body: JSON.stringify(transfer),
    });
  }

  // Inventory Adjustments
  async addAdjustment(adjustment: any) {
    return this.request("/adjustments", {
      method: "POST",
      body: JSON.stringify(adjustment),
    });
  }
}

export const api = new ApiClient();