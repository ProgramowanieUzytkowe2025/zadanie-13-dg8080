import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

export function Waluta() {
    const { waluta } = useParams();
    const location = useLocation();
    const [currencyInfo, setCurrencyInfo] = useState(null);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [result, setResult] = useState(null);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const typ = location.state?.tableType || "A"; 
 
    useEffect(() => {
        fetch(`https://api.nbp.pl/api/exchangerates/rates/${typ}/${waluta}/`)
        .then(res => res.json())
        .then((data) => {
            setCurrencyInfo(data);
            setDataIsLoaded(true);
        })
        .catch((err) => {
            setError(err.message);
        });
    }, [waluta, typ]);
    if (!dataIsLoaded) {
        return (
            <div>
                <h1>Pobieram dane...</h1>
            </div>
        );
    }

    const handleCalculate = async (e) => {
        e.preventDefault();
        if (!date || !amount) return;
        let currentSearchDate = new Date(date);
        let success = false;
        let rate = 0;

        for (let i = 0; i < 7; i++) {
            const formattedDate = currentSearchDate.toISOString().split('T')[0];
            try {
                const response = await fetch(`https://api.nbp.pl/api/exchangerates/rates/${typ}/${waluta}/${formattedDate}/`);
                if (response.ok) {
                    const data = await response.json();
                    if (typ === 'C') rate = data.rates[0].ask;
                    else rate = data.rates[0].mid;
                    success = true;
                    break; 
                } 
                else {
                    currentSearchDate.setDate(currentSearchDate.getDate() - 1);
                }
            } 
            catch (err) {
                break;
            }
        }
        if (success) {
            setResult({
                value: (parseFloat(amount) * rate).toFixed(2),
                usedDate: currentSearchDate.toISOString().split('T')[0],
                rate: rate
            });
        } 
        else {
            alert("Błąd pobierania danych.");
        }
    };

    if (error) return <h1>Błąd: {error}</h1>;

    return (
        <div>
            <h1>{currencyInfo.currency} ({currencyInfo.code})</h1>
            {typ === 'C' ? (
                    <h2>Kurs kupna/sprzedaży: {currencyInfo.rates[0].bid}/{currencyInfo.rates[0].ask} PLN</h2>
                ) 
                : (
                    <h2>Aktualny kurs: <strong>{currencyInfo.rates[0].mid} PLN</strong></h2>
                )}

            <hr />
            
            <h3>Przelicz na PLN</h3>
            <form onSubmit={handleCalculate}>
                <div>
                    <label>
                        Kwota w {waluta}:
                        <input 
                            type="number" 
                            step="0.01" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Data kursu:
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div><button type="submit">Oblicz</button></div>
            </form>

            {result && (
                <div>
                    <h2>Wynik: {result.value} PLN</h2>
                    <p>Użyto kursu: {result.rate} z dnia {result.usedDate} {result.usedDate !== date && " (najbliższy dzień roboczy)"}</p>
                </div>
            )}
        </div>
    )
};