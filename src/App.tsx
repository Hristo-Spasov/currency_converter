import { useEffect, useState } from "react";
import {
  fetchConversions,
  fetchRates,
  fetchSupportedCountries,
  Rates,
  SupportedCurrency,
} from "./utils/fetchCurrencies";
import CurrencyModal from "./components/CurrencyModal/CurrencyModal";
import "./App.css";
interface ActiveInputData {
  currency: string;
  value: string;
}
const App = () => {
  const [rates, setRates] = useState<Rates>({});
  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [activeInputData, setActiveInputData] = useState<ActiveInputData>({
    currency: "",
    value: "",
  });

  const [supportedCountries, setSupportedCountries] = useState<
    SupportedCurrency[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ratesData, countriesData] = await Promise.all([
          fetchRates(),
          fetchSupportedCountries(),
        ]);

        const initialCurrencies = Object.keys(ratesData);
        setSelectedCurrencies(initialCurrencies);

        const initialConversion = await fetchConversions(
          "USD",
          "1",
          initialCurrencies
        );

        setRates(ratesData);
        setSupportedCountries(countriesData);
        setSelectedCurrencies(Object.keys(ratesData));
        setValues(initialConversion);
        setActiveInputData({
          currency: "USD",
          value: "1",
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCurrencyChange = async (currency: string, value: string) => {
    try {
      setError(null);
      setActiveInputData({ currency, value });

      const conversions = await fetchConversions(
        currency,
        value,
        selectedCurrencies
      );
      setValues(conversions);
    } catch (error) {
      console.error("Error fetching conversions:", error);
      setError("An error occurred while fetching data.");
    }
  };

  const handleCurrencySelect = async (currencyCode: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const newSelectedCurrencies = [...selectedCurrencies, currencyCode];

      setSelectedCurrencies(newSelectedCurrencies);

      const [newRates, conversions] = await Promise.all([
        fetchRates(newSelectedCurrencies),
        fetchConversions(
          activeInputData.currency,
          activeInputData.value,
          newSelectedCurrencies
        ),
      ]);

      setRates(newRates);
      setValues(conversions);
      setIsLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding new currency:", error);
      setError("Failed to add new currency. Please try again.");
      setSelectedCurrencies((prev) =>
        prev.filter((currency) => currency !== currencyCode)
      );
    }
  };

  const handleCurrencyRemove = (currencyToRemove: string) => {
    if (selectedCurrencies.length <= 1) return;

    setSelectedCurrencies((prev) =>
      prev.filter((currency) => currency !== currencyToRemove)
    );
  };

  const handleModal = () => setIsModalOpen(true);
  return (
    <>
      <div className="app">
        <div className="container">
          <div className="header">
            <h1 className="header__title">
              Welcome to the Currency Converter!
            </h1>
          </div>
          <div>
            <p className="description">
              This essential tool allows you to quickly and easily convert
              currencies from one to another in real-time. No need to contact
              banks or financial institutions—get accurate conversions
              instantly. Whether for travel, business, or personal use, this
              tool simplifies working with money across borders. Try it now!
            </p>
          </div>
        </div>
        {isLoading ? (
          <span className="loader"></span>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="converter">
            {error && (
              <div className="error-container">
                <p className="error-message">{error}</p>
              </div>
            )}
            <div className="button_container">
              <button className="add_currency_btn" onClick={handleModal}>
                Add Currency
              </button>
            </div>

            {Object.keys(rates).length > 0 &&
              Object.entries(rates)
                .filter(([currency]) => selectedCurrencies.includes(currency))
                .map(([currency]) => (
                  <div key={currency} className="converter__item">
                    <div className="converter__header">
                      <button
                        className="converter__remove"
                        onClick={() => handleCurrencyRemove(currency)}
                      >
                        x
                      </button>
                    </div>
                    <span className="converter__link">{currency}</span>
                    <div className="converter__form">
                      <input
                        className="converter__input"
                        type="number"
                        value={
                          currency === activeInputData.currency
                            ? activeInputData.value
                            : values[currency] === 0
                            ? "0"
                            : values[currency]?.toFixed(5).toString() || ""
                        }
                        onChange={(e) =>
                          handleCurrencyChange(currency, e.target.value)
                        }
                        onFocus={() =>
                          setActiveInputData({
                            currency,
                            value:
                              values[currency] === 0
                                ? ""
                                : values[currency]?.toFixed(5).toString() || "",
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <CurrencyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currencies={supportedCountries}
          onSelect={handleCurrencySelect}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default App;
