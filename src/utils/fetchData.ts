import axios, { AxiosError, AxiosResponse } from "axios";

interface FetchDataProps {
  url: string;
  body?: {
    currency: string;
    amount: string;
    selectedCurrencies?: string[]; // Add this to interface
  };
  options?: {
    method?: string;
  };
}

const fetchData = async <T>({
  url,
  options,
  body,
}: FetchDataProps): Promise<T> => {
  try {
    const method = options?.method || "GET";

    const response: AxiosResponse<T> = await axios.request<T>({
      url,
      method,
      data: body,
    });

    const responseData: T = response.data;
    return responseData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      console.log("error message: ", error.message);
      throw axiosError;
    } else {
      console.log("unexpected error: ", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
export default fetchData;
