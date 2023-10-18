export interface IQuery {
  page: string;
  limit: string;
  sortedBy: any;

  [key: string]: any;
}

export interface IPaginationResponse<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}
