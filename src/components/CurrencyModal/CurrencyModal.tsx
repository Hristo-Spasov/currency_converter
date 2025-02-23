import { SupportedCurrency } from "../../utils/fetchCurrencies";
import "./CurrencyModal.css";
type CurrencyModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  currencies: SupportedCurrency[];
  onSelect: (currency: string) => void;
};

const CurrencyModal = ({
  isOpen,
  onClose,
  currencies,
  onSelect,
  isLoading,
}: CurrencyModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal_backdrop" />
      <div className="modal">
        <div className="modal_content">
          <div className="modal_header">
            <h2>Select Currency</h2>
            <button className="close_btn" onClick={onClose}>
              x
            </button>
          </div>
          <div className="modal_body">
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="currency_option"
                  onClick={() => onSelect(currency.code)}
                >
                  <span>{currency.code}</span>
                  <span>{currency.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default CurrencyModal;
