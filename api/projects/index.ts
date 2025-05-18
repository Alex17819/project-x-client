import { api } from "@/api/axios";
import { API_ROUTES } from "@/api/routes";

export class ProjectsApi {
  static async getProjects() {
    return await api.get<{ id: number }[]>(API_ROUTES.projects);
  }
  static async getProjectData(id: number) {
    return await api.get(`${API_ROUTES.projects}/${id}`);
  }
  static async saveProject(data: Record<string, any>) {
    return await api.post(API_ROUTES.projects, {
      blocks: JSON.stringify(data),
    });
  }
  static async updateProject(id: number, data: Record<string, any>) {
    return await api.put(`${API_ROUTES.projects}/${id}`, {
      blocks: JSON.stringify(data),
    });
  }
}
