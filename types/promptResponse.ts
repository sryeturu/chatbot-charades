export enum PromptResponseStatus {
	SUCCESS = 1,
  	FAILED = 0,
}

export interface PromptResponse {
	status: PromptResponseStatus;
	message: string
}
