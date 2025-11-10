export interface ILoginData {
  email: string
  password: string
  remember: boolean
}

export interface ILoginResponse {
  name: string
  email: string
  photo: string
  rol?: string
}

export interface IPermissions {
  title: string
  childrens: IChildrenPermissions[]
}

export interface IChildrenPermissions {
  title: string
}

export interface IUsersResponse {
  id: number
  username: string
  password: string
  name: string
  image: string
  rol: string
}

export interface IUserToCreate {
  username: string
  password: string
  name: string
  rol: string
}

export interface ISurveyResponse {
  id: number
  title: string
  description: string
  responses: number
  date: string
  status: string
}

export interface IQuestion {
  id: number
  title: string
  type: 'text' | 'textarea' | 'radio' | 'checkbox'
  options: string[]
  required: boolean
}
