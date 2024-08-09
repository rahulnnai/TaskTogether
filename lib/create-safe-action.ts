// It takes a Zod schema and an asynchronous handler function as arguments.
//  - Validates the input data against the provided schema.
//  - If validation fails, it returns detailed field errors.
//  - If validation succeeds, it processes the data using the provided handler function.
//  - The handler function returns a Promise of an ActionState, which can include the output data or error messages.

import { Schema, z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

//  Type Parameters:
//  TInput: The type of the input data to be validated.
//  TOutput: The type of the output data returned by the handler.

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const createSafeAction = <TInput, TOutput>(
  Schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = Schema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }
    return handler(validationResult.data);
  };
};
