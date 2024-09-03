import { useRef, useState } from "react";

const Searchbar = ({setQuery, minDelay = 500}) => {
  const [localQuery, setLocalQuery] = useState('');

  const lastUpdated = useRef(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    lastUpdated.current = Date.now();
     setLocalQuery(event.target.value);
     setTimeout(() => {
       if (Date.now() - lastUpdated.current >= minDelay) {
         setQuery(event.target.value);
       }
     }, minDelay);
   }

  return (
    <input
      type="text"
      placeholder="Search"
      value={localQuery}
      onChange={handleChange}
    />
  )
}

export default Searchbar;