import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export function CenaZlota() {
    const [items, setItems] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [goldData, setGoldData] = useState([]);
   
    useEffect(() => {
        fetch("https://api.nbp.pl/api/cenyzlota")
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
                setDataIsLoaded(true);
            });
    }, []);
    useEffect(() => {
        fetch("https://api.nbp.pl/api/cenyzlota/last/30/")
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(item => ({
                date: item.data,
                price: item.cena
                }));
                setGoldData(formatted);
            });
    }, []);
    if (!dataIsLoaded) {
        return (
            <div>
                <h1>Pobieram dane...</h1>
            </div>
        );
    }
    return (
        <div>
            <h2>Cena zlota</h2>
            <div className="container">
                {items.map((item) => (
                    <div className="item" key={item.id}>
                        <div><h1>{item.cena}</h1></div>
                        <div>Na dzień: {item.data}</div>
                    </div>
                ))}
            </div>
            <hr/>
            <div>
                <LineChart width={1200} height={600} data={goldData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Line type="monotone" dataKey="price" stroke="#fffb00" strokeWidth={2} />
                    <Tooltip />
                </LineChart>
            </div>
        </div>
    )
};