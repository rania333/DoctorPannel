export interface IDoctor {
  //from signup
  id?: string,
  Name: string,
  nameInArabic: string
  email: string,
  phone: string,
  status: string,
  //from admin
  city?: string,
  area?: string,
  dpt?: string,
  dptAR?: string,
  Title?: string,
  titleInArabic?: string,
  Price?: string,
  nationalID?: string,
  Department: string,
  departmentInArabic: string,
  //from doctor
  Information?: string,
  InformationInArabic?: string,
  address?: string,
  addressAR?:string,
  Image?: string,
  //drived
  DOB?: string,
}
