import { Expose, Transform } from "class-transformer";

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: string;
  @Expose()
  approved: string;

  @Transform(({obj}) => {
    return {
      id: obj.user.id,
      href: 'http://localhost:3000/auth/' + obj.user.id
    }
  })
  @Expose()
  user: {id: number, href: string};
}
