type CirclesProps = {
	numberOfCircles: number;
	filledCircles: number;
}

export function Circles({ numberOfCircles, filledCircles }: CirclesProps) {
  return (
      [...Array(numberOfCircles)].map((_, index) => (
          <div
              key={index}
              className={`w-3 h-3 rounded-full border border-gray-600 ${
                  index < filledCircles ? 'bg-gray-600' : ''
              }`}
          ></div>
      ))
  );
}
