export interface TaskAdviceResponseDto {
  advice: string | null;
}

export interface TitleSuggestionResponseDto {
  title?: string | null;
}

export interface TitleSuggestionRequestDto {
  description: string | null;
}

export interface DescriptionFormattingResponseDto {
  description: string | null;
}

export interface DescriptionFormattingRequestDto {
  description: string | null;
}