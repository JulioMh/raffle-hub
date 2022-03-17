export interface Constraint {
  value: any;
  optional?: boolean;
  validator: {
    validate?(value: any): boolean;
    errorMessage: string;
  };
}

export type Constraints = Record<string, Constraint>;
