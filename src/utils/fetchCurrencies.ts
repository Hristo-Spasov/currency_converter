import fetchData from "./fetchData";

export type Rates = {
  [key: string]: number;
};

export type SupportedCurrency = {
  code: string;
  name: string;
};

export const fetchRates = async (currencies?: string[]): Promise<Rates> => {
  try {
    const url = currencies
      ? `http://localhost:3001/api/currency/rates?currencies=${currencies.join(
          ","
        )}`
      : `http://localhost:3001/api/currency/rates`;

    return await fetchData<Rates>({ url });
  } catch (error) {
    throw new Error("Failed to fetch currency rates");
  }
};

export const fetchSupportedCountries = async (): Promise<
  SupportedCurrency[]
> => {
  try {
    const data = await fetchData<SupportedCurrency[]>({
      url: `http://localhost:3001/api/currency/codes`,
    });
    return data;
  } catch (error) {
    throw new Error("Failed to fetch supported currencies");
  }
};

const options = {
  method: "POST",
};

export const fetchConversions = async (
  currency: string,
  amount: string,
  selectedCurrencies: string[]
) => {
  try {
    return await fetchData<{ [key: string]: number }>({
      url: `http://localhost:3001/api/currency/convert`,
      body: {
        currency,
        amount,
        selectedCurrencies,
      },
      options,
    });
  } catch (error) {
    throw new Error("Failed to convert currencies");
  }
};
