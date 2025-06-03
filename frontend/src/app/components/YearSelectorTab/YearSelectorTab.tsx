const YearSelectorTab = () => {
  return (
    <div className="flex justify-center gap-4 text-green-300 mb-6">
      {['2022', '2023', '2024'].map((year) => (
        <button key={year} className="hover:text-green-400 font-semibold">
          {year}
        </button>
      ))}
    </div>
  );
};

export default YearSelectorTab;
