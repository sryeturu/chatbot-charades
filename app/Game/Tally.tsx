import React, { memo } from 'react';
import straightTally from "../../public/images/straightTally.svg";
import diagonalTally from "../../public/images/diagonalTally.svg";
import Image from 'next/image';

interface TallyProps {
	count: number;
}

export const Tally = memo(function Tally({ count }: TallyProps) {
	const renderTallies = () => {
		const tallies: JSX.Element[] = [];

		let tallyGrouping: JSX.Element[] = [];

		for (let currentTally = 1; currentTally <= count; currentTally += 1) {
			if (currentTally % 5 === 0) {
				tallyGrouping.push(<Image key={currentTally} priority className="-ml-10 relative" src={diagonalTally} alt={`incorrect guess number ${currentTally}`} />);
				tallies.push(<div key={tallies.length} className="flex gap-[4px]">
					{tallyGrouping}
				</div>);
				tallyGrouping = [];
			} else {
				tallyGrouping.push(<Image key={currentTally} priority className="" src={straightTally} alt={`incorrect guess number ${currentTally}`} />);
			}
		}

		if (count % 5 !== 0) {
			tallies.push(<div key={tallies.length} className="flex gap-[4px]">
				{tallyGrouping}
			</div>);
		}

		return tallies;
	};

	return <div className="flex flex-wrap gap-5">{renderTallies()}</div>;
});
