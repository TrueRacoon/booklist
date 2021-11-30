import { IBook } from '../models/book';
import longDataList from '../data/longDataList.json';

interface IBooksListResponse {
  status: number;
  data: { items: IBook[] };
}

export default (): Promise<IBooksListResponse> => (
  new Promise<IBooksListResponse>((resolve) => {
    resolve({
      status: 200,
      data: longDataList,
    });
  })
);
