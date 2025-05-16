import { api } from "@/api/axios";
import { API_ROUTES } from "@/api/routes";

export interface UploadFile {
  base64: string;
  filename: string;
}

export class FilesApi {
  static async uploadFile(data: UploadFile) {
    return await api.post(API_ROUTES.uploadFile, data);
  }

  static async getFiles() {
    return await api.get<{ link: string }[]>(API_ROUTES.getFiles);
  }
}
