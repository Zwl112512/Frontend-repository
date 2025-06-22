// src/components/HotelSearchBar.tsx
import { useSearchParams } from 'react-router-dom';

const LOCATIONS = [
  'Hong Kong Island',
  'Kowloon',
  'New Territories',
  'Lantau Island'
];

export default function HotelSearchBar() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const minStars = params.get('minStars') || '';
  const location = params.get('location') || '';

  const update = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
    setParams(params);
  };

  const handleSearch = () => {
    params.delete('page');
    setParams(params);
  };

  return (
    <form className="flex flex-wrap gap-2 items-center" onSubmit={e => e.preventDefault()}>
      <input
        type="text"
        value={search}
        placeholder="Search hotel name"
        onChange={e => update('search', e.target.value)}
        className="cyber-input w-48"
      />
      <select
        value={minStars}
        onChange={e => update('minStars', e.target.value)}
        className="cyber-select"
      >
        <option value="">Minimum Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>
      <select
        value={location}
        onChange={e => update('location', e.target.value)}
        className="cyber-select"
      >
        <option value="">Location</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <button
        type="submit"
        onClick={handleSearch}
        className="cyber-button"
      >
        Search
      </button>
    </form>
  );
}
