/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import * as cvstfjs from '@microsoft/customvision-tfjs'
import { useCallback, useState } from 'react'
import labels from './labels_index.json'

export const useCharacterImageClassifier = () => {
	const [isLoading, setIsLoading] = useState(false)
	const predict = useCallback(async (image: HTMLImageElement) => {
		setIsLoading(true)
		const model = new cvstfjs.ClassificationModel()
		await model.loadModelAsync(
			'/models/yoruba-character-recognition/model.json'
		)

		const [result]: number[][] = await model.executeAsync(image)

		console.log({ result })

		let highestIndex = 0
		for (let i = 0; i < result.length; i++) {
			if (result[i] > result[highestIndex]) {
				highestIndex = i
			}
		}

		console.log({ highestIndex })

		setIsLoading(false)
		model.dispose()
		return labels[highestIndex as unknown as keyof typeof labels]
	}, [])

	return { isLoading, predict }
}
