export interface IDoctor {
  //from signup
  id?: string,
  name: string,
  nameAR: string
  email: string,
  phone: string,
  status: string,
  //from admin
  city?: string,
  cityAR?: string,
  area?: string,
  areaAR?: string,
  dpt?: string,
  dptAR?: string,
  title?: string,
  titleAR?: string,
  price?: string,
  nationalID?: string,
  //from doctor
  BIO?: string,
  BIOAR?: string,
  address?: string,
  addressAR?:string,
  img?: string,
  //drived
  DOB?: string,
}
