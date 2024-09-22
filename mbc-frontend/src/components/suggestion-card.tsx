const SuggestionCard = ({ title }: { title: string }) => {
  return (
    <div className="bg-gray-200 bg-opacity-30 min-h-32 w-full h-full rounded-lg p-4">
      <p className="text-gray-200">{title}</p>
    </div>
  );
};

export default SuggestionCard;
