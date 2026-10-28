import { FormSchema } from "@/components/Form/form-config";
import { API_URL } from "@/config/config";
import { PresencePayload } from "@/types/request/presence";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error("failed to convert file to base64"));
  });
};

export const submitPresence = () => {
  const URI = `${API_URL}/absensi/saverecordabsen`;

  return {
    mutationKey: [URI],
    mutationFn: async (
      data: z.infer<typeof FormSchema>
    ): Promise<AxiosResponse<{ message: string; status: string }>> => {
      if (typeof data.picture === "string") {
        throw new Error("Picture is required.");
      }

      const base64Image = await convertFileToBase64(data.picture[0]);

      const payload: PresencePayload = {
        NEW_VERSION_DETECTOR: data.apk_version,
        ABSENSI_EMPLOYEE_ID: Number(data.employee_id),
        ABSENSI_LAT: Number(data.lat),
        ABSENSI_LNG: Number(data.long),
        ABSENSI_JNS: data.presence_type,
        ABSENSI_TIPE: data.work_type,
        ABSENSI_KETERANGAN: data.information,
        image_uri: base64Image,
      };

      return axios.post(URI, payload);
    },
  };
};
