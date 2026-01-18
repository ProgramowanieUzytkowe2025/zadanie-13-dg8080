import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export function TabelaKursowa() {
    const [items, setItems] = useState([]);
    const [tableIndex, setTableIndex] = useState("A");

    useEffect(() => {
        fetch(`https://api.nbp.pl/api/exchangerates/tables/${tableIndex}`)
        .then(res => res.json())
        .then(data => setItems(data[0].rates));
    }, [tableIndex]);

    return (
        <div>
            <h2>Tabela kursowa</h2>
            <select size="3" value={tableIndex} onChange={(e) => setTableIndex(e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>

            <table border="2" style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>Waluta</th>
                        <th>Kod</th>
                        <th>Kurs</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.code}>
                            <td>{item.currency}</td>
                            <td>
                                <Link to={`/tabela-kursowa/${item.code}`} state={{ tableType: tableIndex }}>{item.code}</Link>
                            </td>
                            <td>
                                {tableIndex === "C" ? `${item.bid} / ${item.ask}` : item.mid}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}