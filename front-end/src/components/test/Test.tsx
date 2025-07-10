import { useEffect, useState } from "react";

const Test = () => {
  const [test, setTest] = useState("ok");

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTest(data.message);
      })
      .catch((error) => {
        console.error("A apărut o eroare la fetch:", error);
        setTest("Eroare la încărcarea mesajului");
      });
  }, []);

  return (
    <div>
      <h1>{test}</h1>
    </div>
  );
};

export default Test;
