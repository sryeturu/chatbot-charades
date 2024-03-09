"use server"

import { MongoClient } from "mongodb";

export async function fetchWords() {
	const COLLECTION_NAME = 'targetWords';
	const NUM_OF_TARGET_WORDS = parseInt(process.env.NUM_OF_TARGET_WORDS!);

	try {
		const client = await MongoClient.connect(process.env.MONGODB_URI!);
		const db = client.db();

		const result = await db
			.collection(COLLECTION_NAME)
			.aggregate([{ $sample: { size: NUM_OF_TARGET_WORDS } }])
			.project({ _id: 0, word: 1 })
			.toArray();

		client.close();

		const words = result.map(obj => obj.word);
		return words;

	} catch (error) {
		console.error('Error fetching random words:', error);
	}
}
